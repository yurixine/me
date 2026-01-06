import { Card, CardContent } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useMessages, type Message } from "@/hooks/useMessages";
import { MessageSquare, Loader2 } from "lucide-react";

interface MessageListProps {
  page: number;
  onPageChange: (page: number) => void;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const MessageCard = ({ message }: { message: Message }) => (
  <Card className="bg-background/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-colors">
    <CardContent className="p-4">
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1 min-w-0">
          <p className="font-medium text-foreground truncate">{message.author}</p>
          <p className="text-foreground/70 text-sm mt-1 whitespace-pre-wrap break-words">
            {message.content}
          </p>
        </div>
        <span className="text-xs text-foreground/40 whitespace-nowrap">
          {formatDate(message.created_at)}
        </span>
      </div>
    </CardContent>
  </Card>
);

const MessageList = ({ page, onPageChange }: MessageListProps) => {
  const { data, isLoading, error } = useMessages(page);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-foreground/50">
        Failed to load messages. Please try again.
      </div>
    );
  }

  if (!data || data.messages.length === 0) {
    return (
      <div className="text-center py-12">
        <MessageSquare className="w-12 h-12 mx-auto text-foreground/30 mb-4" />
        <p className="text-foreground/50">No messages yet. Be the first to leave one!</p>
      </div>
    );
  }

  const { messages, totalPages } = data;

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        {messages.map((message) => (
          <MessageCard key={message.id} message={message} />
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => onPageChange(Math.max(1, page - 1))}
                className={page <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => {
                if (totalPages <= 5) return true;
                if (p === 1 || p === totalPages) return true;
                if (Math.abs(p - page) <= 1) return true;
                return false;
              })
              .map((p, idx, arr) => {
                const showEllipsis = idx > 0 && p - arr[idx - 1] > 1;
                return (
                  <PaginationItem key={p}>
                    {showEllipsis && (
                      <span className="px-2 text-foreground/40">...</span>
                    )}
                    <PaginationLink
                      onClick={() => onPageChange(p)}
                      isActive={p === page}
                      className="cursor-pointer"
                    >
                      {p}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}

            <PaginationItem>
              <PaginationNext
                onClick={() => onPageChange(Math.min(totalPages, page + 1))}
                className={page >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default MessageList;
