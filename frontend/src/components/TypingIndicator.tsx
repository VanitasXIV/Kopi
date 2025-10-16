import { Bot } from "lucide-react"

export default function TypingIndicator() {
  return (
    <div className="flex gap-3">
      <div className="flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0 bg-secondary">
        <Bot className="w-4 h-4 text-secondary-foreground" />
      </div>
      <div className="flex items-center gap-1 bg-secondary rounded-2xl px-4 py-3">
        <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce"></div>
      </div>
    </div>
  )
}
