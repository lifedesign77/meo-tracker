export function Header() {
    return (
        <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex flex-1 items-center gap-4">
                <h1 className="text-xl font-semibold tracking-tight">ダッシュボード</h1>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                12:00 PM 同期済み
            </div>
        </header>
    );
}
