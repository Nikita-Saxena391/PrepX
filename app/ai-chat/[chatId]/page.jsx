"use client";

import { useState, useEffect, useRef } from "react";
import { Send, ArrowLeft, Power } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import EmptyState from "@/components/EmptyState";
import { useRouter, useParams } from "next/navigation";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { toast } from "sonner";

const Page = () => {
  const router = useRouter();
  const params = useParams();
  const chatId = params?.chatId;

  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messageList, setMessageList] = useState([]);
  const [isChatEnded, setIsChatEnded] = useState(false);
  const [endingChat, setEndingChat] = useState(false);
  const [isHydrating, setIsHydrating] = useState(true);

  const chatContainerRef = useRef(null);

  // 🔥 SEND MESSAGE
  const onSend = async () => {
    if (!userInput.trim()) return;
    if (isChatEnded) return toast.error("Chat has already ended");

    const userMsg = { id: crypto.randomUUID(), role: "user", content: userInput };
    const aiMsgId = crypto.randomUUID();

    setMessageList((prev) => [...prev, userMsg, { id: aiMsgId, role: "assistant", content: "Typing..." }]);
    setUserInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chatId, message: userMsg.content }),
      });

      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => ({}));
        return toast.error(data?.error || "AI request failed");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let aiText = "";

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunk = decoder.decode(value || new Uint8Array());
        if (chunk.startsWith("<!DOCTYPE")) throw new Error("Server error response");

        aiText += chunk;
        setMessageList((prev) => prev.map((msg) => (msg.id === aiMsgId ? { ...msg, content: aiText } : msg)));
      }
    } catch (err) {
      console.error(err);
      setMessageList((prev) => prev.filter((msg) => msg.id !== aiMsgId));
    } finally {
      setLoading(false);
    }
  };

  // 🔥 END CHAT
  const handleEndChat = async () => {
    try {
      if (isChatEnded || endingChat) return;
      if (!chatId) throw new Error("Chat ID missing");

      setEndingChat(true);
      const res = await fetch("/api/chat/end", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chatId, messages: messageList }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "Failed to end chat");
      }

      toast.success("Chat ended & saved");
      setIsChatEnded(true);
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Error ending chat");
    } finally {
      setEndingChat(false);
    }
  };

  // 🔥 AUTO SCROLL
  const scrollToBottom = () => {
    setTimeout(() => {
      const el = chatContainerRef.current;
      if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    }, 0);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messageList]);

  // 🔥 LOAD MESSAGES
  useEffect(() => {
    let cancelled = false;
    const loadMessages = async () => {
      try {
        setIsHydrating(true);
        const res = await fetch(`/api/chat/messages?chatId=${chatId}`);
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled && Array.isArray(data)) setMessageList(data);
      } catch (err) {
        console.error(err);
      } finally {
        if (!cancelled) setIsHydrating(false);
      }
    };
    if (chatId) loadMessages();
    return () => { cancelled = true; };
  }, [chatId]);

  return (
    <div className="bg-muted/60 h-[calc(100vh-64px)] flex flex-col">
      {/* HEADER */}
      <div className="flex items-center gap-3 border-b px-4 py-3 bg-background">
        <Button
          variant="outline"
          onClick={() => {
            if (!isChatEnded) return toast.error("Please end the chat before leaving.");
            router.push("/ai-chat-dashboard");
          }}
        >
          <ArrowLeft />
        </Button>
        <div>
          <h2 className="text-lg font-bold text-yellow-400">AI Career Coach</h2>
          <div className="text-green-600 text-sm flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-green-500" /> Online
          </div>
        </div>
      </div>

      {/* MESSAGES */}
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto px-4 py-6 space-y-3">
        {isHydrating ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-sm text-muted-foreground animate-pulse">Loading chat...</div>
          </div>
        ) : messageList.length === 0 ? (
          <EmptyState selectedQuestion={(q) => setUserInput(q)} />
        ) : (
          messageList.map((message) => (
            <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`px-4 py-2 rounded-lg max-w-[70%] break-words ${message.role === "user" ? "bg-blue-900 text-white" : "bg-green-800 text-white"}`}>
                <Markdown remarkPlugins={[remarkGfm]}>{message.content}</Markdown>
              </div>
            </div>
          ))
        )}
      </div>

      {/* INPUT + END CHAT */}
      <div className="border-t bg-background px-4 py-3 space-y-2">
        <div className="flex gap-4">
          <Input
            placeholder="Ask anything about your career..."
            className="flex-1"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); onSend(); }
            }}
          />
          <Button
            onClick={onSend}
            disabled={loading || isChatEnded || isHydrating}
            className="h-10 w-10 flex items-center justify-center bg-green-600 text-white"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>

        {/* END CHAT BUTTON */}
        {/* <div className="flex justify-end">
          <Button
            variant="destructive"
            disabled={isChatEnded || endingChat}
            onClick={handleEndChat}
          >
            <Power className="mr-2" />
            {endingChat ? "Ending..." : "End Chat"}
          </Button>
        </div> */}
        {/* BACK + END CHAT BUTTONS */}
<div className="flex justify-end gap-3">
  {/* Back Button */}
  <Button
    variant="outline"
    onClick={() => router.push("/ai-chat-dashboard")}
  >
    <ArrowLeft className="mr-2 h-4 w-4" />
    Back
  </Button>

  {/* End Chat Button */}
  <Button
    variant="destructive"
    disabled={isChatEnded || endingChat}
    onClick={handleEndChat}
  >
    <Power className="mr-2" />
    {endingChat ? "Ending..." : "End Chat"}
  </Button>
</div>
      </div>
    </div>
  );
};

export default Page;