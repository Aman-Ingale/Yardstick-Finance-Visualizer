// /api route for adding a new transaction
"use client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function Add() {
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      amount: "",
      description: "",
      date: "",
    },
  });
  // Handling back button logic
  async function handleClickBack() {
    router.back();
  }
  // POST request for adding transaction
  async function onSubmit(values) {
    console.log("Submitting:", values);
    const r = await fetch("/api/transaction", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    const result = await r.json();
    if (result.success) {
      toast.success('Transaction added!')
      router.push("/");
    } else {
      toast.error('Something went wrong')
      console.error("Submission failed:", result.message);
    }
  }

  return (
    <>

      <div className="flex justify-center items-center  px-4 bg-gray-50 h-screen">
        <Card className="w-full max-w-xl p-6 pt-0 shadow-lg bg-white space-y-6 gap-4">
          <span className="my-2  font-semibold   text-sm text-gray-700 ">
          <button onClick={handleClickBack} className="mb-0 cursor-pointer flex items-center gap-1">
              <ArrowLeft className="m-0 p-0 " size={16} />
              <div>Back</div>
          </button>
            </span>
          <CardHeader >
            <CardTitle >

              <div className="text-3xl font-bold text-center">Transaction Details</div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Enter amount" {...field} required />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea rows={4} placeholder="Enter description" {...field} required />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} required />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full mt-4">Submit</Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
