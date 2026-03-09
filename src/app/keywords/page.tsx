"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, Loader2, Target } from "lucide-react";

interface Keyword {
    id: string;
    query: string;
    location: string;
    targetBusiness: string;
}

export default function KeywordsPage() {
    const [keywords, setKeywords] = useState<Keyword[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Form states
    const [query, setQuery] = useState("");
    const [location, setLocation] = useState("");
    const [targetBusiness, setTargetBusiness] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchKeywords();
    }, []);

    const fetchKeywords = async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/keywords");
            if (res.ok) {
                const data = await res.json();
                setKeywords(data);
            }
        } catch (error) {
            console.error("Failed to fetch keywords", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!query || !location || !targetBusiness) return;
        try {
            setSubmitting(true);
            const url = editingId ? `/api/keywords/${editingId}` : "/api/keywords";
            const method = editingId ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query, location, targetBusiness }),
            });

            if (res.ok) {
                await fetchKeywords();
                cancelEdit();
            }
        } catch (error) {
            console.error("Failed to save keyword", error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("本当に削除しますか？このキーワードの順位履歴も削除されます。")) return;
        try {
            const res = await fetch(`/api/keywords/${id}`, { method: "DELETE" });
            if (res.ok) {
                await fetchKeywords();
            }
        } catch (error) {
            console.error("Failed to delete keyword", error);
        }
    };

    const startEdit = (kw: Keyword) => {
        setEditingId(kw.id);
        setQuery(kw.query);
        setLocation(kw.location);
        setTargetBusiness(kw.targetBusiness);
        setIsAdding(true);
    };

    const cancelEdit = () => {
        setIsAdding(false);
        setEditingId(null);
        setQuery("");
        setLocation("");
        setTargetBusiness("");
    };

    return (
        <div className="flex flex-col gap-6 w-full animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">キーワード管理</h2>
                    <p className="text-muted-foreground mt-1">
                        追跡する検索キーワードとターゲット店舗を設定します。（最大12個）
                    </p>
                </div>
                <button
                    onClick={() => {
                        cancelEdit();
                        setIsAdding(true);
                    }}
                    disabled={keywords.length >= 12 || isAdding}
                    className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Plus className="h-4 w-4" />
                    新規追加
                </button>
            </div>

            <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-border flex justify-between items-center bg-muted/20">
                    <div className="flex items-center gap-2">
                        <Target className="h-5 w-5 text-primary" />
                        <h3 className="font-semibold">登録済みキーワード</h3>
                    </div>
                    <span className="text-sm font-medium bg-muted px-2.5 py-1 rounded-full text-foreground border border-border">
                        {keywords.length} / 12 個
                    </span>
                </div>

                {isAdding && (
                    <div className="p-5 border-b border-border bg-card animate-in slide-in-from-top-4 duration-300">
                        <h4 className="font-medium text-sm text-primary mb-4 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block"></span>
                            {editingId ? "キーワードを編集" : "新しいキーワードを追加"}
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                            <div>
                                <label className="text-sm font-medium mb-1.5 block text-muted-foreground">キーワード <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="例: 美容室"
                                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1.5 block text-muted-foreground">地域 (Location) <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    placeholder="例: 渋谷区"
                                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1.5 block text-muted-foreground">自店舗名 (Googleマップ完全一致) <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    value={targetBusiness}
                                    onChange={(e) => setTargetBusiness(e.target.value)}
                                    placeholder="例: サンプルヘアサロン"
                                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
                                />
                            </div>
                            <div className="flex items-end gap-2 pt-1 md:pt-0">
                                <button
                                    onClick={handleSave}
                                    disabled={submitting || !query || !location || !targetBusiness}
                                    className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors w-full flex justify-center items-center disabled:opacity-50"
                                >
                                    {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "保存"}
                                </button>
                                <button
                                    onClick={cancelEdit}
                                    disabled={submitting}
                                    className="px-4 py-2 border border-border text-foreground hover:bg-muted rounded-md text-sm font-medium transition-colors"
                                >
                                    キャンセル
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="overflow-x-auto relative min-h-[200px]">
                    {loading ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/50 backdrop-blur-sm z-10">
                            <Loader2 className="h-8 w-8 text-primary animate-spin mb-2" />
                            <p className="text-sm text-muted-foreground font-medium animate-pulse">読み込み中...</p>
                        </div>
                    ) : (
                        <table className="w-full text-sm text-left">
                            <thead className="bg-muted text-muted-foreground font-medium text-xs uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-3 border-b border-border">キーワード</th>
                                    <th className="px-6 py-3 border-b border-border">地域</th>
                                    <th className="px-6 py-3 border-b border-border">対象店舗名</th>
                                    <th className="px-6 py-3 border-b border-border text-right">操作</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {keywords.map((kw) => (
                                    <tr key={kw.id} className="hover:bg-muted/50 transition-colors group">
                                        <td className="px-6 py-4 font-medium text-foreground">{kw.query}</td>
                                        <td className="px-6 py-4 text-muted-foreground">{kw.location}</td>
                                        <td className="px-6 py-4 text-muted-foreground">{kw.targetBusiness}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => startEdit(kw)}
                                                    className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-colors"
                                                    title="編集"
                                                >
                                                    <Edit2 className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(kw.id)}
                                                    className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-md transition-colors"
                                                    title="削除"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {keywords.length === 0 && !isAdding && (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                                            <div className="flex flex-col items-center justify-center">
                                                <Target className="h-12 w-12 opacity-20 mb-3" />
                                                <p className="font-medium text-foreground">登録されているキーワードはありません。</p>
                                                <p className="text-sm mt-1">「新規追加」ボタンから最初のキーワードを登録してください。</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}
