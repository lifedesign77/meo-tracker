import { getJson } from "serpapi";

export async function fetchRankings(prisma: any, serpApiKey: string) {
    if (!serpApiKey) {
        console.error("Missing SERPAPI_KEY environment variable.");
        return;
    }

    try {
        const keywords = await prisma.keyword.findMany();
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (const kw of keywords) {
            console.log(`Fetching ranking for: ${kw.query} in ${kw.location}...`);

            try {
                const response = await getJson({
                    engine: "google_local",
                    q: kw.query,
                    location: kw.location,
                    api_key: serpApiKey,
                    hl: "ja",
                    gl: "jp",
                });

                const localResults = response.local_results || [];
                let rank: number | null = null;

                for (let i = 0; i < localResults.length; i++) {
                    const result = localResults[i];
                    if (result.title && result.title.includes(kw.targetBusiness)) {
                        rank = i + 1;
                        break;
                    }
                }

                await prisma.ranking.upsert({
                    where: {
                        date_keywordId: {
                            date: today,
                            keywordId: kw.id,
                        },
                    },
                    update: {
                        rank: rank,
                    },
                    create: {
                        keywordId: kw.id,
                        date: today,
                        rank: rank,
                    },
                });

                console.log(`Saved rank ${rank || "Not Found"} for ${kw.query}`);

            } catch (err) {
                console.error(`Failed to fetch serpapi for ${kw.query}:`, err);
            }

            // Delay for rate limiting
            await new Promise((resolve) => setTimeout(resolve, 1000));
        }

        console.log("Finished daily ranking update.");
    } catch (error) {
        console.error("Error in fetchRankings job:", error);
    }
}
