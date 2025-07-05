"use client";
import { useForm } from "react-hook-form";

import { useEffect, useState } from "react";
import { Home, Star, Wallet, Mail, Plus, Pencil, Trash2 } from "lucide-react";
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { motion } from "framer-motion";
import {
  PieChart, Pie, Cell, Legend
} from 'recharts';
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
// const monthlyData = [
//   { name: "Jan", earnings: 4000 },
//   { name: "Feb", earnings: 3000 },
//   { name: "Mar", earnings: 5000 },
//   { name: "Apr", earnings: 7000 },
//   { name: "May", earnings: 6000 },
// ];

export default function Dashboard() {
  const [date, setDate] = useState(new Date());
  const [transactions, setTransactions] = useState([])
  const [monthlyData, setmonthlyData] = useState([])
  const [total_amount, setTotal_amount] = useState(0)
  const [total_transactions, setTotal_transactions] = useState(0)
  const [top_category, setTop_category] = useState({})
  const [selectedYear, setSelectedYear] = useState(2025)
  const [edited, setEdited] = useState(0);
  const [editingRow, setEditingRow] = useState(null)
  const [formValues, setFormValues] = useState({});
  async function handleDeleteClick(txid) {
    setEdited(prevCount => prevCount + 1)
    const res = await fetch(`/api/transaction`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({_id : txid}),
    });
    const result = await res.json();
    console.log("Result:", result.message);

  }
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
  function replaceItemByIndex(array, index, newItem) {
    const newArray = [...array];
    newArray[index] = newItem;
    return newArray;
  }
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
    console.log("Result:", result.data);
    setEditingRow(null);
  };
  const handleCancel = () => {
    setEditingRow(null);
  };
  const form = useForm({
    defaultValues: {
      amount: "",
      description: "Rent",
      date: "",

    },
  });
  const staticDocumentData = {
    riskLevel: 'medium',
    complianceScore: 75,
    keyFindings: ['Clause 5.2 non-compliance', 'Missing signature block'],
    riskDistribution: [
      { label: 'Low', value: 40 },
      { label: 'Medium', value: 50 },
      { label: 'High', value: 10 },
    ],
    complianceGaps: [
      { category: 'Privacy', value: 20 },
      { category: 'Security', value: 40 },
      { category: 'Regulatory', value: 30 },
      { category: 'Contractual', value: 10 },
    ],
  };

  const [documentData, setDocumentData] = useState(null);

  useEffect(() => {
    setDocumentData(staticDocumentData);
    async function getAllTransactions() {
      const r = await fetch("/api/transaction", {
        method: "GET",
      });
      const result = await r.json();
      setTransactions(result.transactions);
      setmonthlyData(result.months);
      setTotal_amount(result.total_amount)
      setTotal_transactions(result.total_transactions)
      setTop_category(result.top_category)
    }
    getAllTransactions()
  }, [edited])
  // ✅ Hardcoded static provider data
  const router = useRouter();
  async function handleAdd() {
    router.push('/add');
  }
  async function onSubmit(values) {

  }

  if (!documentData) {
    return <div>Loading...</div>;
  }
  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="w-full flex items-center justify-between">
        <h1 className="text-4xl font-bold mb-5 text-center">Dashboard</h1>
        <Button variant="outline" size="lg" onClick={handleAdd} className="cursor-pointer">
          <Plus />
          <span className="hidden lg:inline">Add</span>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total amount</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{total_amount}</div>
              {/* <p className="text-xs text-muted-foreground">+20.1% from last month</p> */}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total transactions</CardTitle>
              <Home className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold"> {total_transactions} </div>
              {/* <p className="text-xs text-muted-foreground">+12% from last month</p> */}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Top Category</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{top_category.category} (₹{top_category.total})</div>
              {/* <p className="text-xs text-muted-foreground">+2.5</p> */}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts and PieChart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex w-full flex-row justify-between">
                <div>Monthly Overview</div>
                <div>
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
          <Card>
            <CardHeader>
              <CardTitle>Category Overview</CardTitle>
              <CardDescription>Category wise transaction details</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center items-center">


              {/* <PieChart width={400} height={300}>
                <Pie
                  data={documentData.riskDistribution}
                  dataKey="value"
                  nameKey="label"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  label
                >
                  {documentData.riskDistribution.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={['#00C49F', '#FFBB28', '#FF8042'][index % 3]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart> */}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Jobs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
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
                {transactions.map((txn, index) => (
                  <tr key={index} className="hover:bg-muted">
                    {/* Description */}
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

                    {/* Date */}
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

                    {/* Amount */}
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

                    {/* Category */}
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

                    {/* Actions */}
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
// <td>
//   <span>
//     <Input
//       id={txn._id}
//       value={txn.description || ""}
//       onChange={(e) =>
//         setProfile((prev) => ({ ...(prev || {}), tnx.description : e.target.value }))
//       }
//       disabled={!isEditing}
//     />
//   </span>
// </td>