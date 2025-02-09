"use client";
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from 'sonner';

interface BudgetConfigProps {
  onSetBudget: (budget: number) => void;
  currentBudget: number;
}

const BudgetConfig: React.FC<BudgetConfigProps> = ({ onSetBudget, currentBudget }) => {
  const [budget, setBudget] = useState(currentBudget.toString());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const budgetAmount = parseFloat(budget);
    if (isNaN(budgetAmount) || budgetAmount <= 0) {
      toast.error('Please enter a valid budget amount');
      return;
    }

    onSetBudget(budgetAmount);
    toast.success('Budget updated successfully');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded-lg shadow">
      <div>
        <Label htmlFor="budget">Monthly Budget (₹)</Label>
        <Input
          id="budget"
          type="number"
          step="0.01"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          placeholder="0.00"
          className="mt-1"
        />
      </div>

      <div className='flex gap-4'>
        <Button variant="outline" className='text-zinc-500' onClick={()=> setBudget((currentBudget + 5000).toString())}>+5000</Button>
        <Button variant="outline" className='text-zinc-500' onClick={()=> setBudget((currentBudget + 10000).toString())}>+10000</Button>
        <Button variant="outline" className='text-zinc-500' onClick={()=> setBudget((currentBudget + 20000).toString())}>+20000</Button>
      </div>

      <Button type="submit" className="w-full bg-yellow-600 hover:bg-secondary/90">
        Update Budget
      </Button>
    </form>
  );
};

export default BudgetConfig;