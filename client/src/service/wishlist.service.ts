import { http } from "@/utils/http";
import type { WishlistItem, CreateWishlistItemDto } from "@/type/wishlist";

class WishlistService {
  private readonly baseURL = "/wishlist";

  async getWishlist(): Promise<WishlistItem[]> {
    try {
      const data = await http.get<WishlistItem[]>(this.baseURL);
      return data;
    } catch (error) {
      console.error("[WISHLIST_SERVICE] Failed to fetch wishlist:", error);
      throw error;
    }
  }

  async addItem(dto: CreateWishlistItemDto): Promise<WishlistItem> {
    try {
      const data = await http.post<WishlistItem>(this.baseURL, dto);
      return data;
    } catch (error) {
      console.error("[WISHLIST_SERVICE] Failed to add item:", error);
      throw error;
    }
  }

  async removeItem(productId: string, variantId?: string): Promise<void> {
    try {
      const url = variantId 
        ? `${this.baseURL}/${productId}/${variantId}`
        : `${this.baseURL}/${productId}`;
      
      await http.delete(url);
    } catch (error) {
      console.error("[WISHLIST_SERVICE] Failed to remove item:", error);
      throw error;
    }
  }

  async clearWishlist(): Promise<void> {
    try {
      await http.delete(this.baseURL);
    } catch (error) {
      console.error("[WISHLIST_SERVICE] Failed to clear wishlist:", error);
      throw error;
    }
  }

  async syncWishlist(items: WishlistItem[]): Promise<WishlistItem[]> {
    try {
      const data = await http.post<WishlistItem[]>(`${this.baseURL}/sync`, {
        items: items.map(item => ({
          productId: item.productId,
          variantId: item.variantId,
        })),
      });
      return data;
    } catch (error) {
      console.error("[WISHLIST_SERVICE] Failed to sync wishlist:", error);
      throw error;
    }
  }
}

export const wishlistService = new WishlistService();
