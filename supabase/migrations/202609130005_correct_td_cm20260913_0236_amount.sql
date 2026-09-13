begin;

do $$
declare
  target_memo_id uuid;
  target_line_count integer;
begin
  select id into target_memo_id
    from public.credit_memo
   where credit_memo_number = 'TD-CM20260913-0236';

  if target_memo_id is null then
    raise exception 'Credit memo TD-CM20260913-0236 was not found.';
  end if;

  select count(*) into target_line_count
    from public.credit_memo_line
   where credit_memo_id = target_memo_id;

  if target_line_count <> 1 then
    raise exception 'Credit memo TD-CM20260913-0236 must have exactly one line to apply this correction.';
  end if;

  update public.credit_memo_line
     set unit_amount = round(890.00 / quantity, 2),
         restocking_fee_amount = 0
   where credit_memo_id = target_memo_id;

  update public.credit_memo
     set product_credit_amount = 890.00,
         updated_at = now()
   where id = target_memo_id;
end;
$$;

commit;
