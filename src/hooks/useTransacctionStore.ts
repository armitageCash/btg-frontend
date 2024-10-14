import { create } from "zustand";
import axios from "axios";
import { API_URL } from "../constants";
import { TransactionDetail } from "../types";

export type Category = "FPV" | "FIC";

export interface Transaction {
  _id: string; // Identificador único de la transacción (UUID)
  subscription: string; // ID de la suscripción relacionada (referencia)
  performance: number; // Rendimiento de la transacción
  date: Date; // Fecha de la transacción
  status: "Completed" | "Pending"; // Estado de la transacción
  type: "IN" | "OUT"; // Tipo de transacción (entrada o salida)
}

interface transactionState {
  transactions: TransactionDetail[];
  fetchTrasactions: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const useTransactions = create<transactionState>((set: any) => ({
  transactions: [],
  isLoading: false,
  error: null,

  fetchTrasactions: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(
        `${API_URL}api/txs/${"a3bb189e-8bf9-3888-9912-ace4e6543002"}`
      );
      set({ transactions: response.data.data });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Error fetching Transaction",
      });
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useTransactions;
