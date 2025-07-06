// app/dashboard/CategoryPieChartClient.jsx
"use client";

import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

export default function CategoryPieChartClient({ pieMonth, setPieMonth, categoryDistribution }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex w-full flex-row justify-between">
            <div>Category Overview</div>
            <div>
              <DropdownMenu>
                <DropdownMenuTrigger className="flex gap-1 items-center cursor-pointer">
                  <ChevronDown size={16} />
                  {pieMonth}
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Select Month</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {[
                    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
                  ].map((month) => (
                    <DropdownMenuItem
                      key={month}
                      onSelect={() => setPieMonth(month)}
                    >
                      {month}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center">
          <PieChart width={400} height={300}>
            <Pie
              data={
                categoryDistribution.find(entry => entry.month === pieMonth)?.categories || []
              }
              dataKey="percent"
              nameKey="category"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label
            >
              {(categoryDistribution.find(entry => entry.month === pieMonth)?.categories || []).map(
                (entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={['#4CAF50', '#FF5722', '#2196F3', '#9C27B0', '#FFC107', '#9E9E9E'][index % 6]}
                  />
                )
              )}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </CardContent>
      </Card>
    </motion.div>
  );
}
