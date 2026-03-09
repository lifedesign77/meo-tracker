"use client";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

interface RankingDataPoint {
    date: string;
    [key: string]: string | number;
}

interface RankingChartProps {
    data: RankingDataPoint[];
    lines: { dataKey: string; stroke: string; name: string }[];
}

export function RankingChart({ data, lines }: RankingChartProps) {
    return (
        <div className="h-[400px] w-full rounded-xl border border-border bg-card p-4 shadow-sm">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={data}
                    margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 10,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                    <XAxis
                        dataKey="date"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                        dy={10}
                    />
                    <YAxis
                        reversed={true}
                        domain={[1, 'auto']}
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                        dx={-10}
                        tickFormatter={(value) => `${value}位`}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: "var(--card)",
                            border: "1px solid var(--border)",
                            borderRadius: "8px",
                            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                        }}
                        itemStyle={{ color: "var(--foreground)" }}
                    />
                    <Legend wrapperStyle={{ paddingTop: "20px" }} />
                    {lines.map((line, index) => (
                        <Line
                            key={index}
                            type="monotone"
                            dataKey={line.dataKey}
                            name={line.name}
                            stroke={line.stroke}
                            strokeWidth={3}
                            dot={{ r: 4, strokeWidth: 2 }}
                            activeDot={{ r: 6, strokeWidth: 0 }}
                        />
                    ))}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
