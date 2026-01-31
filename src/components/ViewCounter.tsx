import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Eye } from "lucide-react";
import type { RealtimeChannel } from "@supabase/supabase-js";

const SESSION_KEY = "profile_view_counted";

const ViewCounter = () => {
  const [viewCount, setViewCount] = useState<number | null>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);

  const fetchViewCount = useCallback(async () => {
    const { count } = await supabase
      .from("profile_views")
      .select("*", { count: "exact", head: true });

    if (count !== null) {
      setViewCount(count);
    }
  }, []);

  const setupRealtimeChannel = useCallback(() => {
    // Clean up existing channel if any
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }

    const channel = supabase
      .channel('profile-views-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'profile_views',
        },
        () => {
          // Refetch count when a new view is inserted
          fetchViewCount();
        }
      )
      .subscribe();

    channelRef.current = channel;
  }, [fetchViewCount]);

  useEffect(() => {
    const recordViewAndFetch = async () => {
      // Check sessionStorage - only record once per browser session
      const hasAlreadyCounted = sessionStorage.getItem(SESSION_KEY);

      if (hasAlreadyCounted) {
        // Already counted this session, just fetch current count
        await fetchViewCount();
        return;
      }

      // Insert a new view row
      await supabase.from("profile_views").insert({});

      // Fetch the total count
      await fetchViewCount();

      // Mark as counted for this session
      sessionStorage.setItem(SESSION_KEY, "true");
    };

    recordViewAndFetch();
    setupRealtimeChannel();

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [fetchViewCount, setupRealtimeChannel]);

  // Handle visibility change - refresh data when tab becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        // Refresh view count and re-establish realtime connection
        fetchViewCount();
        setupRealtimeChannel();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [fetchViewCount, setupRealtimeChannel]);

  if (viewCount === null) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50 flex items-center gap-2 text-foreground/50 text-xs tracking-wider">
      <Eye size={14} className="animate-pulse-glow" />
      <span className="font-light">{viewCount.toLocaleString()} views</span>
    </div>
  );
};

export default ViewCounter;
