"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { MessageCircle, X, Send, ChefHat, Bot } from "lucide-react";
import { getChefBotResponse } from "./chefBotResponses";

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface ChatMessage {
  id: string;
  role: "bot" | "user";
  content: string;
  timestamp: Date;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatTime(date: Date) {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

/** Convierte markdown básico (**bold** y *italic*) a JSX inline */
function renderMarkdown(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return (
        <em key={i} className="italic">
          {part.slice(1, -1)}
        </em>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

function renderMessageContent(content: string) {
  return content.split("\n").map((line, i, arr) => (
    <span key={i}>
      {renderMarkdown(line)}
      {i < arr.length - 1 && <br />}
    </span>
  ));
}

// ─── Componente ───────────────────────────────────────────────────────────────

export function ChefBot() {
  const t = useTranslations("ChefBot");

  const WELCOME_MESSAGE: ChatMessage = {
    id: "welcome",
    role: "bot",
    content: t("welcomeMessage"),
    timestamp: new Date(),
  };

  const SUGGESTION_CHIPS = [
    t("chip1"),
    t("chip2"),
    t("chip3"),
    t("chip4"),
  ];

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => [{
    id: "welcome",
    role: "bot",
    content: t("welcomeMessage"),
    timestamp: new Date(),
  }]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const openButtonRef = useRef<HTMLButtonElement>(null);

  // Auto-scroll al último mensaje
  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages, isTyping]);

  // Focus input al abrir
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [isOpen]);

  const sendMessage = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;

      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        content: trimmed,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setIsTyping(true);

      // Simular delay de "pensando" para que se sienta conversacional
      setTimeout(() => {
        const responseText = getChefBotResponse(trimmed);
        const botMsg: ChatMessage = {
          id: `bot-${Date.now()}`,
          role: "bot",
          content: responseText,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMsg]);
        setIsTyping(false);
      }, 800 + Math.random() * 600);
    },
    []
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleChipClick = (chip: string) => {
    sendMessage(chip);
  };

  return (
    <>
      {/* ── Ventana de Chat ────────────────────────────────────────────── */}
      {isOpen && (
        <section
          role="dialog"
          aria-label={t("chatTitle")}
          className={cn(
            "fixed z-50 flex flex-col overflow-hidden rounded-2xl border bg-card shadow-2xl",
            "bottom-24 right-4 w-[calc(100vw-2rem)] max-w-sm",
            "md:bottom-24 md:right-6 md:w-96 md:max-w-none",
            "h-[min(500px,calc(100vh-8rem))]"
          )}
        >
          {/* Header */}
          <div className="flex items-center gap-3 bg-citrus-accent px-4 py-3">
            <Avatar className="h-10 w-10 border-2 border-white/30">
              <AvatarFallback className="bg-white/20 text-white">
                <ChefHat className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-semibold leading-tight text-white">
                ChefBot
              </h3>
              <p className="text-xs text-white/70">
                {t("assistantTitle")}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white hover:bg-white/20 hover:text-white"
              onClick={() => {
                setIsOpen(false);
                setTimeout(() => openButtonRef.current?.focus(), 100);
              }}
              aria-label={t("closeChat")}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Mensajes */}
          <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto px-4 py-3" role="log" aria-live="polite">
            <div className="space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex gap-2",
                    msg.role === "user" ? "flex-row-reverse" : "flex-row"
                  )}
                >
                  {/* Avatar (solo bot) */}
                  {msg.role === "bot" && (
                    <Avatar className="mt-1 h-7 w-7 flex-shrink-0">
                      <AvatarFallback className="bg-citrus-accent/10 text-citrus-accent">
                        <ChefHat className="h-3.5 w-3.5" />
                      </AvatarFallback>
                    </Avatar>
                  )}

                  {/* Burbuja */}
                  <div
                    className={cn(
                      "max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
                      msg.role === "bot"
                        ? "rounded-tl-sm bg-muted text-foreground"
                        : "rounded-tr-sm bg-citrus-accent text-white"
                    )}
                  >
                    <div className="whitespace-pre-wrap break-words">
                      {renderMessageContent(msg.content)}
                    </div>
                    <p
                      className={cn(
                        "mt-1 text-[10px]",
                        msg.role === "bot"
                          ? "text-muted-foreground"
                          : "text-white/60"
                      )}
                    >
                      {formatTime(msg.timestamp)}
                    </p>
                  </div>
                </div>
              ))}

              {/* Indicador de "escribiendo" */}
              {isTyping && (
                <div className="flex items-center gap-2" aria-hidden="true">
                  <Avatar className="mt-1 h-7 w-7 flex-shrink-0">
                    <AvatarFallback className="bg-citrus-accent/10 text-citrus-accent">
                      <ChefHat className="h-3.5 w-3.5" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="rounded-2xl rounded-tl-sm bg-muted px-4 py-3">
                    <div className="flex gap-1">
                      <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/40 [animation-delay:0ms]" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/40 [animation-delay:150ms]" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/40 [animation-delay:300ms]" />
                    </div>
                  </div>
                </div>
              )}
              <span className="sr-only" aria-live="assertive">
                {isTyping ? t("typing") : ""}
              </span>

              {/* Chips sugeridos (solo cuando hay 1 mensaje = bienvenida) */}
              {messages.length === 1 && !isTyping && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {SUGGESTION_CHIPS.map((chip) => (
                    <button
                      key={chip}
                      onClick={() => handleChipClick(chip)}
                      className="rounded-full border border-citrus-accent/30 bg-citrus-accent/5 px-3 py-1.5 text-xs font-medium text-citrus-accent transition-colors hover:bg-citrus-accent/10"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 border-t bg-card px-3 py-3"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t("inputPlaceholder")}
              aria-label={t("inputPlaceholder")}
              className="flex-1 rounded-full border bg-background px-4 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-citrus-accent focus:ring-1 focus:ring-citrus-accent/30"
              disabled={isTyping}
            />
            <Button
              type="submit"
              size="icon"
              className="h-9 w-9 rounded-full bg-citrus-accent text-white hover:bg-citrus-accent/90"
              disabled={!input.trim() || isTyping}
              aria-label={t("sendMessage")}
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </section>
      )}

      {/* ── Botón Flotante (oculto cuando el chat está abierto) ──────── */}
      {!isOpen && (
        <button
          ref={openButtonRef}
          onClick={() => setIsOpen(true)}
          className={cn(
            "fixed z-50 flex items-center justify-center rounded-full shadow-lg transition-all duration-300 hover:scale-105 active:scale-95",
            "h-14 w-14 bottom-6 right-4 md:bottom-6 md:right-6",
            // En móvil subir para no tapar MobileBottomNav (h-16 + gap)
            "max-md:bottom-[5.5rem]",
            "bg-citrus-accent text-white"
          )}
          aria-label={t("openChat")}
        >
          <Bot className="h-6 w-6" />
          {/* Pulso indicador */}
          <span className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-green-500" />
          </span>
        </button>
      )}
    </>
  );
}
