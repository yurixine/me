import { useState } from "react";
import { Link } from "react-router-dom";
import Background from "@/components/Background";
import MessageForm from "@/components/MessageForm";
import MessageList from "@/components/MessageList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, MessageSquare } from "lucide-react";

const BACKGROUND_CONFIG = {
  url: "/me/cherry-blossom.mp4",
  type: "video" as "video" | "image",
};

const Messages = () => {
  const [page, setPage] = useState(1);

  return (
    <div className="relative min-h-screen flex flex-col items-center py-8 px-4">
      <Background url={BACKGROUND_CONFIG.url || null} type={BACKGROUND_CONFIG.url ? BACKGROUND_CONFIG.type : null} />

      <div className="w-full max-w-2xl z-10">
        <div className="animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-foreground/60 hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm tracking-wider uppercase">Back to Home</span>
          </Link>

          <Card className="bg-background/80 backdrop-blur-md border-primary/20 mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <MessageSquare className="w-5 h-5" />
                <span className="tracking-wider">Guestbook</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <MessageForm />
            </CardContent>
          </Card>
        </div>

        <div className="animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          <MessageList page={page} onPageChange={setPage} />
        </div>
      </div>
    </div>
  );
};

export default Messages;
