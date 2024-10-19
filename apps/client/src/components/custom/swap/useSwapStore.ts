import { create } from 'zustand';

export type Token = 'WBTC' | 'WETH' | 'DEXTR' | 'USDC';

interface SwapState {
  sellAmount: number;
  sellCurrency: Token;
  sellBalance: number;
  sellPrice: number;
  buyAmount: number;
  buyCurrency: Token;
  buyBalance: number;
  buyPrice: number;
  percentageChange: number;
  setSellAmount: (amount: number) => void;
  setSellPrice: (price: number) => void;
  setSellCurrency: (currency: Token) => void;
  setBuyCurrency: (currency: Token) => void;
  setSellBalance: (balance: number) => void;
  setBuyBalance: (balance: number) => void;
  setBuyAmount: (amount: number) => void;
  setBuyPrice: (price: number) => void;
}

export const useStore = create<SwapState>((set) => ({
  sellAmount: 1,
  sellCurrency: 'WBTC',
  sellBalance: 0,
  sellPrice: 30000,
  buyAmount: 0.01,
  buyCurrency: 'WETH',
  buyBalance: 0.5,
  buyPrice: 1800,
  percentageChange: 0.25,
  setSellAmount: (amount) => set({ sellAmount: amount }),
  setSellPrice: (price) => set({ sellPrice: price }),
  setSellCurrency: (currency) => set({ sellCurrency: currency }),
  setBuyCurrency: (currency) => set({ buyCurrency: currency }),
  setSellBalance: (balance) => set({ sellBalance: balance }),
  setBuyBalance: (balance) => set({ buyBalance: balance }),
  setBuyAmount: (amount) => set({ buyAmount: amount }),
  setBuyPrice: (price) => set({ buyPrice: price }),
}));

// Token Data with balances and prices for each token
export const tokenData = {
  WBTC: { balance: 2, price: 30000 },
  WETH: { balance: 5, price: 1800 },
  DXTR: { balance: 10000, price: 0.1 },
  USDC: { balance: 1000, price: 1 },
};
