import { create } from "zustand";

interface WalletState {
  address: string | null;
  chainId: string | null;
  connected: boolean;
  setWallet: (address: string, chainId: string) => void;
  disconnect: () => void;
}

const useWalletStore = create<WalletState>((set) => ({
  address: null,
  chainId: null,
  connected: false,
  setWallet: (address, chainId) => set({ address, chainId, connected: true }),
  disconnect: () => set({ address: null, chainId: null, connected: false }),
}));

export default useWalletStore;
