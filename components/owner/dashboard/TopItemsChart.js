import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from "recharts";
import { CHART_COLORS } from "@/lib/chartColors";

function ItemTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const { title, qty } = payload[0].payload;
  return (
    <div className="rounded-xl border border-line bg-canvas px-3 py-2 shadow-lg">
      <p className="text-xs text-muted">{title}</p>
      <p className="mt-0.5 text-sm font-semibold text-ink">{qty} sold</p>
    </div>
  );
}

export default function TopItemsChart({ items }) {
  if (!items.length) {
    return <p className="py-6 text-center text-sm text-muted">No orders in this range yet.</p>;
  }

  const chartHeight = Math.max(items.length * 40, 120);

  return (
    <div style={{ height: chartHeight }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={items}
          layout="vertical"
          margin={{ top: 0, right: 28, bottom: 0, left: 0 }}
          barCategoryGap={8}
        >
          <CartesianGrid horizontal={false} stroke={CHART_COLORS.line} />
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="title"
            width={120}
            tick={{ fill: CHART_COLORS.ink, fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<ItemTooltip />} cursor={{ fill: CHART_COLORS.line, opacity: 0.4 }} />
          <Bar dataKey="qty" fill={CHART_COLORS.accent} radius={[0, 4, 4, 0]} barSize={20}>
            <LabelList
              dataKey="qty"
              position="right"
              style={{ fill: CHART_COLORS.muted, fontSize: 12, fontWeight: 600 }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
