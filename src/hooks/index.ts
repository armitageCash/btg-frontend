import { create } from "zustand";
import { Subscription } from "./useSubscriptionsStore";
import { TransactionDetail } from "../types";
import axios from "axios"; // Importar Axios
import { API_URL } from "../constants";

interface StoreState {
  txs: TransactionDetail[];
  tx?: TransactionDetail | null;
  funds: Subscription[];
  setTxs: (transactions: TransactionDetail[]) => void; // Agregar setTxs a la interfaz
  subscribe: (subscription: Subscription) => Promise<TransactionDetail | null>; // Asegurar que devuelva null en caso de error
  cancel: (subscriptionId: string) => void;
  clearFunds: () => void;
  clearTxs: () => void;
}

const useStore = create<StoreState>((set) => ({
  txs: [],
  tx: null,
  funds: [],

  setTxs: (transactions: TransactionDetail[]) => set({ txs: transactions }),

  subscribe: async (
    subscription: Subscription
  ): Promise<TransactionDetail | null> => {
    try {
      const response = await axios.post(
        `${API_URL}api/subscription`,
        subscription,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const newTx: TransactionDetail = response.data.data;
      console.log("new tx response", newTx);

      set((state) => ({
        txs: [...state.txs, newTx], // Agregar la nueva transacción a la lista
      }));

      return newTx; // Devuelve la nueva transacción creada
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error al crear la suscripción:", error.response?.data);
      } else {
        console.error("Error desconocido al crear la suscripción:", error);
      }
      return null; // Devuelve null en caso de error
    }
  },

  cancel: (subscriptionId: string) =>
    set((state) => ({
      txs: state.txs.filter((tx) => tx._id !== subscriptionId), // Cambiar 'fund' a 'tx'
    })),

  clearFunds: () => set({ funds: [] }),
  clearTxs: () => set({ txs: [] }),
}));

export default useStore;
