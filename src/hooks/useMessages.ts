import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert } from "@/integrations/supabase/types";

export type Message = Tables<"messages">;
export type NewMessage = Pick<TablesInsert<"messages">, "author" | "content">;

const PAGE_SIZE = 10;

interface MessagesResponse {
  messages: Message[];
  total: number;
  totalPages: number;
}

export const useMessages = (page: number = 1) => {
  return useQuery<MessagesResponse>({
    queryKey: ["messages", page],
    queryFn: async () => {
      const start = (page - 1) * PAGE_SIZE;
      const end = start + PAGE_SIZE - 1;

      const { data, error, count } = await supabase
        .from("messages")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false })
        .range(start, end);

      if (error) throw error;

      return {
        messages: data || [],
        total: count || 0,
        totalPages: Math.ceil((count || 0) / PAGE_SIZE),
      };
    },
  });
};

export const usePostMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newMessage: NewMessage) => {
      const { data, error } = await supabase
        .from("messages")
        .insert(newMessage)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    },
  });
};
