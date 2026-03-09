import { NextResponse } from "next/server";
import { getRequestContext } from "@cloudflare/next-on-pages";
import { getPrisma } from "@/lib/prisma";

export const runtime = "edge";

export async function GET() {
    try {
        const { env } = (getRequestContext() as any) || {};
        const prisma = getPrisma(env?.DB);
        const keywords = await prisma.keyword.findMany({
            orderBy: { createdAt: "asc" },
        });
        return NextResponse.json(keywords);
    } catch (error) {
        console.error("Failed to fetch keywords:", error);
        return NextResponse.json({ error: "Failed to fetch keywords" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const { env } = (getRequestContext() as any) || {};
        const prisma = getPrisma(env?.DB);

        const count = await prisma.keyword.count();
        if (count >= 12) {
            return NextResponse.json({ error: "Maximum number of keywords (12) reached." }, { status: 400 });
        }

        const { query, location, targetBusiness } = (await request.json()) as any;

        if (!query || !location || !targetBusiness) {
            return NextResponse.json(
                { error: "Query, location, and target business are required." },
                { status: 400 }
            );
        }

        const keyword = await prisma.keyword.create({
            data: {
                query,
                location,
                targetBusiness,
            },
        });

        return NextResponse.json(keyword, { status: 201 });
    } catch (error) {
        console.error("Failed to create keyword:", error);
        return NextResponse.json({ error: "Failed to create keyword" }, { status: 500 });
    }
}
