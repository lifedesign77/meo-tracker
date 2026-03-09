import { NextResponse } from "next/server";
import { getRequestContext } from "@cloudflare/next-on-pages";
import { getPrisma } from "@/lib/prisma";
import { fetchRankings } from "@/lib/serpapi";

export const runtime = "edge";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get("key");

    const { env } = (getRequestContext() as any) || {};

    // Cloudflare Secrets/Environment variables from env object
    const cronKey = env?.CRON_SECRET;
    const serpApiKey = env?.SERPAPI_KEY;

    // Simple token-based security
    if (cronKey && key !== cronKey) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const prisma = getPrisma(env?.DB);

        if (!serpApiKey) {
            throw new Error("SERPAPI_KEY is not defined in environment.");
        }

        await fetchRankings(prisma, serpApiKey);

        return NextResponse.json({
            success: true,
            message: "Daily ranking update triggered successfully."
        });
    } catch (error: any) {
        console.error("Cron job error:", error);
        return NextResponse.json({
            error: "Cron job failed",
            details: error.message
        }, { status: 500 });
    }
}
