import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Minus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

const getSessionId = () => localStorage.getItem("session_id") || "";

const Cart = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: cartItems, isLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const sessionId = getSessionId();
      const { data, error } = await supabase
        .from("cart_items")
        .select("*, products(*)")
        .eq("session_id", sessionId);
      
      if (error) throw error;
      return data;
    },
  });

  const updateQuantityMutation = useMutation({
    mutationFn: async ({ id, quantity }: { id: string; quantity: number }) => {
      const { error } = await supabase
        .from("cart_items")
        .update({ quantity })
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const removeItemMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("cart_items")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast({
        title: "Removed from cart",
        description: "Item removed successfully",
      });
    },
  });

  const total = cartItems?.reduce(
    (sum, item) => sum + (item.products?.price || 0) * item.quantity,
    0
  ) || 0;

  if (isLoading) {
    return (
      <div className="min-h-screen py-8 px-4">
        <div className="container mx-auto max-w-4xl">
          <Skeleton className="h-10 w-48 mb-8" />
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl font-semibold mb-4">Your cart is empty</p>
          <Button onClick={() => window.location.href = "/products"}>
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>

        <div className="space-y-4 mb-8">
          {cartItems.map((item) => (
            <div key={item.id} className="border rounded-lg p-4 flex gap-4">
              <img
                src={item.products?.image_url}
                alt={item.products?.name}
                className="w-24 h-24 object-cover rounded"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2">{item.products?.name}</h3>
                <p className="text-2xl font-bold text-primary mb-2">
                  ${item.products?.price.toFixed(2)}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() =>
                      updateQuantityMutation.mutate({
                        id: item.id,
                        quantity: Math.max(1, item.quantity - 1),
                      })
                    }
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center font-semibold">{item.quantity}</span>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() =>
                      updateQuantityMutation.mutate({
                        id: item.id,
                        quantity: item.quantity + 1,
                      })
                    }
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="destructive"
                    className="ml-auto"
                    onClick={() => removeItemMutation.mutate(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Separator className="my-6" />

        <div className="bg-muted rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xl font-semibold">Subtotal</span>
            <span className="text-2xl font-bold">${total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center mb-4">
            <span className="text-xl font-semibold">Shipping</span>
            <span className="text-2xl font-bold text-primary">FREE</span>
          </div>
          <Separator className="my-4" />
          <div className="flex justify-between items-center mb-6">
            <span className="text-2xl font-bold">Total</span>
            <span className="text-3xl font-bold text-primary">${total.toFixed(2)}</span>
          </div>
          <Button size="lg" className="w-full text-lg">
            Proceed to Checkout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
