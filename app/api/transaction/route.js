import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import TransactionModel from "@/models/transactionModel";
export async function POST(req) {
  await dbConnect();
  const data = await req.json()
  console.log(data)
  try {
    const newUser = new TransactionModel({ 
        amount:data.amount,
        description:data.description,
        date : data.date,
    });
    await newUser.save();
    return NextResponse.json({ success: true, message: "Transaction added!" });
  } catch (error) {
    console.log("Error:", error);
    return null;
  }
}


export async function GET() {
  try {
    await dbConnect();

    const allTransactions = await TransactionModel.find({});
    const plainTransactions = allTransactions.map(pro =>
      JSON.parse(JSON.stringify(pro))
    );

    const monthOrder = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    const monthTotals = {};
    monthOrder.forEach(month => {
      monthTotals[month] = 0;
    });

    plainTransactions.forEach((txn) => {
      const date = new Date(txn.date);
      const monthKey = date.toLocaleString('default', { month: 'long' });
      monthTotals[monthKey] += txn.amount;
    });

    const months_data = monthOrder.map(month => ({
      month,
      total: monthTotals[month],
    }));

    const plain_total_transactions = plainTransactions.length;

    let plain_total_amount = 0;
    plainTransactions.forEach((txn) => {
      plain_total_amount += txn.amount;
    });

    let categorical_totals = {}
    const category_order = ['Groceries', 'Healthcare', 'Transportation','Housing','Entertainment','Other' ]
    category_order.forEach(category => {
      categorical_totals[category] = 0;
    });
    plainTransactions.forEach((txn) => {
      const category = txn.category;
      categorical_totals[category] += txn.amount; 
    });
    const category_data = category_order.map(category => ({
      category,
      total: categorical_totals[category],
    }));
    const topCategory = category_data.reduce((prev, current) =>
  current.total > prev.total ? current : prev
);
    return NextResponse.json({
      transactions: plainTransactions,
      months: months_data,
      total_transactions : plain_total_transactions,
      total_amount : plain_total_amount,
      top_category : topCategory,
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
export async function PUT(req){
    await dbConnect();
    const updateData = await req.json();
    try {
        
        const transaction = await TransactionModel.updateOne(
        { _id: updateData._id },
        { $set: updateData}
    );
        return NextResponse.json({success:true,data:transaction});
    } catch (error) { 
        console.log(error)
        return NextResponse.json({success:false,data:{}});

    }
}
export async function DELETE(req) {
  await dbConnect();

  const {_id} = await req.json();
  console.log
  if (!_id) {
    return NextResponse.json({ message: "Missing ID" }, { status: 400 });
  }

  await TransactionModel.findByIdAndDelete(_id);

  return NextResponse.json({ message: "Transaction deleted" });
}

