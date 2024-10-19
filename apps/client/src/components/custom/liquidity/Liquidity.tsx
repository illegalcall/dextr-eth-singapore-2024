import { Button } from "@/components/ui/button";
import { useState } from "react";
import AddLiquidity from "./AddLiquidity";

const Liquidity = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const openDialog = () => setIsDialogOpen(true);
  const closeDialog = () => setIsDialogOpen(false);

  return (
    <div className="container mx-auto max-w-2xl p-8 bg-gray-900 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-white mb-4">Add Liquidity</h1>
      <p className="text-gray-300 mb-6">
        Create a position with a single token and start earning fees from
        multiple pairs.
      </p>
      <Button className="w-full transition duration-300" onClick={openDialog}>
        Create Position
      </Button>

      <AddLiquidity isOpen={isDialogOpen} onClose={closeDialog} />
    </div>
  );
};

export default Liquidity;
