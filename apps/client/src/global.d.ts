// global.d.ts
interface Eip1193Provider {
  isMetaMask?: boolean;
  request: (request: { method: string; params?: any[] | Record<string, any> }) => Promise<any>;
}

interface Window {
  ethereum: Eip1193Provider;
}
