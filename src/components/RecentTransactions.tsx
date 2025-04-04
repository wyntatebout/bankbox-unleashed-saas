
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TransactionItem, { TransactionProps } from './TransactionItem';
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Sample transaction data
const transactionData: TransactionProps[] = [
  {
    id: '1',
    date: '2025-04-02',
    description: 'Amazon',
    amount: 56.42,
    type: 'expense',
    category: 'Shopping',
    merchant: {
      name: 'Amazon',
    }
  },
  {
    id: '2',
    date: '2025-04-01',
    description: 'Starbucks',
    amount: 5.67,
    type: 'expense',
    category: 'Food',
    merchant: {
      name: 'Starbucks',
    }
  },
  {
    id: '3',
    date: '2025-04-01',
    description: 'Salary Deposit',
    amount: 3500.00,
    type: 'income',
    category: 'Income',
  },
  {
    id: '4',
    date: '2025-03-30',
    description: 'Rent Payment',
    amount: 1200.00,
    type: 'expense',
    category: 'Housing',
  },
  {
    id: '5',
    date: '2025-03-28',
    description: 'Netflix',
    amount: 15.99,
    type: 'expense',
    category: 'Bills',
  },
  {
    id: '6',
    date: '2025-03-25',
    description: 'Freelance Work',
    amount: 750.00,
    type: 'income',
    category: 'Income',
  },
];

const RecentTransactions = () => {
  const [filter, setFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredTransactions = transactionData.filter(transaction => {
    const matchesFilter = filter === 'all' || 
                          (filter === 'income' && transaction.type === 'income') || 
                          (filter === 'expense' && transaction.type === 'expense');
    
    const matchesSearch = transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         transaction.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  return (
    <Card className="bank-card">
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle>Recent Transactions</CardTitle>
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search transactions..."
                className="pl-8 h-9 w-full sm:w-[180px] text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select defaultValue="all" onValueChange={setFilter}>
              <SelectTrigger className="h-9 w-[110px]">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-[400px] overflow-y-auto">
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map((transaction) => (
              <TransactionItem key={transaction.id} {...transaction} />
            ))
          ) : (
            <div className="py-8 text-center text-muted-foreground">
              No transactions found
            </div>
          )}
        </div>
        <div className="p-4 border-t border-border">
          <Button variant="outline" className="w-full">View All Transactions</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentTransactions;
