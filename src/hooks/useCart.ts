import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const getSessionId = () => {
  let sessionId = localStorage.getItem("session_id");
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem("session_id", sessionId);
  }
  return sessionId;
};

export const useCart = () => {
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const { toast } = useToast();

  const fetchCartCount = async () => {
    const sessionId = getSessionId();
    const { data, error } = await supabase
      .from("cart_items")
      .select("quantity")
      .eq("session_id", sessionId);

    if (!error && data) {
      const total = data.reduce((sum, item) => sum + item.quantity, 0);
      setCartItemsCount(total);
    }
  };

  useEffect(() => {
    fetchCartCount();
  }, []);

  const addToCart = async (productId: string) => {
    const sessionId = getSessionId();

    const { data: existing } = await supabase
      .from("cart_items")
      .select("*")
      .eq("session_id", sessionId)
      .eq("product_id", productId)
      .single();

    if (existing) {
      const { error } = await supabase
        .from("cart_items")
        .update({ quantity: existing.quantity + 1 })
        .eq("id", existing.id);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to update cart",
          variant: "destructive",
        });
        return;
      }
    } else {
      const { error } = await supabase
        .from("cart_items")
        .insert({ session_id: sessionId, product_id: productId, quantity: 1 });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to add to cart",
          variant: "destructive",
        });
        return;
      }
    }

    await fetchCartCount();
    toast({
      title: "Added to cart",
      description: "Product added successfully",
    });
  };

  return { cartItemsCount, addToCart, fetchCartCount };
};
