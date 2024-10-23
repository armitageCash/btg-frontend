import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import App from "../App"; // Asegúrate de la ruta correcta
import useFundsStore from "../hooks/useFundStore";
import useUserStore from "../hooks/useUserStore";
import useSubscriptionStore from "../hooks/useSubscriptionsStore";
import useTransactions from "../hooks/useTransacctionStore";

// Mock de los hooks
jest.mock("../hooks/useFundStore");
jest.mock("../hooks/useUserStore");
jest.mock("../hooks/useSubscriptionsStore");
jest.mock("../hooks/useTransacctionStore");

describe("App Component", () => {
  beforeEach(() => {
    (useFundsStore as unknown as jest.Mock).mockReturnValue({
      fetchFunds: jest.fn(),
    });
    (useUserStore as unknown as jest.Mock).mockReturnValue({
      fetchUser: jest.fn(),
      user: { firstName: "Test User", wallet: { balance: 100 } },
      isLoading: false,
    });
    (useSubscriptionStore as unknown as jest.Mock).mockReturnValue({
      updateSubscriptions: jest.fn(),
    });
    (useTransactions as unknown as jest.Mock).mockReturnValue({
      transactions: [],
      fetchTransactions: jest.fn(),
      isLoading: false,
    });
  });

  test("renders the App component", () => {
    render(<App />);

    // Use screen queries instead of destructuring
    expect(screen.getByText("Transacciones")).toBeInTheDocument();
    expect(screen.getByText("Balance")).toBeInTheDocument();
    expect(screen.getByText("Account Balance (COP)")).toBeInTheDocument();
  });

  test("displays user's first name in the user menu", () => {
    expect(screen.getByText("Test User")).toBeInTheDocument();
  });

  test("opens modal when 'Nueva Apertura' button is clicked", async () => {
    render(<App />);

    const button = screen.getByText("Nueva Apertura");
    fireEvent.click(button);

    expect(await screen.findByText("Funds List")).toBeInTheDocument(); // Adjust based on actual content of FundsList
  });
});
