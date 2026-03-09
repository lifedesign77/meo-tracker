import { NextResponse } from "next/server";
import { getRequestContext } from "@cloudflare/next-on-pages";
import { getPrisma } from "@/lib/prisma";

export const runtime = "edge";

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const { env } = (getRequestContext() as any) || {};
        const prisma = getPrisma(env?.DB);

        await prisma.keyword.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Failed to delete keyword:", error);
        return NextResponse.json({ error: "Failed to delete keyword" }, { status: 500 });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const { query, location, targetBusiness } = (await request.json()) as any;

        const { env } = (getRequestContext() as any) || {};
        const prisma = getPrisma(env?.DB);

        if (!query || !location || !targetBusiness) {
            return NextResponse.json(
                { error: "Query, location, and target business are required." },
                { status: 400 }
            );
        }

        const keyword = await prisma.keyword.update({
            where: { id },
            data: {
                query,
                location,
                targetBusiness,
            },
        });

        return NextResponse.json(keyword);
    } catch (error) {
        console.error("Failed to update keyword:", error);
        return NextResponse.json({ error: "Failed to update keyword" }, { status: 500 });
    }
}
