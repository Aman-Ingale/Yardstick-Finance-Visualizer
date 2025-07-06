import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import TransactionModel from "@/models/transactionModel";
/**
 * Method: POST
 * Description: Add transactions
 */
export async function POST(req) {
  try {
    await dbConnect();
  }
  catch {
    return NextResponse.json({ success: false, message: "DB connection error" });
  }
  const data = await req.json()
  console.log(data)
  try {
    const newUser = new TransactionModel({
      amount: data.amount,
      description: data.description,
      date: data.date,
      category : data.category
    });
    await newUser.save();
    return NextResponse.json({ success: true, message: "Transaction added!" });
  } catch (error) {
    console.log("Error:", error);
    return null;
  }
}
/**
 * Method: GET
 * Description: GET all transactions and values for charts
 */
export async function GET() {
  try {
    try {
      await dbConnect();
    }
    catch {
      return NextResponse.json({ success: false, message: "DB connection error" });
    }
    const allTransactions = await TransactionModel.find({});
    const plainTransactions = allTransactions.map(pro =>
      JSON.parse(JSON.stringify(pro))
    );

    const monthOrder = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];


    const monthTotals = {};
    monthOrder.forEach(month => {
      monthTotals[month] = 0;
    });

    plainTransactions.forEach((txn) => {
      const date = new Date(txn.date);
      const monthKey = date.toLocaleString('default', { month: 'short' });
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
    const category_order = ['Groceries', 'Healthcare', 'Transportation', 'Housing', 'Entertainment', 'Other']
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
    const category_per_data_plain = category_order.map(category => ({
      category,
      total: Math.round(((categorical_totals[category] / plain_total_amount) * 100) * 100) / 100,
    }));

    const groupedByMonth = {};
    plainTransactions.forEach(txn => {
      const month = new Date(txn.date).toLocaleString('default', { month: 'short' });
      groupedByMonth[month] = groupedByMonth[month] || [];
      groupedByMonth[month].push(txn);
    });
    const detailed_category_data_plain = Object.entries(groupedByMonth).map(([month, txns]) => {
      const total = txns.reduce((sum, t) => sum + t.amount, 0); // e.g. 700
      const totals = Object.fromEntries(category_order.map(cat => [cat, 0]));
      txns.forEach(t => totals[t.category] += t.amount);
      const categories = category_order.map(cat => ({
        category: cat,
        percent: total ? +(totals[cat] / total * 100).toFixed(2) : 0
      }));
      return { month, total, categories };
    });

    const recentTxn_plain = await TransactionModel
      .findOne({})
      .sort({ date: -1 });
    return NextResponse.json({
      success: true,
      transactions: plainTransactions,
      months: months_data,
      total_transactions: plain_total_transactions,
      total_amount: plain_total_amount,
      top_category: topCategory,
      category_per_data: category_per_data_plain,
      recentTxn: recentTxn_plain,
      detailed_category_data : detailed_category_data_plain
    }, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Something went wrong." }, { status: 500 });
  }
}
/**
 * Method: PUT
 * Description: Update the transaction
 */
export async function PUT(req) {
  try {
    await dbConnect();
  }
  catch {
    return NextResponse.json({ success: false, message: "DB connection error" });
  }
  const Data = await req.json();
  const updateData = {
    ...Data,
    updatedAt: new Date,

  }
  console.log(updateData)
  try {

    const transaction = await TransactionModel.updateOne(
      { _id: updateData._id },
      { $set: updateData }
    );
    return NextResponse.json({ success: true, data: transaction }, { status: 500 });
  } catch (error) {
    console.log(error)
    return NextResponse.json({ success: false, data: {} }, { status: 500 });

  }
}
/**
 * Method: DELETE
 * Description: Delete the transaction
 */
export async function DELETE(req) {
  try {
    await dbConnect();
  }
  catch {
    return NextResponse.json({ success: false, message: "DB connection error" });
  } try {

    const { _id } = await req.json();
    console.log
    if (!_id) {
      return NextResponse.json({ success: false, message: "Missing ID" }, { status: 400 });
    }

    await TransactionModel.findByIdAndDelete(_id);

    return NextResponse.json({ success: true, message: "Transaction deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Something went wrong." }, { status: 500 });
  }
}

