import { AreaChart, Area, XAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { CHART_COLORS } from "@/lib/chartColors";

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const dayLabel = (iso) => {
  const [, m, d] = iso.split("-");
  return `${d}/${m}`;
};

function TrendTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-line bg-canvas px-3 py-2 shadow-lg">
      <p className="font-mono text-[11px] text-muted">{dayLabel(label)}</p>
      <p className="mt-0.5 text-sm font-semibold text-ink">{currency.format(payload[0].value)}</p>
    </div>
  );
}

export default function SalesTrendChart({ trend }) {
  return (
    <div className="h-40 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={trend} margin={{ top: 8, right: 8, bottom: 0, left: 8 }}>
          <defs>
            <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={CHART_COLORS.accent} stopOpacity={0.3} />
              <stop offset="100%" stopColor={CHART_COLORS.accent} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke={CHART_COLORS.line} strokeDasharray="0" />
          <XAxis
            dataKey="day"
            tickFormatter={dayLabel}
            tick={{ fill: CHART_COLORS.muted, fontSize: 11 }}
            axisLine={{ stroke: CHART_COLORS.line }}
            tickLine={false}
          />
          <Tooltip content={<TrendTooltip />} cursor={{ stroke: CHART_COLORS.line, strokeWidth: 1 }} />
          <Area
            type="monotone"
            dataKey="total"
            stroke={CHART_COLORS.accent}
            strokeWidth={2}
            fill="url(#trendFill)"
            activeDot={{ r: 4, fill: CHART_COLORS.accent, stroke: CHART_COLORS.surface, strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
