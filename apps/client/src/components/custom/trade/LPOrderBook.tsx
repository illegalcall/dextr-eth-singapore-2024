import React, { useEffect, useState } from "react";
import { create } from "zustand";
import CustomDropdown from "../CustomDropdown";

interface Order {
  groupId: string;
  quantity: number;
}

interface PairPrice {
  primary: string;
  secondary: string;
  liquidity: number;
}

interface Store {
  sellOrderData: Order[];
  pairPrices: PairPrice[];
  selectedPair: string;
  setSellOrderData: (data: Order[]) => void;
  setPairPrices: (data: PairPrice[]) => void;
  setSelectedPair: (pair: string) => void;
}

const useStore = create<Store>((set) => ({
  sellOrderData: [],
  pairPrices: [],
  selectedPair: "BNB/USDC",
  setSellOrderData: (data) => set({ sellOrderData: data }),
  setPairPrices: (data) => set({ pairPrices: data }),
  setSelectedPair: (pair) => set({ selectedPair: pair }),
}));

const LpOrderBook: React.FC = () => {
  const { sellOrderData, setSellOrderData, pairPrices, setPairPrices, selectedPair, setSelectedPair } =
    useStore();

  const primaryToken = "BNB";
  const [primaryLiquidity, setPrimaryLiquidity] = useState<number>(0);

  const dummySellOrders: Order[] = [
    { groupId: "1", quantity: 10 },
    { groupId: "2", quantity: 5 },
  ];

  const dummyPairPrices: PairPrice[] = [
    { primary: primaryToken, secondary: "ETH", liquidity: 100 },
    { primary: primaryToken, secondary: "USDT", liquidity: 200 },
    { primary: primaryToken, secondary: "ADA", liquidity: 150 },
    { primary: primaryToken, secondary: "DOT", liquidity: 75 },
  ];

  const handlePairChange = (value: string) => {
    setSelectedPair(value);
  };

  useEffect(() => {
    setSellOrderData(dummySellOrders);
    setPrimaryLiquidity(
      dummySellOrders.reduce((total, order) => total + order.quantity, 0)
    );
    setPairPrices(dummyPairPrices);
  }, [setSellOrderData, setPairPrices]);

  return (
    <div className="rounded-2xl border border-gray-700 bg-bgPrimary p-2  h-full overflow-auto">
      <div className="flex items-center justify-between rounded-2xl bg-bgPrimary px-3 py-1 font-primary text-base font-semibold">
        <button className="rounded-lg px-2 py-0.5 bg-buttonPrimary text-whiteTextPrimary">
          LP
        </button>
        <CustomDropdown
          items={[
            { value: "BNB/USDC", label: "BNB/USDC" },
            { value: "ETH/USDC", label: "ETH/USDC" },
            { value: "DXTR/USDC", label: "DXTR/USDC" },
            { value: "ETH/DXTR", label: "ETH/DXTR" },
            { value: "DXTR/BNB", label: "DXTR/BNB" },
            { value: "ETH/BNB", label: "ETH/BNB" },
          ]}
          value={selectedPair}
          onChange={handlePairChange}
          placeholder="Select a pair"
          className="w-[180px]"
        />
      </div>

      <div className="mt-5 px-3.5">
        <table className="w-full table-fixed min-w-[220px] text-xs">
          <thead>
            <tr>
              <th className="text-left font-semibold">Token(Primary Token)</th>
              <th className="text-right font-semibold">Available Liquidity</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-1 font-semibold text-left">{primaryToken}</td>
              <td className="py-1 text-right">{primaryLiquidity.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-5 px-3.5">
        <table className="w-full table-fixed min-w-[220px] text-xs">
          <thead>
            <tr>
              <th className="text-left font-semibold">
                Token(Secondary Tokens)
              </th>
              <th className="text-right font-semibold">Available Liquidity</th>
            </tr>
          </thead>
          <tbody>
            {dummyPairPrices.map((pair) => (
              <tr key={pair.secondary}>
                <td className="py-1 font-semibold text-left">
                  {pair.secondary}
                </td>
                <td className="py-1 text-right">{pair.liquidity.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-5 flex justify-center ">
        {/* <Button className="min-w-full">
          Place Order
        </Button> */}
      </div>
    </div>
  );
};

export default LpOrderBook;
