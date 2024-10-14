import { create } from "zustand";
import { Subscription } from "./useSubscriptionsStore";

interface StoreState {
  txs: any[];
  funds: Subscription[];
  subscribe: (subscription: Subscription) => void;
  cancel: (subscriptionId: string) => void;
  clearFunds: () => void;
}

const useStore = create<StoreState>((set) => ({
  txs: [],
  funds: [],
  subscribe: (subscription: Subscription) =>
    set((state) => ({
      funds: [...state.funds, subscription],
    })),
  cancel: (subscriptionId: string) =>
    set((state) => ({
      funds: state.funds.filter((fund) => fund._id !== subscriptionId),
    })),
  clearFunds: () => set({ funds: [] }),
}));

export default useStore;
