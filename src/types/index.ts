import { SubscriptionDetailed } from "../hooks/useSubscriptionsStore";

export type TransactionDetail = {
  _id: string;
  subscription: SubscriptionDetailed;
  performance: number;
  date: string;
  status: string;
  type: string;
  __v: number;
};
