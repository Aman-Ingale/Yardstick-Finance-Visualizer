import mongoose from "mongoose";
const TransactionSchema = new mongoose.Schema({
  amount:{type:Number, required:true},
  description:{type:String,required:true},
  date : {type:Date, required:true},
  category: {
    type: String,
    enum: ['Groceries', 'Healthcare', 'Transportation','Housing','Entertainment','Other' ],
    default:'Other' //required : true
  },
  createdAt:{type:Date, default:Date.now()},
  updatedAt: {type:Date, default:Date.now()},
});
const TransactionModel = mongoose.models?.transactions || mongoose.model("transactions", TransactionSchema);
export default TransactionModel