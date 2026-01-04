import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Eye } from "lucide-react";
import type { RealtimeChannel } from "@supabase/supabase-js";

const VIEW_ID = "00000000-0000-0000-0000-000000000001";

const ViewCounter = () => {
  const [viewCount, setViewCount] = useState<number | null>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const hasIncrementedRef = useRef(false);

  const fetchViewCount = useCallback(async () => {
    const { data } = await supabase
      .from("profile_views")
      .select("view_count")
      .eq("id", VIEW_ID)
      .single();

    if (data) {
      setViewCount(data.view_count);
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
          event: 'UPDATE',
          schema: 'public',
          table: 'profile_views',
          filter: `id=eq.${VIEW_ID}`
        },
        (payload) => {
          const newData = payload.new as { view_count: number };
          setViewCount(newData.view_count);
        }
      )
      .subscribe();

    channelRef.current = channel;
  }, []);

  useEffect(() => {
    const incrementAndFetch = async () => {
      // Only increment once per page load
      if (hasIncrementedRef.current) {
        await fetchViewCount();
        return;
      }

      const { data: currentData } = await supabase
        .from("profile_views")
        .select("view_count")
        .eq("id", VIEW_ID)
        .single();

      if (currentData) {
        const newCount = currentData.view_count + 1;

        await supabase
          .from("profile_views")
          .update({ view_count: newCount, updated_at: new Date().toISOString() })
          .eq("id", VIEW_ID);

        setViewCount(newCount);
        hasIncrementedRef.current = true;
      }
    };

    incrementAndFetch();
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
