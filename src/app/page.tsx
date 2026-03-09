"use client";

import { useEffect, useState } from "react";
import { RankingChart } from "@/components/ui/RankingChart";

export default function Home() {
  const [data, setData] = useState<any[]>([]);
  const [lines, setLines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [keywordCount, setKeywordCount] = useState(0);
  const [currentAvg, setCurrentAvg] = useState<string>("-");

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        // Fetch keyword count
        const kwRes = await fetch("/api/keywords");
        if (kwRes.ok) {
          const kws = await kwRes.json();
          setKeywordCount(kws.length);
        }

        // Fetch ranking data
        const rRes = await fetch("/api/rankings");
        if (rRes.ok) {
          const rData = await rRes.json();
          setData(rData.data || []);
          setLines(rData.lines || []);

          // Calculate the average rank for the latest day if available
          if (rData.data && rData.data.length > 0) {
            const latestDataPoint = rData.data[rData.data.length - 1];
            let sum = 0;
            let count = 0;
            Object.keys(latestDataPoint).forEach((key) => {
              if (key !== "date" && typeof latestDataPoint[key] === "number") {
                sum += latestDataPoint[key];
                count++;
              }
            });
            if (count > 0) {
              setCurrentAvg((Math.round((sum / count) * 10) / 10).toString());
            }
          }
        }
      } catch (e) {
        console.error("Dashboard fetch error:", e);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">順位推移 (直近30日)</h2>
        <p className="text-muted-foreground mt-1">
          登録されたキーワードごとのGoogleマップでの検索順位推移です。
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {/* Summary Cards */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="text-sm font-medium text-muted-foreground mb-2">平均順位 (最新)</div>
          <div className="text-3xl font-bold">{currentAvg !== "-" ? `${currentAvg}位` : "-"}</div>
        </div>
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="text-sm font-medium text-muted-foreground mb-2">登録キーワード数</div>
          <div className="text-3xl font-bold">{keywordCount} / 12</div>
        </div>
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="text-sm font-medium text-muted-foreground mb-2">次回更新</div>
          <div className="text-3xl font-bold">明日 12:00</div>
        </div>
      </div>

      <div className="mt-4 relative">
        {loading && (
          <div className="absolute inset-0 z-10 bg-background/50 flex items-center justify-center rounded-xl backdrop-blur-sm transition-all duration-300">
            <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
          </div>
        )}
        {data.length === 0 && !loading ? (
          <div className="h-[400px] w-full rounded-xl border border-border bg-card p-4 shadow-sm flex items-center justify-center flex-col text-muted-foreground">
            <p>ランキングデータがありません。</p>
            <p className="text-sm">キーワードを登録し、次回の同期をお待ちください。</p>
          </div>
        ) : (
          <RankingChart data={data} lines={lines} />
        )}
      </div>
    </div>
  );
}
