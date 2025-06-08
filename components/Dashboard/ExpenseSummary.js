"use client";

import { TrendingUp, TrendingDown, DollarSign, Calendar, CreditCard } from "lucide-react";

export default function ExpenseSummary({
    totalExpenses,
    categoryTotals,
    expenses,
    formatCurrency
}) {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    const thisMonthExpenses = expenses.filter(expense => {
        const expenseDate = expense.date;
        return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
    });

    const thisMonthTotal = thisMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear; // Fixed typo

    // Fixed: Calculate last month expenses correctly
    const lastMonthExpenses = expenses.filter(expense => {
        const expenseDate = expense.date;
        return expenseDate.getMonth() === lastMonth && expenseDate.getFullYear() === lastMonthYear;
    });

    const lastMonthTotal = lastMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0); // Fixed variable name

    const percentageChange = lastMonthTotal > 0
        ? ((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100
        : thisMonthTotal > 0 ? 100 : 0;

    const topCategory = categoryTotals.length > 0
        ? categoryTotals.reduce((max, category) => category.total > max.total ? category : max, categoryTotals[0])
        : null;
    
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const currentDay = currentDate.getDate();
    const averageDailySpending = thisMonthTotal / currentDay;

    const summaryCards = [
        {
            title: "Total Expenses",
            value: formatCurrency(totalExpenses),
            icon: DollarSign,
            bgColor: "bg-blue-50",
            iconColor: 'text-blue-600',
            textColor: 'text-blue-900'
        },
        {
            title: 'This Month',
            value: formatCurrency(thisMonthTotal),
            icon: Calendar,
            bgColor: 'bg-green-50',
            iconColor: 'text-green-600',
            textColor: 'text-green-900',
            trend: {
                value: Math.abs(percentageChange).toFixed(1) + "%",
                isIncrease: percentageChange > 0,
                icon: percentageChange > 0 ? TrendingUp : TrendingDown
            }
        },
        {
            title: "Top Category",
            value: topCategory ? topCategory.formattedTotal : formatCurrency(0),
            subtitle: topCategory ? topCategory.category : "No expenses yet",
            icon: CreditCard,
            bgColor: "bg-purple-50",
            iconColor: "text-purple-600",
            textColor: 'text-purple-900'
        },
        {
            title: 'Daily Average',
            value: formatCurrency(averageDailySpending),
            icon: TrendingUp,
            bgColor: "bg-orange-50",
            iconColor: 'text-orange-600',
            textColor: "text-orange-900"
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {summaryCards.map((card, index) => (
                <div key={index} className={`${card.bgColor} rounded-lg p-6 border border-gray-200`}>
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-600 mb-1">{card.title}</p>
                            <p className={`text-2xl font-bold ${card.textColor}`}>{card.value}</p>
                            {card.subtitle && (
                                <p className="text-sm text-gray-500 mt-1">{card.subtitle}</p>
                            )}
                            {card.trend && (
                                <div className="flex items-center mt-2">
                                    <card.trend.icon 
                                        className={`w-4 h-4 mr-1 ${
                                            card.trend.isIncrease ? 'text-red-500' : 'text-green-500'
                                        }`} 
                                    />
                                    <span className={`text-sm font-medium ${
                                        card.trend.isIncrease ? 'text-red-600' : 'text-green-600'
                                    }`}>
                                        {card.trend.value}
                                    </span>
                                    <span className="text-sm text-gray-500 ml-1">vs last month</span>
                                </div>
                            )}
                        </div>
                        <div className={`${card.bgColor} p-3 rounded-full`}>
                            <card.icon className={`w-6 h-6 ${card.iconColor}`} />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}