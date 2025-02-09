"use client";

import React, { useState } from 'react';
import ExpenseForm from '@/components/expense-form';
import BudgetConfig from '@/components/budget-config';
import ExpenseChart from '@/components/expense-chart';
import BudgetOverview from '@/components/budget-overview';

interface Expense {
  amount: number;
  description: string;
  tags: string[];
}

export default function ExpenseTracker() {
  const [budget, setBudget] = useState(10000); // Default budget
  const [expenses, setExpenses] = useState<Expense[]>([]);

  const handleAddExpense = (expense: Expense) => {
    setExpenses([...expenses, expense]);
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold font-serif text-sky-600 mb-8 text-center">
          Expense Tracker
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <ExpenseForm onAddExpense={handleAddExpense} />
            <BudgetConfig onSetBudget={setBudget} currentBudget={budget} />
          </div>

          <div className="space-y-6">
            <BudgetOverview budget={budget} totalExpenses={totalExpenses} />
            <ExpenseChart expenses={expenses} />
          </div>
        </div>
      </div>
    </div>
  );
};