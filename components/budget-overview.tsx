import React from 'react';
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface BudgetOverviewProps {
  budget: number;
  totalExpenses: number;
}

const BudgetOverview: React.FC<BudgetOverviewProps> = ({ budget, totalExpenses }) => {
  const remaining = budget - totalExpenses;
  const percentageUsed = (totalExpenses / budget) * 100;
  
  const getStatusColor = () => {
    if (percentageUsed >= 90) return 'text-red-500';
    if (percentageUsed >= 75) return 'text-warning';
    return 'text-secondary';
  };

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Budget Overview</h3>
      
      <div className="space-y-4">
        <div className="flex justify-between">
          <span>Total Budget:</span>
          <span className="font-semibold">₹{budget.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between">
          <span>Total Expenses:</span>
          <span className="font-semibold">₹{totalExpenses.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between">
          <span>Remaining:</span>
          <span className={`font-semibold ${getStatusColor()}`}>
            ₹{remaining.toFixed(2)}
          </span>
        </div>
        <Progress value={percentageUsed} className="h-2" />
      </div>
    </Card>
  );
};

export default BudgetOverview;