// types.ts
export interface OrderData {
    price: number;
    amount: number;
    total: number;
  }
  
  export interface PairPrice {
    token: string;
    price: number;
  }
  
  // store.ts
  import { create } from "zustand";

  export interface OrderData {
    price: number;
    amount: number;
    total: number;
  }
  
  export interface PairPrice {
    token: string;
    price: number;
  }
  
  interface TradeStore {
    currOrderBook: string;
    bookSelector: string;
    reFetch: boolean;
    sellOrderData: OrderData[];
    buyOrderData: OrderData[];
    pairPrices: PairPrice[];
    setSellOrderData: (data: OrderData[]) => void;
    setBuyOrderData: (data: OrderData[]) => void;
    setPairPrices: (data: PairPrice[]) => void;
    setBookSelector: (selector: string) => void;
    setReFetch: (status: boolean) => void;
  }
  
  const useTradeStore = create<TradeStore>((set) => ({
    currOrderBook: "TOKEN_PAIR",
    bookSelector: "LP",
    reFetch: false,
    sellOrderData: [],
    buyOrderData: [],
    pairPrices: [],
    setSellOrderData: (data: OrderData[]) => set({ sellOrderData: data }),
    setBuyOrderData: (data: OrderData[]) => set({ buyOrderData: data }),
    setPairPrices: (data: PairPrice[]) => set({ pairPrices: data }),
    setBookSelector: (selector: string) => set({ bookSelector: selector }),
    setReFetch: (status: boolean) => set({ reFetch: status }),
  }));
  
  export default useTradeStore;
  