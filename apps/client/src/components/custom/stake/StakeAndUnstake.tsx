import { useState } from "react";
import { create } from "zustand";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useContractStore } from "@/stores/contract/contractStore";
import { ethers } from "ethers";
import { stakeDextrContractAddress } from "@/constants/contractAddresses";

interface StakingStore {
  stakedBalance: number;
  unstakedBalance: number;
  setStakedBalance: (balance: number) => void;
  setUnstakedBalance: (balance: number) => void;
}

const useStakingStore = create<StakingStore>((set) => ({
  stakedBalance: 0.0,
  unstakedBalance: 0,
  setStakedBalance: (balance) => set({ stakedBalance: balance }),
  setUnstakedBalance: (balance) => set({ unstakedBalance: balance }),
}));

function StakeAndUnstake() {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [activeTab, setActiveTab] = useState("stake");
  const {
    stakedBalance,
    setStakedBalance,
    setUnstakedBalance,
    unstakedBalance,
  } = useStakingStore();
  const [sliderValue, setSliderValue] = useState(0);
  const stakeDextrContract = useContractStore((state) => state.contracts['stakeDextrContract'])
  const dextrContract = useContractStore((state) => state.contracts['dextr'])


  const handleStake = async () => {
    try {
      setIsLoading(true)
      const approveTrx = await dextrContract!.approve(stakeDextrContractAddress, ethers.parseEther(sliderValue.toString()));
      await approveTrx.wait();
      console.log(approveTrx)
      const trx = await stakeDextrContract!.stake(ethers.parseEther(sliderValue.toString()));
      await trx.wait();
      setStakedBalance(stakedBalance + sliderValue);
      setIsLoading(false)
      window.alert("Successfully staked!");
    } catch (error) {
      console.error(error);
      setIsLoading(false)
      window.alert("Failed to stake tokens.");
    }
  };

  const handleUnstake = async () => {
    try {
      setIsLoading(true)
      const trx = await stakeDextrContract!.unstake(ethers.parseEther(sliderValue.toString()));
      await trx.wait();
      setUnstakedBalance(unstakedBalance + sliderValue);
      window.alert("Successfully unstaked!");
      setIsLoading(false)
    } catch (error) {
      console.error(error);
      setIsLoading(false)
      window.alert("Failed to unstake tokens.");
    }
  };

  return (
    <div className="container mx-auto max-w-2xl">
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex flex-col mt-10"
      >
        <div className="bg-gray-800 p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-white mb-4 flex justify-between items-center">
            DXTR Staking
            {activeTab === "stake" && (
              <span className="text-lg">
                Staked DXTR Balance: {stakedBalance.toFixed(4)}
              </span>
            )}
            {activeTab === "unstake" && (
              <span className="text-lg">
                Unstaked DXTR Balance: {unstakedBalance.toFixed(4)}
              </span>
            )}
          </h2>
          <TabsList className="flex space-x-4 border border-primary !bg-gray-800 mb-4">
            <TabsTrigger
              value="stake"
              className="font-bold px-4 rounded-md data-[state=active]:bg-primary data-[state=active]:text-white data-[state=inactive]:bg-gray-800 data-[state=inactive]:text-gray-400"
            >
              Stake
            </TabsTrigger>
            <TabsTrigger
              value="unstake"
              className="font-bold px-4 rounded-md data-[state=active]:bg-primary data-[state=active]:text-white data-[state=inactive]:bg-gray-800 data-[state=inactive]:text-gray-400"
            >
              Unstake
            </TabsTrigger>
          </TabsList>

          <div className="mb-8 mt-8">
            <Slider
              value={[sliderValue]}
              onValueChange={(value) => setSliderValue(value[0])}
              max={100}
            />
            <div className="flex justify-between text-white text-xs mt-4">
              <span>0%</span>
              <span>25%</span>
              <span>50%</span>
              <span>75%</span>
              <span>100%</span>
            </div>
          </div>

          <TabsContent value="stake">
            <div className="w-full flex mb-4">
              <Button onClick={handleStake} className="w-full">
                {`${isLoading ? 'Staking...': 'Stake'}`}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="unstake">
            <div className="flex justify-between mb-4">
              <Button
                onClick={handleUnstake}
                className="w-full bg-red-500 hover:bg-red-700 text-white"
              >
                {`${isLoading ? 'Unstaking...': 'Unstake'}`}
              </Button>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

export default StakeAndUnstake;
