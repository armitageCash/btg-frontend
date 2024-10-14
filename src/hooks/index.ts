import { create } from "zustand";
import { Subscription } from "./useSubscriptionsStore";
import { TransactionDetail } from "../types";
import axios from "axios"; // Importar Axios

interface StoreState {
  txs: TransactionDetail[];
  funds: Subscription[];
  subscribe: (subscription: Subscription) => Promise<void>;
  cancel: (subscriptionId: string) => void;
  clearFunds: () => void;
  clearTxs: () => void;
}

const useStore = create<StoreState>((set) => ({
  txs: [],
  funds: [],
  setTxs: (transactions: TransactionDetail[]) => set({ txs: transactions }),

  subscribe: async (subscription: Subscription) => {
    try {
      const response = await axios.post("api/subscription", subscription, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const newTx: TransactionDetail = response.data;

      set((state) => ({
        txs: [...state.txs, newTx],
      }));
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error al crear la suscripción:", error.response?.data);
      } else {
        console.error("Error desconocido al crear la suscripción:", error);
      }
    }
  },

  cancel: (subscriptionId: string) =>
    set((state) => ({
      txs: state.txs.filter((fund) => fund._id !== subscriptionId),
    })),
  clearFunds: () => set({ funds: [] }),
  clearTxs: () => set({ txs: [] }),
}));

export default useStore;
