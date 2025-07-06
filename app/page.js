// Dashboard page
"use client";

import { useEffect, useState } from "react";
import { Home, Star, Wallet, Plus, Pencil, Trash2, ChevronDown } from "lucide-react";
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
export default function Dashboard() {
  const [transactions, setTransactions] = useState([])
  const [monthlyData, setmonthlyData] = useState([])
  const [total_amount, setTotal_amount] = useState(0)
  const [total_transactions, setTotal_transactions] = useState(0)
  const [top_category, setTop_category] = useState({ category: "Others", total: 0 })
  const [selectedYear, setSelectedYear] = useState(2025)
  const [edited, setEdited] = useState(0);
  const [editingRow, setEditingRow] = useState(null)
  const [formValues, setFormValues] = useState({});
  const [recentTxn, setRecentTxn] = useState({});
  const [pieMonth, setPieMonth] = useState("Jul");


  // DELETE request for deleting a transaction
  async function handleDeleteClick(txid) {
    setEdited(prevCount => prevCount + 1)
    const res = await fetch(`/api/transaction`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ _id: txid }),
    });
    const result = await res.json();
    if (result.success) {
      toast.success('Transaction Deleted!');
    }
    else {
      toast.error('Something went wrong')
    }
  }
  // Handling logic for edit button click
  const handleEditClick = (index, txn, txid) => {
    setEditingRow(index);
    setFormValues({
      _id: txid,
      description: txn.description,
      date: txn.date,
      amount: txn.amount,
      category: txn.category,
    });
  };

  const handleInputChange = (field, value) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };
  // helper function for updating transaction array
  function replaceItemByIndex(array, index, newItem) {
    const newArray = [...array];
    newArray[index] = newItem;
    return newArray;
  }
  //PUT request for updating a transaction
  const handleSave = async () => {
    const entry = transactions.findIndex((transaction) => transaction._id == formValues._id)
    console.log(entry)

    setTransactions(prev => replaceItemByIndex(prev, entry, formValues));
    setEdited(prevCount => prevCount + 1)
    console.log(transactions)
    const res = await fetch(`/api/transaction`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formValues),
    });
    const result = await res.json();
    if (result.success) {
      toast.success('Transaction updated!');
    }
    else {
      toast.error('Something went wrong')
    }
    setEditingRow(null);
  };
  const handleCancel = () => {
    setEditingRow(null);
  };

  const [categoryDistribution, setCategoryDistribution] = useState(null);
  // GET request for getting all transactions and data for charts
  useEffect(() => {
    async function getAllTransactions() {
      const r = await fetch("/api/transaction", {
        method: "GET",
      });
      const result = await r.json();

      if (result.success) {
        console.log()
        setRecentTxn(result.recentTxn)
        setTransactions(result.transactions);
        setCategoryDistribution(result.detailed_category_data);
        setmonthlyData(result.months);
        setTotal_amount(result.total_amount)
        setTotal_transactions(result.total_transactions)
        setTop_category(result.top_category)
      }
      else {
        console.log(result.message);
        toast.error('Network Error', {
          description: result.message,
        })
      }
    }
    getAllTransactions()
  }, [edited])
  const router = useRouter();
  async function handleAdd() {
    router.push('/add');
  }

  // loading text if page is not ready
  if (!categoryDistribution) {
    return <div className="w-screen h-screen flex justify-center items-center">Loading...</div>;
  }
  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="w-full flex items-center justify-between">
        <h1 className="text-4xl font-bold mb-5 text-center">Dashboard</h1>
        {/* Add button for adding new transaction, redirecting to /add route */}
        <Button variant="outline" size="lg" onClick={handleAdd} className="cursor-pointer">
          <Plus />
          <span className="hidden lg:inline">Add</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Total amount of transaction (sum of amount of all transaction) */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total expences</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{total_amount}</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* The category with highest amount of transaction (Stage 2)*/}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Top Category</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent >
              <div className="text-2xl font-bold">{top_category?.category || "Other" + "(₹" + top_category?.total + ")"}</div>
              {/* <p className="text-xs text-muted-foreground">+2.5</p> */}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {/* Total number of transactions */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recent Transaction</CardTitle>
              <Home className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="flex justify-between items-center">
              <span className="text-2xl font-bold"> {recentTxn.category + " - ₹" + recentTxn.amount} </span>
              <span className="text-sm "> {new Date(recentTxn.date).toLocaleDateString()} </span>
              {/* <p className="text-xs text-muted-foreground">+12% from last month</p> */}
            </CardContent>
          </Card>
        </motion.div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="lg:col-span-2"
        >
          {/* Bar chart for monthly transaction overview, shows sum of amount of each month */}
          <Card>
            <CardHeader>
              <CardTitle className="flex w-full flex-row justify-between">
                <div>Monthly Overview</div>
                <div>
                  {/* Static dropdown menu for year (NOT ADDED ANY LOGIC) */}
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      {selectedYear}
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>Select Year</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {["2025"].map((year) => (
                        <DropdownMenuItem
                          key={year}
                          onSelect={() => setSelectedYear(year)}
                        >
                          {year}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="total" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card >
            <CardHeader>
              <CardTitle className="flex w-full flex-row justify-between">
                <div>Category Overview</div>
                {/* <CardDescription>Category wise transaction details</CardDescription> */}
                <div >
                  {/* Static dropdown menu for months*/}
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
                  data={categoryDistribution.find(entry => entry.month === pieMonth)?.categories || []}
                  dataKey="percent"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  label
                >
                  {categoryDistribution.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={['#4CAF50', '#FF5722', '#2196F3', '#9C27B0', '#FFC107', '#9E9E9E'][index % 6]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* space for stage 3 chart*/}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        {/* List of all the transactions in tabular form */}
        <Card>
          <CardHeader className="flex flex-col justify-center items-center">
            <CardTitle>Transactions</CardTitle>
            <CardDescription>List of all your transaction</CardDescription>
          </CardHeader>
          <CardContent>
            <table className="w-full text-sm">
              <thead className="border-b">
                <tr>
                  <th className="text-left py-2 font-semibold text-muted-foreground">Description</th>
                  <th className="text-center py-2 font-semibold text-muted-foreground">Date</th>
                  <th className="text-center py-2 font-semibold text-muted-foreground">Amount</th>
                  <th className="text-right py-2 font-semibold text-muted-foreground">Category</th>
                  <th className="text-right py-2 font-semibold text-muted-foreground">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {transactions?.map((txn, index) => (
                  <tr key={index} className="hover:bg-muted">
                    <td className="text-left py-3">
                      {editingRow === index ? (
                        <input
                          type="text"
                          value={formValues.description}
                          onChange={(e) => handleInputChange("description", e.target.value)}
                          className="border rounded px-2 py-1 w-full"
                        />
                      ) : (
                        txn.description
                      )}
                    </td>

                    <td className="text-center py-3">
                      {editingRow === index ? (
                        <input
                          type="date"
                          value={formValues.date.split("T")[0]}
                          onChange={(e) => handleInputChange("date", e.target.value)}
                          className="border rounded px-2 py-1"
                        />
                      ) : (
                        new Date(txn.date).toLocaleDateString()
                      )}
                    </td>

                    <td className="text-center py-3 font-medium">
                      {editingRow === index ? (
                        <input
                          type="number"
                          value={formValues.amount}
                          onChange={(e) => handleInputChange("amount", e.target.value)}
                          className="border rounded px-2 py-1 w-24 text-right"
                        />
                      ) : (
                        `₹${txn.amount.toLocaleString()}`
                      )}
                    </td>

                    <td className="text-right py-3">
                      {editingRow === index ? (
                        <select
                          value={formValues.category}
                          onChange={(e) => handleInputChange("category", e.target.value)}
                          className="border rounded px-2 py-1"
                        >
                          <option>Groceries</option>
                          <option>Healthcare</option>
                          <option>Transportation</option>
                          <option>Housing</option>
                          <option>Entertainment</option>
                          <option>Other</option>
                        </select>
                      ) : (
                        txn.category
                      )}
                    </td>

                    <td className="text-right py-3">
                      {editingRow === index ? (
                        <div className="flex justify-end gap-3 items-center">
                          <button onClick={handleSave} className="text-green-600 font-semibold cursor-pointer">
                            Save
                          </button>
                          <button onClick={handleCancel} className="text-gray-600 cursor-pointer">
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex justify-end gap-3 items-center">
                          <button
                            className="cursor-pointer"
                            onClick={() => handleEditClick(index, txn, txn._id)}
                          >
                            <Pencil size={16} />
                          </button>
                          <button className="cursor-pointer" onClick={() => handleDeleteClick(txn._id)}>
                            <Trash2 size={16} color="#bd0000" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}