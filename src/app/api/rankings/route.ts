import { NextResponse } from "next/server";
import { getRequestContext } from "@cloudflare/next-on-pages";
import { getPrisma } from "@/lib/prisma";

export const runtime = "edge";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const days = parseInt(searchParams.get("days") || "30", 10);

        const { env } = (getRequestContext() as any) || {};
        const prisma = getPrisma(env?.DB);

        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const rankings = await prisma.ranking.findMany({
            where: {
                date: {
                    gte: startDate,
                },
            },
            include: {
                keyword: true,
            },
            orderBy: {
                date: "asc",
            },
        });

        // Transform data for Recharts
        const dataMap: Record<string, any> = {};
        const linesMap: Record<string, { dataKey: string; stroke: string; name: string }> = {};

        // Assign a color based on index
        const colors = [
            "var(--primary)", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6",
            "#06b6d4", "#f97316", "#14b8a6", "#ec4899", "#84cc16",
            "#6366f1", "#eab308"
        ];

        let colorIndex = 0;

        rankings.forEach((r) => {
            const d = new Date(r.date);
            const dateStr = `${d.getMonth() + 1}/${d.getDate()}`;

            if (!dataMap[dateStr]) {
                dataMap[dateStr] = { date: dateStr };
            }

            const keyId = r.keywordId;
            dataMap[dateStr][keyId] = r.rank ?? null;

            if (!linesMap[keyId]) {
                linesMap[keyId] = {
                    dataKey: keyId,
                    stroke: colors[colorIndex % colors.length],
                    name: r.keyword.query + " (" + r.keyword.location + ")",
                };
                colorIndex++;
            }
        });

        return NextResponse.json({
            data: Object.values(dataMap),
            lines: Object.values(linesMap),
        });
    } catch (error) {
        console.error("Failed to fetch rankings:", error);
        return NextResponse.json({ error: "Failed to fetch rankings" }, { status: 500 });
    }
}
