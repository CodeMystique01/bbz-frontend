"use client";

import { useEffect, useState, useRef } from "react";
import { MessageSquare, Send, ArrowLeft, Plus } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { useAuthStore } from "@/store/auth-store";
import { Spinner, Button } from "@/components/ui";
import { formatDateTime } from "@/lib/utils";

interface Thread {
    id: string;
    createdAt: string;
    updatedAt: string;
    participants: { id: string; email: string; name: string | null }[];
    messages: Message[];
}

interface Message {
    id: string;
    content: string;
    senderId: string;
    createdAt: string;
    sender?: { id: string; email: string; name: string | null };
}

export default function BuyerMessagesPage() {
    const { user } = useAuthStore();
    const [threads, setThreads] = useState<Thread[]>([]);
    const [selectedThread, setSelectedThread] = useState<Thread | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => { loadThreads(); }, []);
    useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

    async function loadThreads() {
        setIsLoading(true);
        try {
            const data = await apiClient.get<Thread[]>("/api/messages/threads");
            setThreads(Array.isArray(data) ? data : []);
        } catch { setThreads([]); } finally { setIsLoading(false); }
    }

    async function selectThread(thread: Thread) {
        setSelectedThread(thread);
        try {
            const data = await apiClient.get<Message[] | { messages: Message[] }>(`/api/messages/thread/${thread.id}/messages`);
            setMessages(Array.isArray(data) ? data : data.messages || []);
        } catch { setMessages([]); }
    }

    async function handleSend(e: React.FormEvent) {
        e.preventDefault();
        if (!newMessage.trim() || !selectedThread) return;
        setIsSending(true);
        try {
            const msg = await apiClient.post<Message>(`/api/messages/thread/${selectedThread.id}/message`, { content: newMessage });
            setMessages((prev) => [...prev, msg]);
            setNewMessage("");
        } catch { /* ignore */ } finally { setIsSending(false); }
    }

    function getOtherParticipant(thread: Thread) {
        const other = thread.participants.find((p) => p.id !== user?.id);
        return other?.name || other?.email || "Unknown";
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h1 className="text-xl font-semibold text-gray-900">Messages</h1>
                <p className="text-xs text-gray-400 mt-0.5">Communicate with vendors</p>
            </div>

            <div className="rounded-xl border border-gray-100 overflow-hidden" style={{ height: "calc(100vh - 240px)" }}>
                <div className="flex h-full">
                    {/* Thread List */}
                    <div className={`w-80 border-r border-gray-100 flex flex-col ${selectedThread ? "hidden lg:flex" : "flex"}`}>
                        <div className="p-4 border-b border-gray-100">
                            <p className="text-sm font-medium text-gray-700">{threads.length} Conversations</p>
                        </div>
                        {isLoading ? (
                            <div className="flex justify-center py-12"><Spinner /></div>
                        ) : threads.length === 0 ? (
                            <div className="flex-1 flex flex-col items-center justify-center p-6">
                                <MessageSquare className="h-8 w-8 text-gray-200 mb-2" />
                                <p className="text-sm text-gray-400">No messages yet</p>
                            </div>
                        ) : (
                            <div className="flex-1 overflow-y-auto">
                                {threads.map((thread) => (
                                    <button key={thread.id} onClick={() => selectThread(thread)}
                                        className={`w-full text-left p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer ${selectedThread?.id === thread.id ? "bg-primary-50" : ""
                                            }`}>
                                        <p className="text-sm font-medium text-gray-900 truncate">{getOtherParticipant(thread)}</p>
                                        <p className="text-xs text-gray-400 mt-0.5">
                                            {thread.messages[0]?.content?.slice(0, 50) || "No messages"}
                                        </p>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Message Area */}
                    <div className={`flex-1 flex flex-col ${selectedThread ? "flex" : "hidden lg:flex"}`}>
                        {selectedThread ? (
                            <>
                                <div className="p-4 border-b border-gray-100 flex items-center gap-3">
                                    <button onClick={() => setSelectedThread(null)} className="lg:hidden p-1 text-gray-400 hover:text-gray-600 cursor-pointer">
                                        <ArrowLeft className="h-4 w-4" />
                                    </button>
                                    <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 text-sm font-medium">
                                        {getOtherParticipant(selectedThread).charAt(0).toUpperCase()}
                                    </div>
                                    <p className="font-medium text-gray-900 text-sm">{getOtherParticipant(selectedThread)}</p>
                                </div>
                                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                                    {messages.map((msg) => (
                                        <div key={msg.id} className={`flex ${msg.senderId === user?.id ? "justify-end" : "justify-start"}`}>
                                            <div className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm ${msg.senderId === user?.id
                                                ? "bg-primary-600 text-white rounded-br-md"
                                                : "bg-gray-100 text-gray-900 rounded-bl-md"
                                                }`}>
                                                <p>{msg.content}</p>
                                                <p className={`text-[10px] mt-1 ${msg.senderId === user?.id ? "text-primary-200" : "text-gray-400"}`}>
                                                    {formatDateTime(msg.createdAt)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                    <div ref={messagesEndRef} />
                                </div>
                                <form onSubmit={handleSend} className="p-4 border-t border-gray-100 flex gap-2">
                                    <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Type a message..." className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-200" />
                                    <button type="submit" disabled={isSending || !newMessage.trim()}
                                        className="p-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed">
                                        <Send className="h-4 w-4" />
                                    </button>
                                </form>
                            </>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center">
                                <MessageSquare className="h-12 w-12 text-gray-200 mb-3" />
                                <p className="text-sm text-gray-400">Select a conversation to start messaging</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
