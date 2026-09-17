"use client"

import { useState, useRef, useEffect } from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { Send, Square, Bot, User, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

const suggestions = [
  "Draft a polite reminder to a teammate who missed a deadline",
  "Give me 5 icebreakers for a remote team meeting",
  "Turn these notes into a status update: shipped v2, fixing 3 bugs",
  "How should I prioritize when everything feels urgent?",
]

export function AssistantChat() {
  const { messages, sendMessage, status, stop, error } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  })
  const [input, setInput] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)

  const busy = status === "submitted" || status === "streaming"

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    })
  }, [messages, status])

  function submit(text: string) {
    const trimmed = text.trim()
    if (!trimmed || busy) return
    sendMessage({ text: trimmed })
    setInput("")
  }

  return (
    <div className="flex h-[calc(100svh-11rem)] flex-col rounded-xl border border-border bg-card ring-1 ring-foreground/10">
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-6">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Sparkles className="size-6" />
            </span>
            <h2 className="mt-4 text-lg font-semibold">
              How can I help you work smarter?
            </h2>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Ask a question, or try one of these starters.
            </p>
            <div className="mt-5 grid w-full max-w-xl gap-2 sm:grid-cols-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => submit(s)}
                  className="rounded-lg border border-border bg-background px-3 py-2.5 text-left text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="mx-auto flex max-w-3xl flex-col gap-5">
            {messages.map((message) => {
              const isUser = message.role === "user"
              const text = message.parts
                .map((p) => (p.type === "text" ? p.text : ""))
                .join("")
              return (
                <div
                  key={message.id}
                  className={cn("flex gap-3", isUser && "flex-row-reverse")}
                >
                  <span
                    className={cn(
                      "flex size-8 shrink-0 items-center justify-center rounded-lg",
                      isUser
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground",
                    )}
                  >
                    {isUser ? (
                      <User className="size-4" />
                    ) : (
                      <Bot className="size-4" />
                    )}
                  </span>
                  <div
                    className={cn(
                      "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap",
                      isUser
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground",
                    )}
                  >
                    {text || (
                      <span className="inline-flex gap-1">
                        <Dot /> <Dot /> <Dot />
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
            {error && (
              <p className="text-center text-sm text-destructive">
                Something went wrong. Please try again.
              </p>
            )}
          </div>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          submit(input)
        }}
        className="border-t border-border p-3"
      >
        <div className="mx-auto flex max-w-3xl items-end gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (
                e.key === "Enter" &&
                !e.shiftKey &&
                !e.nativeEvent.isComposing &&
                e.keyCode !== 229
              ) {
                e.preventDefault()
                submit(input)
              }
            }}
            placeholder="Ask the assistant anything..."
            className="max-h-40 min-h-11 flex-1 resize-none"
            rows={1}
          />
          {busy ? (
            <Button type="button" size="icon-lg" variant="outline" onClick={stop}>
              <Square className="size-4" />
              <span className="sr-only">Stop</span>
            </Button>
          ) : (
            <Button type="submit" size="icon-lg" disabled={!input.trim()}>
              <Send className="size-4" />
              <span className="sr-only">Send</span>
            </Button>
          )}
        </div>
        <p className="mx-auto mt-2 max-w-3xl text-center text-[11px] text-muted-foreground">
          AI responses may be inaccurate. Verify important information.
        </p>
      </form>
    </div>
  )
}

function Dot() {
  return (
    <span className="size-1.5 animate-pulse rounded-full bg-muted-foreground/60" />
  )
}
