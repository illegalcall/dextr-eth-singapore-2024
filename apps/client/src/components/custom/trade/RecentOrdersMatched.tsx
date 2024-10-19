import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Define the interface for each order item
interface OrderMatched {
  orderId: string;
  trader: string;
  tokenIn: string;
  tokenOut: string;
  tokenInAmount: number;
  tokenOutAmount: number;
  feeEarned: number;
}

interface RecentOrdersMatchedProps {
  orders: OrderMatched[];
}

const RecentOrdersMatched: React.FC<RecentOrdersMatchedProps> = ({
  orders,
}) => {
  const [displayedOrders, setDisplayedOrders] =
    useState<OrderMatched[]>(orders);

  useEffect(() => {
    setDisplayedOrders(orders);
  }, [orders]);

  return (
    <div className="w-full  border border-gray-700   rounded-xl">
      {/* <h2 className="text-xl font-semibold mb-4">Recent Orders Matched</h2> */}
      <Table className="border border-gray-700  ">
        <TableCaption className="text-gray-400">
          List of recently matched orders
        </TableCaption>
        <TableHeader className="bg-gray-800 text-gray-300 py-2">
          <TableRow>
            <TableHead className="bg-gray-800 text-gray-300 py-2 ">
              Order ID
            </TableHead>
            <TableHead className="bg-gray-800 text-gray-300 py-2 ">
              Trader
            </TableHead>
            <TableHead className="bg-gray-800 text-gray-300 py-2 ">
              Token In
            </TableHead>
            <TableHead className="bg-gray-800 text-gray-300 py-2">
              Token Out
            </TableHead>
            <TableHead className="bg-gray-800 text-gray-300 py-2 ">
              Token In Amount
            </TableHead>
            <TableHead className="bg-gray-800 text-gray-300 py-2 ">
              Token Out Amount
            </TableHead>
            <TableHead className="bg-gray-800 text-gray-300 py-2 ">
              Fee Earned
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {displayedOrders.map((order) => (
            <TableRow
              key={order.orderId}
              className="hover:bg-gray-700 transition-colors"
            >
              <TableCell className="border-b border-gray-600">
                {order.orderId}
              </TableCell>
              <TableCell className="border-b border-gray-600">
                {order.trader}
              </TableCell>
              <TableCell className="border-b border-gray-600">
                {order.tokenIn}
              </TableCell>
              <TableCell className="border-b border-gray-600">
                {order.tokenOut}
              </TableCell>
              <TableCell className="border-b border-gray-600">
                {order.tokenInAmount}
              </TableCell>
              <TableCell className="border-b border-gray-600">
                {order.tokenOutAmount}
              </TableCell>
              <TableCell className="border-b border-gray-600">
                {order.feeEarned}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default RecentOrdersMatched;
