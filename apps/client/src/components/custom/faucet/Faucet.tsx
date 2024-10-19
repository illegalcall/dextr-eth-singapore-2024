import React, { useState } from "react";
import useWalletStore from "@/stores/walletStore";
import { BrowserProvider, Contract, ethers, parseUnits } from "ethers";
import CustomDropdown from "../CustomDropdown";
import { useContractStore } from "@/stores/contract/contractStore";

const DextrABI = [
  {
    inputs: [{ name: "_amount", type: "uint256" }],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const TOKEN_ADDRESSES = [
  { tokenName: "DEXTR", address: "0xcf7ed3acca5a467e9e704c703e8d87f634fb0fc9", logoLink: "dxtr-logo.png" },
  { tokenName: "WBTC", address: "0x9fe46736679d2d9a65f0992f2272de9f3c7fa6e0", logoLink: "wbtc-logo.png" },
  { tokenName: "WETH", address: "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512", logoLink: "weth-logo.png" },
  { tokenName: "USDC", address: "0x5fbdb2315678afecb367f032d93f642f64180aa3", logoLink: "usdc-logo.png" },
];

const tokenOptions = [
  { label: "WBTC", value: "WBTC" },
  { label: "WETH", value: "WETH" },
  { label: "DEXTR", value: "DEXTR" },
  { label: "USDC", value: "USDC" },
];

type Token = (typeof tokenOptions)[number]["value"];

interface TokenQuantity {
  token: Token;
  quantity: string;
}

const DFaucet: React.FC = () => {
  const connectedWalletAddress = useWalletStore((state) => state.address);
  const isWalletConnected = useWalletStore((state) => state.connected);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<Token>("DXTR");
  const dextrContract = useContractStore((state) => state.contracts['dextr'])
  const usdcContract = useContractStore((state) => state.contracts['usdcContract'])
  const wethContract = useContractStore((state) => state.contracts['wethContract'])
  const wbtchContract = useContractStore((state) => state.contracts['wbtcContract'])


  const tokenQuantity: TokenQuantity[] = [
    { token: "DXTR", quantity: "250" },
    { token: "WBTC", quantity: "250" },
    { token: "WETH", quantity: "250" },
    { token: "USDC", quantity: "250" },
  ];

  const importToken = async () => {
    const tokenDetails = TOKEN_ADDRESSES.find((e) => e.tokenName === token);
    if (!tokenDetails) {
      window.alert("Token details not found");
      return;
    }

    const {
      address: tokenAddress,
      tokenName: tokenSymbol,
      logoLink: tokenImage,
    } = tokenDetails;
    const tokenDecimals = "18";

    try {
      const wasAdded = await (window as any).ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: {
            address: tokenAddress,
            symbol: tokenSymbol,
            decimals: tokenDecimals,
            image: tokenImage,
          },
        },
      });

      window.alert(
        wasAdded
          ? "Token has been imported successfully"
          : "Token Import Failed"
      );
    } catch (error) {
      console.error(error);
      window.alert("An error occurred while importing the token.");
    }
  };

  const getTestTokens = async () => {
    if (!isWalletConnected || !connectedWalletAddress) {
      window.alert("Wallet is not connected");
      return;
    }
  
    setLoading(true);
  
    try {
      const provider = new BrowserProvider((window as any).ethereum);
      const signer = await provider.getSigner();
  
      let contract;
  
      switch (token) {
        case "DEXTR":
          contract = dextrContract;
          break;
        case "USDC":
          contract = usdcContract;
          break;
        case "WETH":
          contract = wethContract;
          break;
        case "WBTC":
          contract = wbtchContract;
          break;
        default:
          window.alert("Invalid token selected");
          setLoading(false);
          return;
      }
  
      const quantity =
        tokenQuantity.find((e) => e.token === token)?.quantity || "0";
  
      // Call the specific contract's mint function
      const trx = await contract!.mint(connectedWalletAddress, ethers.parseEther(quantity));
  
      const balanceOf = await contract!.balanceOf(connectedWalletAddress);
      console.log({ trx, balanceOf: ethers.formatEther(balanceOf) }, "TRX");
      await trx.wait();
  
      window.alert("Tokens are on their way to your Wallet");
    } catch (error) {
      console.error(error);
      window.alert("Something went wrong! Please try again.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div>
      <div className="p-3 py-8 xl:px-20">
        <div className="mb-8 flex flex-col gap-3">
          <h1 className="text-left font-primary text-4xl font-bold">Faucet</h1>
          <p className="font-secondary text-base text-[#D9D9D9]">
            Faucet to get different tokens for Dextr testnet
          </p>
        </div>
      </div>

      <div className="h-full w-full flex items-center justify-center mt-12">
        <div className="rounded-2xl border border-borderPrimary bg-gray-900 px-10 py-8">
          <h1 className="mb-2 font-primary text-2xl font-semibold">
            Get Your Test Tokens Here
          </h1>

          <div className="mt-8 w-full ">
            <div className="w-full  ">
              <label htmlFor="token-input" className="font-primary font-medium">
                Select Token
              </label>
              <div className="w-full">
                <CustomDropdown
                  items={tokenOptions}
                  value={token}
                  onChange={(value) => setToken(value)}
                  placeholder="Select a pair"
                />
              </div>
            </div>
          </div>

          <button className="mt-5 text-xs" onClick={importToken}>
            Click Here to import this token to your Wallet
          </button>

          <div className="mt-8 flex items-center justify-center  border-b border-borderPrimary pb-5">
            <button
              className="btn-pop  w-full rounded border border-borderPrimary bg-buttonPrimary py-1.5 font-primary font-bold text-white"
              onClick={getTestTokens}
              disabled={loading}
            >
              {loading
                ? "Loading..."
                : `GET ${
                    tokenQuantity.find((e) => e.token === token)?.quantity
                  } ${token}`}
            </button>
          </div>
          <a
            className="text-sm text-slate-300 font-semibold"
            target="_blank"
            href={"https://faucet.polygon.technology/"}
            rel="noopener noreferrer"
          >
            GET AMOY TESTNET TOKENS
          </a>
        </div>
      </div>
    </div>
  );
};

export default DFaucet;
