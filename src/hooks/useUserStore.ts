import { create } from "zustand";
import axios from "axios";
import { apiUrl } from "../constants";

export type Wallet = {
  _id: String;
  balance: number;
};

export interface User {
  _id: string; // Identificador único del usuario (puede ser un UUID)
  username: string; // Nombre de usuario
  firstName: string; // Primer nombre
  lastName: string; // Apellido
  email: string; // Correo electrónico
  password: string; // Contraseña (en producción, deberías manejar esto con seguridad)
  createdAt: Date; // Fecha de creación de la cuenta
  updatedAt: Date;
  wallet: Wallet; // Fecha de la última actualización
}

interface UsersState {
  user: User | null; // Se inicializa como null hasta que se cargue un usuario
  fetchUser: () => Promise<void>; // Asegúrate de que el id sea de tipo string
  isLoading: boolean;
  error: string | null;
}

const useUserStore = create<UsersState>((set) => ({
  user: null, // Inicializa user como null
  isLoading: false,
  error: null,

  fetchUser: async () => {
    // Define el tipo de id
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(
        `${apiUrl}api/me/${"a3bb189e-8bf9-3888-9912-ace4e6543002"}`
      );
      set({ user: response.data.data }); // Guarda el usuario obtenido
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Error fetching user",
      });
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useUserStore;
