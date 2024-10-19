import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AllPairs = () => {
  const usdPriceData = [
    { pair: "WBTC/USD", price: "$30,000" },
    { pair: "WETH/USD", price: "$2,000" },
    { pair: "DXTR/USD", price: "$0.50" },
    { pair: "USDC/USD", price: "$2.50" },
  ];

  const relativePriceData = [
    { pair: "WBTC/WETH", price: "15" },
    { pair: "WBTC/DXTR", price: "60,000" },
    { pair: "WETH/DXTR", price: "4,000" },

    { pair: "WBTC/USDC", price: "15" },
    { pair: "WETH/USDC", price: "60,000" },
    { pair: "DEXTR/USDC", price: "4,000" },
  ];

  return (
    <div className="shadow-lg border border-gray-700 px-2 rounded-xl  h-full">
      <Tabs defaultValue="usd-price" className="mb-4">
        <TabsList className="flex space-x-4 border border-primary !bg-gray-800">
          <TabsTrigger
            value="usd-price"
            className="font-bold px-4  rounded-md data-[state=active]:bg-primary data-[state=active]:text-white data-[state=inactive]:bg-gray-800 data-[state=inactive]:text-gray-400"
          >
            USD Price
          </TabsTrigger>
          <TabsTrigger
            value="relative-price"
            className="font-bold px-4 rounded-md data-[state=active]:bg-primary data-[state=active]:text-white data-[state=inactive]:bg-gray-800 data-[state=inactive]:text-gray-400"
          >
            Relative Price
          </TabsTrigger>
        </TabsList>
        <TabsContent value="usd-price">
          <div>
            <div className="flex justify-between font-bold border-b border-b-gray-500  p-2">
              <span>Pair</span>
              <span>Price</span>
            </div>
            {usdPriceData.map((item, index) => (
              <div
                key={index}
                className="flex justify-between p-2 border-b border-b-gray-500"
              >
                <span>{item.pair}</span>
                <span>{item.price}</span>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="relative-price">
          <div>
            <div className="flex justify-between font-bold border-b border-b-gray-500 p-2 ">
              <span>Pair</span>
              <span>Price</span>
            </div>
            {relativePriceData.map((item, index) => (
              <div
                key={index}
                className="flex justify-between p-2 border-b border-b-gray-500"
              >
                <span>{item.pair}</span>
                <span>{item.price}</span>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AllPairs;
