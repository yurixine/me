import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { usePostMessage } from "@/hooks/useMessages";
import { useToast } from "@/hooks/use-toast";
import { Send } from "lucide-react";

const MessageForm = () => {
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const { mutate: postMessage, isPending } = usePostMessage();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!author.trim() || !content.trim()) {
      toast({
        title: "Missing fields",
        description: "Please fill in both your name and message.",
        variant: "destructive",
      });
      return;
    }

    postMessage(
      { author: author.trim(), content: content.trim() },
      {
        onSuccess: () => {
          setAuthor("");
          setContent("");
          toast({
            title: "Message posted!",
            description: "Your message has been added to the guestbook.",
          });
        },
        onError: () => {
          toast({
            title: "Error",
            description: "Failed to post message. Please try again.",
            variant: "destructive",
          });
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input
          placeholder="Your name"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          maxLength={50}
          className="bg-background/50 backdrop-blur-sm border-primary/20 focus:border-primary/50"
        />
      </div>
      <div>
        <Textarea
          placeholder="Leave a message..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={500}
          rows={3}
          className="bg-background/50 backdrop-blur-sm border-primary/20 focus:border-primary/50 resize-none"
        />
      </div>
      <Button
        type="submit"
        disabled={isPending}
        className="w-full gap-2"
      >
        <Send className="w-4 h-4" />
        {isPending ? "Posting..." : "Post Message"}
      </Button>
    </form>
  );
};

export default MessageForm;
