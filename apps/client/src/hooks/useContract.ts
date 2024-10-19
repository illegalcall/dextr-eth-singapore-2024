import { useEffect } from 'react';
import { ethers } from 'ethers';
import { useContractStore } from '@/stores/contract/contractStore';

const useContract = (contractKey: string, contractAddress: string, contractABI: any) => {
  const setContract = useContractStore((state) => state.setContract);
  const setProvider = useContractStore((state) => state.setProvider);
  const setSigner = useContractStore((state) => state.setSigner);

  useEffect(() => {
    const initProvider = async () => {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.BrowserProvider(ethereum);
        const signer = await provider.getSigner();
        const contractInstance = new ethers.Contract(contractAddress, contractABI, signer);
        setProvider(provider);
        setSigner(signer);
        setContract(contractKey, contractInstance); // Use contractKey to identify contract
      }
    };

    initProvider();
  }, [contractKey, contractAddress, contractABI, setContract, setProvider, setSigner]);
};

export default useContract;
