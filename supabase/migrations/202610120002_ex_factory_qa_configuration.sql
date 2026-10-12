create table if not exists public.factory_inspection_area_setting (
  id uuid primary key default gen_random_uuid(),
  area_name text not null unique,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint factory_inspection_area_name_not_blank check (btrim(area_name) <> '')
);

create table if not exists public.factory_inspection_point_setting (
  id uuid primary key default gen_random_uuid(),
  area_id uuid not null references public.factory_inspection_area_setting(id) on delete cascade,
  point_name text not null,
  expected_result text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint factory_inspection_point_name_not_blank check (btrim(point_name) <> ''),
  unique (area_id, point_name)
);

alter table public.factory_inspection_line
  add column if not exists inspection_area_id uuid references public.factory_inspection_area_setting(id) on delete set null,
  add column if not exists inspection_point_id uuid references public.factory_inspection_point_setting(id) on delete set null;

create unique index if not exists factory_inspection_line_configured_point_key
  on public.factory_inspection_line(factory_inspection_id, vendor_purchase_order_line_id, inspection_point_id)
  where inspection_point_id is not null;

create table if not exists public.factory_inspection_line_image (
  id uuid primary key default gen_random_uuid(),
  factory_inspection_line_id uuid not null references public.factory_inspection_line(id) on delete cascade,
  file_id uuid not null references public.attachment(id) on delete restrict,
  display_name text,
  uploaded_at timestamptz not null default now()
);

create index if not exists factory_inspection_line_image_line_idx
  on public.factory_inspection_line_image(factory_inspection_line_id, uploaded_at desc);

grant select, insert, update, delete on table public.factory_inspection_area_setting to service_role;
grant select, insert, update, delete on table public.factory_inspection_point_setting to service_role;
grant select, insert, update, delete on table public.factory_inspection_line_image to service_role;

insert into public.factory_inspection_area_setting (area_name, sort_order)
values
  ('纸箱包装状况 (Packing Condition)', 10),
  ('整体尺寸 (Overall Measurement)', 20),
  ('灯具整体外观 (Overall Appearance)', 30),
  ('结构 (Structure)', 40),
  ('电气部分 (Electrical)', 50),
  ('专用于LED的质检 (LED Inspection)', 60)
on conflict (area_name) do update set sort_order = excluded.sort_order, is_active = true;

