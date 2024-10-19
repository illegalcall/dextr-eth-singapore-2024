import { create } from "zustand";

export interface Token {
  name: string;
  symbol: string;
  availableBalance: number;
  address: string;
  minPrice?: number; // Optional
  maxPrice?: number; // Optional
}

interface LiquidityState {
  depositToken: Token;
  secondaryTokens: Token[];
  depositAmount: string;
  currentPrice: string;
  updateDepositToken: (token: Token) => void;
  addSecondaryToken: (token: Token) => void;
  removeSecondaryToken: (token: Token) => void;
  updateDepositAmount: (amount: string) => void;
  updateCurrentPrice: (price: string) => void;
  updateTokenPrices: (symbol: string, minPrice: number, maxPrice: number) => void; // Updated method
}

export const useLiquidityStore = create<LiquidityState>((set) => ({
  depositToken: {
    name: "USD Coin",
    symbol: "USDC",
    availableBalance: 1000,
    address: "0x1234567890abcdef",
    minPrice: 0.6999,
    maxPrice: 1.2997,
  },
  secondaryTokens: [],
  depositAmount: "",
  currentPrice: "0.9998",

  updateDepositToken: (token) => set({ depositToken: token }),

  addSecondaryToken: (token) =>
    set((state) => ({
      secondaryTokens: [...state.secondaryTokens, token],
    })),

  removeSecondaryToken: (token) =>
    set((state) => ({
      secondaryTokens: state.secondaryTokens.filter((t) => t.symbol !== token.symbol),
    })),

  updateDepositAmount: (amount) => set({ depositAmount: amount }),

  updateCurrentPrice: (price) => set({ currentPrice: price }),

  updateTokenPrices: (symbol, minPrice, maxPrice) => set((state) => {
    const updatedSecondaryTokens = state.secondaryTokens.map(token =>
      token.symbol === symbol
        ? { ...token, minPrice, maxPrice }
        : token
    );

    return {
      secondaryTokens: updatedSecondaryTokens,
      depositToken: {
        ...state.depositToken,
        minPrice: state.depositToken.symbol === symbol ? minPrice : state.depositToken.minPrice,
        maxPrice: state.depositToken.symbol === symbol ? maxPrice : state.depositToken.maxPrice,
      },
    };
  }),
}));

// Usage example:
// const { updateTokenPrices } = useLiquidityStore();
// updateTokenPrices("WETH", 2500, 4000); // Update WETH prices
