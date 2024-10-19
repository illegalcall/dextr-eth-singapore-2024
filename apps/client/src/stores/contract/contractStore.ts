// contractStore.ts
import { create } from 'zustand';
import { ethers } from 'ethers';

type ContractState = {
  contracts: Record<string, ethers.Contract | null>;
  provider: ethers.Provider | null;
  signer: ethers.Signer | null;
  setContract: (key: string, contract: ethers.Contract) => void;
  setProvider: (provider: ethers.Provider) => void;
  setSigner: (signer: ethers.Signer) => void;
};

export const useContractStore = create<ContractState>((set) => ({
  contracts: {},
  provider: null,
  signer: null,
  setContract: (key, contract) => set((state) => ({
    contracts: { ...state.contracts, [key]: contract },
  })),
  setProvider: (provider) => set({ provider }),
  setSigner: (signer) => set({ signer }),
}));
