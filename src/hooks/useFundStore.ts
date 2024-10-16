import { create } from "zustand";
import axios from "axios";
import { apiUrl } from "../constants";
export type Category = "FPV" | "FIC";

export interface Fund {
  _id: string;
  name: string;
  category: string;
  minAmount: number;
  rate: number;
}

export interface FundsState {
  funds: Fund[];
  fetchFunds: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const useFundsStore = create<FundsState>((set: any) => ({
  funds: [],
  isLoading: false,
  error: null,

  fetchFunds: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${apiUrl}api/funds`);
      setTimeout(() => {
        set({ funds: response.data.data });
      }, 5000);
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Error fetching funds",
      });
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useFundsStore;
