begin;

create or replace function public.issue_rga_credit_memos_with_overrides(
  p_rga_id uuid,
  p_line_credit_amount_overrides jsonb default '{}'::jsonb
)
returns table (credit_memo_id uuid, credit_memo_number text)
language plpgsql
security definer
set search_path = public
as $$
declare
  rga_row public.rga%rowtype;
  brand_row record;
  line_row record;
  actor_id uuid;
  memo_id uuid;
  memo_number text;
  product_credit_total numeric(14, 2);
  line_credit_amount numeric(14, 2);
  override_text text;
begin
  select * into rga_row from public.rga where id = p_rga_id for update;
  if not found then raise exception 'RGA % was not found.', p_rga_id; end if;
  if rga_row.approved_resolution_type is distinct from 'credit'::public.rga_resolution_type then
    raise exception 'RGA % is not approved for a credit memo.', rga_row.rga_number;
  end if;
  if rga_row.status not in ('authorized', 'awaiting_credit_memo') then
    raise exception 'RGA % must be authorized before issuing a credit memo.', rga_row.rga_number;
  end if;

  perform 1 from public.rga_line where rga_id = rga_row.id for update;
  if exists (select 1 from public.credit_memo where rga_id = rga_row.id and status <> 'void') then
    raise exception 'A credit memo has already been issued for RGA %.', rga_row.rga_number;
  end if;

  actor_id := coalesce(rga_row.updated_by_user_id, rga_row.created_by_user_id, rga_row.authorized_by_user_id);
  if actor_id is null then
    select id into actor_id from public.user_account where is_active and user_type = 'internal' order by created_at, id limit 1;
  end if;
  if actor_id is null then raise exception 'An active internal user is required to issue an RGA credit memo.'; end if;

  for brand_row in
    select rl.brand_id_snapshot as brand_id
      from public.rga_line rl
     where rl.rga_id = rga_row.id
       and rl.credit_required
       and rl.quantity_authorized > rl.quantity_credited
     group by rl.brand_id_snapshot
     order by rl.brand_id_snapshot
  loop
    if brand_row.brand_id is null then raise exception 'RGA % has a credit line without a brand.', rga_row.rga_number; end if;
    product_credit_total := 0;

    for line_row in
      select rl.id, rl.quantity_authorized, rl.quantity_credited, sol.unit_price, sol.discount_percent
        from public.rga_line rl
        join public.sales_order_line sol on sol.id = rl.sales_order_line_id
       where rl.rga_id = rga_row.id
         and rl.brand_id_snapshot = brand_row.brand_id
         and rl.credit_required
         and rl.quantity_authorized > rl.quantity_credited
    loop
      override_text := p_line_credit_amount_overrides ->> line_row.id::text;
      if override_text is null or btrim(override_text) = '' then
        line_credit_amount := round(
          (line_row.quantity_authorized - line_row.quantity_credited)
          * round(line_row.unit_price * (1 - line_row.discount_percent / 100), 2),
          2
        );
      elsif override_text !~ '^\d+(\.\d{1,2})?$' then
        raise exception 'Credit amount for RGA line % must be a nonnegative currency amount.', line_row.id;
      else
        line_credit_amount := round(override_text::numeric, 2);
      end if;
      product_credit_total := product_credit_total + line_credit_amount;
    end loop;

    insert into public.credit_memo as cm (
      credit_memo_number, brand_id, customer_account_id, rga_id, issue_date, status, reason_code,
      product_credit_amount, shipping_refund_amount, additional_credit_amount, tax_credit_amount,
      restocking_fee_percent, restocking_fee_amount, customer_name_snapshot, brand_name_snapshot,
      posted_by_user_id, posted_at, created_by_user_id, updated_by_user_id, notes
    ) values (
      '', brand_row.brand_id, rga_row.customer_account_id, rga_row.id, current_date, 'posted', 'defect',
      product_credit_total, 0, 0, 0, 0, 0, '', '', actor_id, now(), actor_id, actor_id,
      format('Issued from RGA %s.', rga_row.rga_number)
    ) returning cm.id, cm.credit_memo_number into memo_id, memo_number;

    for line_row in
      select rl.id, rl.customer_invoice_line_id, rl.product_id, rl.product_name_snapshot, rl.product_sku_snapshot,
             rl.quantity_authorized, rl.quantity_credited, sol.unit_price, sol.discount_percent
        from public.rga_line rl
        join public.sales_order_line sol on sol.id = rl.sales_order_line_id
       where rl.rga_id = rga_row.id
         and rl.brand_id_snapshot = brand_row.brand_id
         and rl.credit_required
         and rl.quantity_authorized > rl.quantity_credited
    loop
      override_text := p_line_credit_amount_overrides ->> line_row.id::text;
      if override_text is null or btrim(override_text) = '' then
        line_credit_amount := round(
          (line_row.quantity_authorized - line_row.quantity_credited)
          * round(line_row.unit_price * (1 - line_row.discount_percent / 100), 2),
          2
        );
      else
        line_credit_amount := round(override_text::numeric, 2);
      end if;

      insert into public.credit_memo_line (
        credit_memo_id, rga_line_id, customer_invoice_line_id, product_id, description,
        quantity, unit_amount, restocking_fee_amount
      ) values (
        memo_id, line_row.id, line_row.customer_invoice_line_id, line_row.product_id,
        coalesce(nullif(line_row.product_name_snapshot, ''), line_row.product_sku_snapshot),
        line_row.quantity_authorized - line_row.quantity_credited,
        round(line_credit_amount / (line_row.quantity_authorized - line_row.quantity_credited), 2), 0
      );
    end loop;

    update public.rga_line
       set quantity_credited = quantity_authorized,
           status = 'credited',
           updated_by_user_id = actor_id,
           updated_at = now()
     where rga_id = rga_row.id
       and brand_id_snapshot = brand_row.brand_id
       and credit_required
       and quantity_authorized > quantity_credited;

    credit_memo_id := memo_id;
    credit_memo_number := memo_number;
    return next;
  end loop;

  if not found then raise exception 'RGA % has no authorized credit quantity remaining.', rga_row.rga_number; end if;

  update public.rga
     set status = 'closed', closed_date = current_date, updated_by_user_id = actor_id, updated_at = now()
   where id = rga_row.id;
  insert into public.rga_status_history (rga_id, old_status, new_status, changed_by_user_id, reason, notes)
  values (rga_row.id, rga_row.status, 'closed', actor_id, 'Credit memo issued', 'All authorized credit lines were posted to brand-specific credit memo(s).');
end;
$$;

revoke all on function public.issue_rga_credit_memos_with_overrides(uuid, jsonb) from public;
grant execute on function public.issue_rga_credit_memos_with_overrides(uuid, jsonb) to service_role;

commit;