with points(area_name, point_name, expected_result, sort_order) as (
  values
    ('纸箱包装状况 (Packing Condition)', '包装纸板 (Cardboard)', 'K=K or 200 LBS, according to the approved SKU specification', 10),
    ('纸箱包装状况 (Packing Condition)', '包装印刷标识 (Printed Mark)', 'Carton markings and labels match the approved SKU information', 20),
    ('纸箱包装状况 (Packing Condition)', '包装泡沫 (Foam)', '12KG foam or the approved SKU packaging specification', 30),
    ('纸箱包装状况 (Packing Condition)', '纸箱跌落测试 (Carton Drop Test)', 'Complete when required by the approved SKU specification', 40),
    ('纸箱包装状况 (Packing Condition)', '安装说明书 (Installation Instructions)', 'Correct installation instructions are included in the carton', 50),
    ('纸箱包装状况 (Packing Condition)', '箱体尺寸 (Box Dimensions)', 'Matches the dimensions printed on the white carton label and approved SKU specification', 60),
    ('纸箱包装状况 (Packing Condition)', '净重 (Net Weight)', 'Matches the net weight printed on the white carton label and approved SKU specification', 70),
    ('纸箱包装状况 (Packing Condition)', '毛重 (Gross Weight)', 'Matches the gross weight printed on the white carton label and approved SKU specification', 80),
    ('纸箱包装状况 (Packing Condition)', '放置顶部泡沫板 (Top Foam Board)', 'A top foam board is present in every carton', 90),
    ('纸箱包装状况 (Packing Condition)', '所有配件 (All Accessories)', 'No accessories are missing, including canopy, mounting hardware, chain, and glass', 100),
    ('纸箱包装状况 (Packing Condition)', '内部包装固定牢固 (Internal Packaging Secure)', 'Fixture and accessories do not move inside the carton', 110),
    ('整体尺寸 (Overall Measurement)', '电线长度 (Wire Length)', 'Matches the approved SKU specification', 10),
    ('整体尺寸 (Overall Measurement)', '安全钢绳的长度 (Safety Cable Length)', 'Matches the approved SKU specification', 20),
    ('整体尺寸 (Overall Measurement)', '吊链长度 (Chain Length)', 'Matches the approved SKU specification', 30),
    ('整体尺寸 (Overall Measurement)', '吊杆数量及长度 (Rod Quantity and Length)', 'Matches the approved SKU specification', 40),
    ('整体尺寸 (Overall Measurement)', '吊杆直径 (Rod Diameter)', 'Matches the approved SKU specification', 50),
    ('整体尺寸 (Overall Measurement)', '灯体整体尺寸 (Fixture Dimensions)', 'Matches the approved SKU specification', 60),
    ('灯具整体外观 (Overall Appearance)', '整体平衡 (Overall Balance)', 'Fixture is level and does not tilt', 10),
    ('灯具整体外观 (Overall Appearance)', '焊接与连接的质量 (Welding and Connection Quality)', 'No welding scars, weak welds, misalignment, looseness, burn-through, pinholes, protrusions, or depressions', 20),
    ('灯具整体外观 (Overall Appearance)', '主体框架的表面处理质量 (Frame Surface Finish Quality)', 'Finish is even and smooth, without stains, corrosion, defects, or visible color differences', 30),
    ('灯具整体外观 (Overall Appearance)', '表面颜色与样品一致程度 (Color Match to Sample)', 'Surface color matches the approved sample', 40),
    ('灯具整体外观 (Overall Appearance)', '吊链、吸顶盘外观 (Chain and Canopy Appearance)', 'Chain and canopy match the fixture frame color and approved product image', 50),
    ('灯具整体外观 (Overall Appearance)', '电线颜色 (Wire Color)', 'Wire color matches the approved SKU specification and product image', 60),
    ('结构 (Structure)', '结构稳定性 (Structural Stability)', 'No looseness, deformation, or tilting', 10),
    ('结构 (Structure)', '壁灯/吸顶灯贴合度 (Wall and Ceiling Mount Fit)', 'Backplate sits flat; illuminated fixture has no light leakage or tilt', 20),
    ('结构 (Structure)', '吊链的强度 (Chain Strength)', 'Chain supports four times the fixture weight during the hanging test', 30),
    ('结构 (Structure)', '吊环吃牙 (Loop Thread Engagement)', 'Connector engages 6-8 threads; most applications use 12 threads', 40),
    ('结构 (Structure)', '吊环滑牙 (Loop Thread Locking)', 'Loop has a side locking screw to prevent thread slippage', 50),
    ('结构 (Structure)', '零件部连接 (Part Connections)', 'Parts fit securely; screws and threaded holes do not strip', 60),
    ('电气部分 (Electrical)', '灯头规格 (Socket Specification)', 'Matches the approved SKU specification, such as E12 or E26', 10),
    ('电气部分 (Electrical)', '灯头稳定性 (Socket Stability)', 'Socket is firmly locked and does not loosen or crack under force', 20),
    ('电气部分 (Electrical)', '灯头配灯泡测试 (Lamp Test)', 'Every socket is tested with a lamp and illuminates correctly', 30),
    ('电气部分 (Electrical)', '电源线的电气规格 (Power Cord Specification)', 'Size and color comply with the approved UL/ETL safety specification', 40),
    ('电气部分 (Electrical)', '高压测试 (High-Voltage Test)', 'Passes the required 1300K-1800K high-voltage test', 50),
    ('专用于LED的质检 (LED Inspection)', '驱动器 (Driver)', 'Driver is UL or ETL certified when applicable', 10),
    ('专用于LED的质检 (LED Inspection)', '调光测试 (Dimming Test)', 'LED dims correctly when the SKU is dimmable', 20),
    ('专用于LED的质检 (LED Inspection)', 'LED闪烁/闪频 (LED Flicker)', 'No LED flicker is visible in the inspection video', 30),
    ('专用于LED的质检 (LED Inspection)', 'LED技术指标 - 色温 (Color Temperature)', 'Matches the approved SKU specification', 40),
    ('专用于LED的质检 (LED Inspection)', 'LED技术指标 - 亮度 (Brightness)', 'Matches the approved SKU specification', 50),
    ('专用于LED的质检 (LED Inspection)', 'LED技术指标 - 功率 (Power)', 'Matches the approved SKU specification', 60)
)
insert into public.factory_inspection_point_setting (area_id, point_name, expected_result, sort_order)
select area.id, points.point_name, points.expected_result, points.sort_order
from points
join public.factory_inspection_area_setting area on area.area_name = points.area_name
on conflict (area_id, point_name) do update
set expected_result = excluded.expected_result,
    sort_order = excluded.sort_order,
    is_active = true;
