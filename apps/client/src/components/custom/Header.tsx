import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trade, Faucet } from "@/pages"
import { Button } from "../ui/button"
import { onboard } from "@/lib/web3Onboard"
import useWalletStore from "@/stores/walletStore"
import CustomDropdown from "./CustomDropdown"
import shortenAddress from "@/lib/shortenAddress"
import { useState } from "react"
import ManageLiquidity from "@/pages/ManageLiquidity"
import Stake from "@/pages/Stake"
import useContract from "@/hooks/useContract"
import UserRegistryABI from '../../../.././../packages/shared/abis//UserRegistryABI.json'
import liquidityManagerABI from '../../../.././../packages/shared/abis/LiquidityManagerABI.json'
import DextrAbi from '../../../.././../packages/shared/abis/MockERC20ABI.json'
import AddLiquidityAbi from "../../../.././../packages/shared/abis/LiquidityManagerABI.json"
import OrderbookABI from "../../../.././../packages/shared/abis/OrderbookABI.json"
import stakeAbi from "../../../.././../packages/shared/abis/StakeABI.json"
import { useContractStore } from "@/stores/contract/contractStore"
import { ethers } from "ethers"
import { userRegistryContractAddress, dextrContractAddress, usdcContractAddress, wethContractAddress, wbtcContractAddress, stakeDextrContractAddress, addLiquidityAbiContractAddress, orderContractAddress } from "@/constants/contractAddresses"

// Connect Wallet (X)
// Approval to Dextr of 100 tokens (100) (dxtrContract.approval(userRegistryContractAddress, ethers.parseEther(100))) ( )
// Call User Registry contract with call registerUser() ( ) 

const HeaderWithTabs = () => {
  const connectedWalletAddress = useWalletStore((state) => state.address)
  const isWalletConnected = useWalletStore((state) => state.connected)
  const setWallet = useWalletStore((state) => state.setWallet)
  const disconnect = useWalletStore((state) => state.disconnect)
  const [activeTab, setActiveTab] = useState("trade")
  const userRegistryContract = useContractStore((state) => state.contracts['userRegistry'])
  const dextrContract = useContractStore((state) => state.contracts['dextr'])

  // Initialize multiple contracts
  useContract("userRegistry", userRegistryContractAddress, UserRegistryABI)
  useContract("dextr", dextrContractAddress, DextrAbi)
  useContract("usdcContract", usdcContractAddress, DextrAbi)
  useContract('wethContract', wethContractAddress, DextrAbi)
  useContract('wbtcContract', wbtcContractAddress, DextrAbi)
  useContract('stakeDextrContract', stakeDextrContractAddress, stakeAbi)
  useContract('addLiquidityContract', addLiquidityAbiContractAddress, AddLiquidityAbi)
  useContract('orderContractAddress', orderContractAddress, OrderbookABI)


  const handleConnect = async () => {
    const wallets = await onboard.connectWallet()

    if (wallets.length) {
      const connectedWallet = wallets[0]
      const address = connectedWallet.accounts[0].address
      const chainId = connectedWallet.chains[0]?.id

      setWallet(address, chainId)

      await onboard.setChain({ chainId: "0x7A69" })

      const isRegistered = await userRegistryContract!.isUserRegistered(connectedWallet.accounts?.[0]?.address!)
      if (!isRegistered) {
        const tx = await userRegistryContract!.registerUser()
        await tx.wait()
        await dextrContract!.approve(userRegistryContractAddress, ethers.parseEther('100'))
      }
    } else {
      console.log("No wallet connected")
    }
  }


  const handleLogout = () => {
    disconnect()
  }

  const dropdownItems = [
    {
      value: connectedWalletAddress || "",
      label: shortenAddress(connectedWalletAddress!) || "Wallet Address",
    },
    { value: "logout", label: "Log Out" },
  ]

  const handleTabChange = (value: string) => {
    setActiveTab(value)

  }

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="flex flex-col h-screen ">
      <div className="sticky top-0 z-50 ">
        <nav className="flex items-center justify-between p-5 pl-2 mx-auto max-w-7xl">
          <p className="text-lg font-bold">
            <img src="src/assets/dextr-white.png" alt="Logo" className="h-7" />
          </p>
          <div className="flex flex-1 justify-center">
            <TabsList className="flex space-x-4 border border-primary !bg-gray-800">
              <TabsTrigger
                value="trade"
                className="font-bold px-4 rounded-md data-[state=active]:bg-primary data-[state=active]:text-white data-[state=inactive]:bg-gray-800 data-[state=inactive]:text-gray-400"
              >
                Trade
              </TabsTrigger>
              <TabsTrigger
                value="faucet"
                className="font-bold px-4 rounded-md data-[state=active]:bg-primary data-[state=active]:text-white data-[state=inactive]:bg-gray-800 data-[state=inactive]:text-gray-400"
              >
                Faucet
              </TabsTrigger>
              <TabsTrigger
                value="manage-liquidity"
                className="font-bold px-4 rounded-md data-[state=active]:bg-primary data-[state=active]:text-white data-[state=inactive]:bg-gray-800 data-[state=inactive]:text-gray-400"
              >
                Manage Liquidity
              </TabsTrigger>
              <TabsTrigger
                value="stake"
                className="font-bold px-4 rounded-md data-[state=active]:bg-primary data-[state=active]:text-white data-[state=inactive]:bg-gray-800 data-[state=inactive]:text-gray-400"
              >
                Stake
              </TabsTrigger>
            </TabsList>
          </div>
          {isWalletConnected ? (
            <div>
              <CustomDropdown
                value=""
                items={dropdownItems}
                placeholder={shortenAddress(connectedWalletAddress!) || ""}
                onChange={(value) => {
                  if (value === "logout") {
                    handleLogout()
                  }
                }}
                className="rounded-xl"
              />
            </div>
          ) : (
            <Button onClick={handleConnect}>Connect</Button>
          )}
        </nav>
      </div>

      <div className="flex-1 overflow-auto px-4">
        <TabsContent value="trade">
          <Trade />
        </TabsContent>

        <TabsContent value="faucet">
          <Faucet />
        </TabsContent>

        <TabsContent value="manage-liquidity">
          <ManageLiquidity />
        </TabsContent>

        <TabsContent value="stake">
          <Stake />
        </TabsContent>
      </div>
    </Tabs>
  )
}

export default HeaderWithTabs
