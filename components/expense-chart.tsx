import React from 'react';
import { Pie } from 'recharts';
import { Card } from "@/components/ui/card";

interface ExpenseChartProps {
  expenses: Array<{
    amount: number;
    description: string;
    tags: string[];
  }>;
}

const ExpenseChart: React.FC<ExpenseChartProps> = ({ expenses }) => {
  // Group expenses by tags
  const expensesByTag: Record<string, number> = {};
  
  expenses.forEach(expense => {
    expense.tags.forEach(tag => {
      expensesByTag[tag] = (expensesByTag[tag] || 0) + expense.amount;
    });
  });

  const chartData = Object.entries(expensesByTag).map(([tag, amount]) => ({
    name: tag,
    value: amount,
  }));

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Expenses by Category</h3>
      <div className="w-full h-[300px]">
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
          fill="#1a237e"
          label
        />
      </div>
    </Card>
  );
};

export default ExpenseChart;