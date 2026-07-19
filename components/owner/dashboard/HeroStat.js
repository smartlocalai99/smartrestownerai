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
    <div className="relative overflow-hidden rounded-3xl border border-line bg-surface p-5">
      <p className="text-xs font-medium uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-1.5 font-sans text-[2.75rem] font-semibold leading-none text-ink">
        {currency.format(value)}
      </p>
      <p className="mt-2 text-sm text-muted">
        {orderCount} {orderCount === 1 ? "order" : "orders"}
      </p>

      {showSparkline ? (
        <div className="mt-3 h-14 w-full">
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
