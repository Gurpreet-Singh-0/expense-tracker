"use client";

import { Clock, DollarSign, Tag, ArrowRight } from 'lucide-react';

export default function RecentExpenses({ expenses }) {
    if (expenses.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-all hover:shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-blue-600" />
                    Recent Expenses
                </h3>
                <div className="text-center py-8">
                    <div className="mx-auto w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                        <DollarSign className="w-8 h-8 text-blue-400" />
                    </div>
                    <p className="text-gray-600 font-medium">No expenses recorded yet</p>
                    <p className="text-sm text-gray-400 mt-1">Start tracking your expenses to see them here</p>
                </div>
            </div>
        );
    }

    const getCategoryColor = (category) => {
        const colors = {
            'Food': 'bg-red-50 text-red-700 border-red-100',
            'Transportation': 'bg-blue-50 text-blue-700 border-blue-100',
            'Entertainment': 'bg-purple-50 text-purple-700 border-purple-100',
            'Shopping': 'bg-pink-50 text-pink-700 border-pink-100',
            'Bills': 'bg-yellow-50 text-yellow-700 border-yellow-100',
            'Healthcare': 'bg-green-50 text-green-700 border-green-100',
            'Education': 'bg-indigo-50 text-indigo-700 border-indigo-100',
            'Travel': 'bg-cyan-50 text-cyan-700 border-cyan-100',
            'Other': 'bg-gray-50 text-gray-700 border-gray-100'
        };
        return colors[category] || 'bg-gray-50 text-gray-700 border-gray-100';
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-all hover:shadow-md">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-blue-600" />
                    Recent Expenses
                </h3>
                {expenses.length >= 5 && (
                    <button className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center">
                        View All <ArrowRight className="w-4 h-4 ml-1" />
                    </button>
                )}
            </div>
            
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                {expenses.map((expense) => (
                    <div 
                        key={expense.id} 
                        className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-100 hover:border-blue-200 transition-all duration-200 hover:shadow-sm"
                    >
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="font-medium text-gray-900 truncate pr-2">
                                    {expense.description || 'No description'}
                                </h4>
                                <span className="font-semibold text-gray-900 whitespace-nowrap ml-2">
                                    {expense.formattedAmount}
                                </span>
                            </div>
                            
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(expense.category)}`}>
                                        <Tag className="w-3 h-3 mr-1.5" />
                                        {expense.category}
                                    </span>
                                </div>
                                <span className="text-xs text-gray-500 whitespace-nowrap">
                                    {expense.formattedDate}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            {expenses.length >= 10 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                    <button className="w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center justify-center">
                        View All Expenses <ArrowRight className="w-4 h-4 ml-1" />
                    </button>
                </div>
            )}
        </div>
    );
}