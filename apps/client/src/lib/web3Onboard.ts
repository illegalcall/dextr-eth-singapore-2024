import Onboard from '@web3-onboard/core';
import injectedModule from '@web3-onboard/injected-wallets';

const injected = injectedModule();

const onboard = Onboard({
  wallets: [injected],
  chains: [
    {
      id: '0x7A69', 
      token: 'DEXTR',
      label: 'DEXTR Testnet',
      rpcUrl: 'https://cee2-223-255-254-102.ngrok-free.app'  
    }
  ]
});

export {onboard}
