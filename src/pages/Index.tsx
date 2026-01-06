import Background from "@/components/Background";
import SocialIcons from "@/components/SocialIcons";
import ViewCounter from "@/components/ViewCounter";
import DiscordActivity from "@/components/DiscordActivity";
import MusicPlayer from "@/components/MusicPlayer";
import { cn } from "@/lib/utils";
import { useDiscordPresence } from "@/hooks/useDiscordPresence";

const DISCORD_USER_ID = "1281658337464946700";
const DISCORD_USERNAME = "yurixine";

const OTHER_HALF_USER_ID = "595176626535268363";
const OTHER_HALF_LINK = "https://p1rsu.github.io/me/";

const BACKGROUND_CONFIG = {
  url: "/me/cherry-blossom.mp4",
  type: "video" as "video" | "image",
};

const statusStyles = {
  online: { bg: "bg-green-400", glow: "shadow-[0_0_12px_4px_rgba(74,222,128,0.6)]" },
  idle: { bg: "bg-yellow-400", glow: "shadow-[0_0_12px_4px_rgba(250,204,21,0.6)]" },
  dnd: { bg: "bg-red-400", glow: "shadow-[0_0_12px_4px_rgba(248,113,113,0.6)]" },
  offline: { bg: "bg-gray-400", glow: "shadow-[0_0_8px_2px_rgba(156,163,175,0.4)]" },
};

const Index = () => {
  const { avatarUrl, displayName, status, loading, isMonitored, activity, spotify, isListeningToSpotify } = useDiscordPresence(
    DISCORD_USER_ID,
    { username: DISCORD_USERNAME }
  );

  const { avatarUrl: otherHalfAvatarUrl } = useDiscordPresence(OTHER_HALF_USER_ID);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center">
      <Background url={BACKGROUND_CONFIG.url || null} type={BACKGROUND_CONFIG.url ? BACKGROUND_CONFIG.type : null} />
      <ViewCounter />
      <MusicPlayer />

      <main className="flex flex-col items-center justify-center gap-12 px-6 text-center">
        <div className="animate-fade-in-up flex flex-col items-center gap-4" style={{ animationDelay: "0.1s" }}>
          <div className="relative group">
            <a
              href={OTHER_HALF_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute left-1/2 -translate-x-1/2 top-0 z-0 flex flex-col items-center transition-all duration-500 ease-out opacity-0 group-hover:opacity-100 group-hover:-translate-y-16"
            >
              <span className="text-foreground/60 text-xs tracking-[0.15em] uppercase font-light mb-2 whitespace-nowrap transition-all duration-300 group-hover:text-foreground/80">
                my pirsu
              </span>
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl group-hover:bg-primary/40 transition-all duration-500 animate-pulse-glow" />
                <img
                  src={otherHalfAvatarUrl}
                  alt="Other Half Avatar"
                  className="relative w-20 h-20 rounded-full border-2 border-primary/30 object-cover shadow-[0_0_20px_rgba(244,114,182,0.3)] hover:shadow-[0_0_30px_rgba(244,114,182,0.5)] hover:border-primary/50 transition-all duration-300 hover:scale-105"
                />
              </div>
            </a>

            <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl group-hover:bg-primary/40 transition-all duration-500 animate-pulse-glow z-10" />
            <img
              src={avatarUrl}
              alt="Discord Avatar"
              className="relative w-24 h-24 rounded-full border-2 border-primary/30 object-cover shadow-[0_0_20px_rgba(244,114,182,0.3)] group-hover:shadow-[0_0_30px_rgba(244,114,182,0.5)] transition-all duration-300 z-20"
            />
            <div className="absolute -bottom-0.5 -right-0.5 bg-background rounded-full p-1.5 border-2 border-background z-30">
              <div
                className={cn(
                  "w-5 h-5 rounded-full transition-all duration-300",
                  statusStyles[status].bg,
                  statusStyles[status].glow,
                  status === "online" && "animate-pulse"
                )}
              />
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-light tracking-[0.3em] uppercase text-foreground glow-text">
            {loading ? "Loading..." : displayName || DISCORD_USERNAME}
          </h1>

          {!isMonitored && !loading && (
            <p className="text-foreground/30 text-xs max-w-xs">
              Join the <a href="https://discord.gg/lanyard" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground/50 transition-colors">Lanyard Discord</a> for live status & activity
            </p>
          )}

          {isMonitored && (activity || isListeningToSpotify) && (
            <DiscordActivity
              activity={activity}
              spotify={spotify}
              isListeningToSpotify={isListeningToSpotify}
            />
          )}

          <p className="text-foreground/40 text-sm tracking-[0.2em] uppercase font-light">
            hello there!
          </p>
        </div>

        <div className="animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
          <SocialIcons />
        </div>

      </main>
    </div>
  );
};

export default Index;
