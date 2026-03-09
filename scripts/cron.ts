import cron from "node-cron";
import "dotenv/config";
import { fetchRankings } from "../src/lib/serpapi";
import { prisma } from "../src/lib/prisma";


console.log("Starting MEO Tracker Cron Service...");

const SERPAPI_KEY = process.env.SERPAPI_KEY || "";

// Schedule a job to run every day at 12:00 PM (Noon) server time
cron.schedule("0 12 * * *", async () => {
    console.log(`[${new Date().toISOString()}] Running daily MEO ranking fetch...`);
    await fetchRankings(prisma, SERPAPI_KEY);
    console.log(`[${new Date().toISOString()}] Daily MEO ranking fetch completed.`);
});


console.log("Cron job scheduled. Waiting for next run at 12:00 PM...");

// Keep the process alive
process.on("SIGINT", () => {
    console.log("Shutting down Cron Service...");
    process.exit(0);
});
