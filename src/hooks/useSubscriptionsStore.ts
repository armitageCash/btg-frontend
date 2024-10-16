import { create } from "zustand";
import axios from "axios";
import { User } from "./useUserStore";
import { Fund } from "./useFundStore";
import { apiUrl } from "../constants";

export type Category = "FPV" | "FIC";

export interface Subscription {
  _id?: string;
  user?: string;
  fund: string;
  amount: number;
  createdAt?: Date;
  updatedAt?: Date;
  status?: "Opened" | "Closed";
}

export interface SubscriptionDetailed {
  _id: String;
  user: User;
  fund: Fund;
  amount: number;
  createdAt: Date;
  updatedAt: Date;
  status: "Opened" | "Closed";
}

export interface FundsState {
  subscriptions: Subscription[];
  updateSubscriptions: (Subscription: SubscriptionDetailed) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const useSubscriptionStore = create<FundsState>((set: any) => ({
  subscriptions: [],
  isLoading: false,
  error: null,

  updateSubscriptions: async (subscription: SubscriptionDetailed) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.put(
        `${apiUrl}api/subscription`,
        subscription
      );
      set({ funds: response.data });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Error fetching subscriptions",
      });
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useSubscriptionStore;
