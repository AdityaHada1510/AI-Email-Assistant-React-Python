import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, Clock, User, Star } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import { on } from "events";
import { FaEnvelope, FaEnvelopeOpen } from "react-icons/fa";


interface EmailCardProps {
  id: string;
  sender: string;
  subject: string;
  preview: string;
  timestamp: string;
  urgency: "high" | "medium" | "low";
  sentiment: "positive" | "negative" | "neutral";
  category: string;
  isStarred?: boolean;
  isRead?: boolean;
  onToggleStar?: (id: string) => void;
}
  
export const EmailCard = ({
  id,
  sender,
  subject,
  preview,
  timestamp,
  urgency,
  sentiment,
  category,
  isStarred,
  isRead = false,
  onToggleStar
}: EmailCardProps) => {
 
  const urgencyColors = {
    high: "bg-destructive/20 text-destructive border-destructive/30",
    medium: "bg-warning/20 text-warning border-warning/30",
    low: "bg-success/20 text-success border-success/30"
  };

  const sentimentColors = {
    positive: "bg-success/20 text-success border-success/30",
    negative: "bg-destructive/20 text-destructive border-destructive/30",
    neutral: "bg-muted/20 text-muted-foreground border-muted/30"
  };

  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [isReplying, setIsReplying] = useState(false);
  const [reply, setReply] = useState<string | null>(null);
   

  const handleSummarize = async () => {
    setIsSummarizing(true);
    try {
      const response = await axios.post("http://localhost:8000/summarize", {
        subject,
        from_: sender,
        snippet: preview
      });
      setSummary(response.data.summary);
      setTimeout(() => setSummary(null), 10000);
    } catch (error) {
      console.error("Summarization failed:", error);
      setSummary("Failed to summarize email.");
      setTimeout(() => setSummary(null), 10000);
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleGenerateReply = async () => {
    setIsReplying(true);
    try {
      const response = await axios.post("http://localhost:8000/generate-reply", {
        subject,
        from_: sender,
        snippet: preview
      });
      setReply(response.data.reply);
      setTimeout(() => setReply(null), 10000);
    } catch (error) {
      console.error("Reply generation failed:", error);
      setReply("Failed to generate reply.");
      setTimeout(() => setReply(null), 10000);
    } finally {
      setIsReplying(false);
    }
  };

  const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text).then(() => {
    console.log("Copied to clipboard!");
  }).catch(err => {
    console.error("Failed to copy:", err);
  });
};

  const [localIsRead, setLocalIsRead] = useState(isRead);
  const [loading, setLoading] = useState(false);

  const handleToggleRead = async () => {
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:8000/toggle-read", {
        message_id: id,
        mark_as_read: !localIsRead,
      });
      setLocalIsRead((prev) => !prev);
    } catch (err) {
      console.error("Error toggling read status:", err);
    } finally {
      setLoading(false);
    }
  };


  return (
    <Card className="glass-card p-6 hover-lift cursor-pointer group transition-all duration-300 hover:shadow-glow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center">
            <User className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className={`font-semibold text-card-foreground truncate ${
                !isRead ? "text-foreground" : "text-card-foreground"
              }`}>
                {sender}
              </h3>
              {/* Clickable Star Icon */}
              <button
                className="ml-1 hover:scale-110 transition-transform"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleStar?.(id);
                }}
              >
                {isStarred ? (
                  <Star className="w-4 h-4 text-warning fill-warning" />
                ) : (
                  <Star className="w-4 h-4 text-subtext" />
                )}
              </button>
            </div>
            <p className={`text-sm truncate ${
              !isRead ? "text-foreground font-medium" : "text-subtext"
            }`}>
              {subject}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-xs text-subtext">
          <Clock className="w-3 h-3" />
          {timestamp}
        </div>
      </div>

      <p className="text-neutral-200 text-sm mb-4 line-clamp-2">
        {preview}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Badge variant="outline" className={urgencyColors[urgency]}>
            {urgency}
          </Badge>
          <Badge variant="outline" className={sentimentColors[sentiment]}>
            {sentiment}
          </Badge>
          <Badge variant="outline" className="border-white/20 text-subtext">
            {category}
          </Badge>
        </div>
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant="ghost" 
            disabled={isSummarizing}
            onClick={handleSummarize}
            className="opacity-0 group-hover:opacity-100 transition-opacity text-primary hover:text-primary-glow hover:bg-primary/10"
          >
            {isSummarizing ? (
              <span className="animate-pulse">Summarizing...</span>
            ) : (
              <>
              <Sparkles className="w-4 h-4 mr-1" />
              Summarize
              </>
            )}
          </Button>
          
          <Button 
            size="sm" 
            variant="ghost" 
            className="opacity-0 group-hover:opacity-100 transition-opacity text-accent hover:text-accent-glow hover:bg-accent/10"
            onClick={handleGenerateReply}
            disabled={isReplying} 
          >
            {isReplying ? (
              <span className="animate-pulse">Generating...</span>
            ) : (
              <>
              
            <Sparkles className="w-4 h-4 mr-1" />
            Generate Reply
            </>
            )}
          </Button>
          <Button
              size="sm"
              variant="ghost"
              onClick={handleToggleRead}
              disabled={loading}
              className={`opacity-0 group-hover:opacity-100 transition-opacity ${
                localIsRead ? "text-muted-foreground" : "text-success"
              } hover:text-foreground hover:bg-muted/10`}
              title={localIsRead ? "Mark as Unread" : "Mark as Read"}
            >
              {localIsRead ? (
                <FaEnvelopeOpen className="w-4 h-4" />
              ) : (
                <FaEnvelope className="w-4 h-4" />
              )}
          </Button>
        </div>
      </div>

      {/* Summary Output */}
      {summary && (
        <div className="mt-4 p-3 text-neutral-200 text-sm rounded bg-muted/10 border border-muted text-muted-foreground">
          <strong>Summary:</strong> {summary}
        </div>
      )}
      {/* Reply Output */}
      {reply && (
        <div className="mt-2 p-3 text-neutral-200 text-sm rounded bg-muted/10 border border-muted text-muted-foreground">
          <strong>Generated Reply:</strong> {reply}
          {/* <button
            onClick={() => copyToClipboard(reply)}
            className="absolute bottom-2 right-2 text-xs px-2 py-1 rounded bg-accent text-white hover:bg-accent/80">
              Copy Reply
            </button> */}
        </div>
      )}
    </Card>
  );
};