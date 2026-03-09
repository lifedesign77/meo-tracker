import { PrismaClient } from "@prisma/client";
import { PrismaD1 } from "@prisma/adapter-d1";

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

/**
 * Creates a Prisma client. 
 * On Cloudflare, we pass the D1 database binding.
 * On local, it defaults to the standard SQLite client.
 */
export function getPrisma(d1?: any) {
    if (d1) {
        const adapter = new PrismaD1(d1);
        return new PrismaClient({ adapter });
    }

    if (globalForPrisma.prisma) {
        return globalForPrisma.prisma;
    }

    const client = new PrismaClient();
    if (process.env.NODE_ENV !== "production") {
        globalForPrisma.prisma = client;
    }
    return client;
}

// Default export for backward compatibility if not running on Cloudflare
export const prisma = getPrisma();
