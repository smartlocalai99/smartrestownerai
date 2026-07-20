import { AreaChart, Area, ResponsiveContainer } from "recharts";
import { CHART_COLORS } from "@/lib/chartColors";

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export default function HeroStat({ label, value, orderCount, trend }) {
  const showSparkline = trend && trend.length > 1;

  return (
    <div className="shadow-soft-lg relative overflow-hidden rounded-3xl border border-line/60 bg-surface p-5">
      <div className="pointer-events-none absolute -right-10 -top-14 h-40 w-40 rounded-full bg-accent/[0.07] blur-2xl" />

      <p className="relative text-xs font-medium uppercase tracking-wide text-muted">{label}</p>
      <p className="relative mt-1.5 font-display text-[2.75rem] font-semibold leading-none tracking-tight text-ink">
        {currency.format(value)}
      </p>
      <p className="relative mt-2 text-sm text-muted">
        {orderCount} {orderCount === 1 ? "order" : "orders"}
      </p>

      {showSparkline ? (
        <div className="relative mt-3 h-14 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trend} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="heroSparkFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={CHART_COLORS.accent} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={CHART_COLORS.accent} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="total"
                stroke={CHART_COLORS.accent}
                strokeWidth={2}
                fill="url(#heroSparkFill)"
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      ) : null}
    </div>
  );
}
