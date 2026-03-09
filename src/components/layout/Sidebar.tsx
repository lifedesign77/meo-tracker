import Link from "next/link";
import { LayoutDashboard, Target } from "lucide-react";

export function Sidebar({ className }: { className?: string }) {
    return (
        <div className={`flex h-full w-64 flex-col bg-card border-r border-border ${className || ""}`}>
            <div className="flex h-16 shrink-0 items-center px-6 font-bold text-lg border-b border-border tracking-tight text-primary">
                MEO Tracker
            </div>
            <div className="flex flex-1 flex-col overflow-y-auto px-4 py-6 gap-2">
                <Link
                    href="/"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted text-foreground transition-colors group"
                >
                    <LayoutDashboard className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    ダッシュボード
                </Link>
                <Link
                    href="/keywords"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted text-foreground transition-colors group"
                >
                    <Target className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    キーワード管理
                </Link>
            </div>
        </div>
    );
}
