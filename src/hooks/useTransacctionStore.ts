import { create } from "zustand";
import axios from "axios";
import { apiUrl } from "../constants"; // Asegúrate de que esta constante esté bien definida
import { TransactionDetail } from "../types"; // Asegúrate de que este tipo esté bien definido

interface transactionState {
  transactions: TransactionDetail[];
  fetchTransactions: () => Promise<void>;
  setTransactions: (newTransactions: TransactionDetail[]) => void;
  addTx: (tx: TransactionDetail) => void;
  isLoading: boolean;
  error: string | null;
}

const useTransactions = create<transactionState>((set) => ({
  transactions: [],
  isLoading: false,
  error: null,

  // Función para establecer un nuevo conjunto de transacciones
  setTransactions: (newTransactions: TransactionDetail[]) => {
    set({ transactions: newTransactions });
  },

  // Función para obtener las transacciones desde el servidor
  fetchTransactions: async () => {
    console.log(process.env);
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(
        `${apiUrl}api/txs/${"a3bb189e-8bf9-3888-9912-ace4e6543002"}`
      );
      set({ transactions: response.data.data });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Error fetching transactions",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  // Función para agregar una nueva transacción al estado existente
  addTx: (tx: TransactionDetail) => {
    set((state) => ({
      transactions: [...state.transactions, tx], // Añadir la nueva transacción
    }));
  },
}));

export default useTransactions;
