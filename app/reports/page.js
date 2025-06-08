"use client";
import React, { useState, useMemo } from 'react';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { 
  Calendar, Download, TrendingUp, TrendingDown, 
  DollarSign, Target, AlertTriangle, Award, Eye, EyeOff,
  ArrowUpRight, ArrowDownRight, BarChart2, ChevronDown
} from 'lucide-react';
import useExpenses from '../../hooks/useExpenses';
import  Card  from '../../components/UI/Card';
import {Spinner}  from '../settings/components/Spinner';
import * as XLSX from 'xlsx';

const COLORS = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#F97316', '#06B6D4', '#84CC16'];

export default function ReportsPage() {
  const {
    expenses,
    loading,
    error,
    formatCurrency
  } = useExpenses();

  const [dateRange, setDateRange] = useState('6months');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [chartType, setChartType] = useState('bar');
  const [showPredictions, setShowPredictions] = useState(false);
  const [activeView, setActiveView] = useState('overview');

  // Processed data memo
  const processedData = useMemo(() => {
    if (!expenses || expenses.length === 0) {
      return {
        monthlyData: [],
        categoryData: [],
        dailyData: [],
        totalExpenses: 0,
        avgMonthlySpending: 0,
        filteredExpenses: []
      };
    }

    const now = new Date();
    let filteredExpenses = [...expenses];

    // Date range filtering
    if (dateRange === '1month') {
      const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      filteredExpenses = filteredExpenses.filter(exp => new Date(exp.date) >= oneMonthAgo);
    } else if (dateRange === '3months') {
      const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
      filteredExpenses = filteredExpenses.filter(exp => new Date(exp.date) >= threeMonthsAgo);
    } else if (dateRange === '6months') {
      const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
      filteredExpenses = filteredExpenses.filter(exp => new Date(exp.date) >= sixMonthsAgo);
    } else if (dateRange === '1year') {
      const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
      filteredExpenses = filteredExpenses.filter(exp => new Date(exp.date) >= oneYearAgo);
    }

    // Category filtering
    if (selectedCategory !== 'all') {
      filteredExpenses = filteredExpenses.filter(exp => exp.category === selectedCategory);
    }

    // Monthly data processing
    const monthlyData = {};
    filteredExpenses.forEach(expense => {
      const expenseDate = new Date(expense.date);
      const monthKey = expenseDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
      monthlyData[monthKey] = (monthlyData[monthKey] || 0) + parseFloat(expense.amount);
    });

    // Category data processing
    const categoryData = {};
    filteredExpenses.forEach(expense => {
      categoryData[expense.category] = (categoryData[expense.category] || 0) + parseFloat(expense.amount);
    });

    // Daily data processing
    const dailyData = {};
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    filteredExpenses.forEach(expense => {
      const expenseDate = new Date(expense.date);
      const dayKey = expenseDate.getDay();
      const dayName = dayNames[dayKey];
      dailyData[dayName] = (dailyData[dayName] || 0) + parseFloat(expense.amount);
    });

    // Ensure all days are represented
    dayNames.forEach(day => {
      if (!dailyData[day]) {
        dailyData[day] = 0;
      }
    });

    const totalExpenses = filteredExpenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
    const monthlyValues = Object.values(monthlyData);
    const avgMonthlySpending = monthlyValues.length > 0 ? 
      monthlyValues.reduce((sum, val) => sum + val, 0) / monthlyValues.length : 0;

    return {
      monthlyData: Object.entries(monthlyData)
        .sort(([a], [b]) => new Date(a + ' 1') - new Date(b + ' 1'))
        .map(([month, amount]) => ({ month, amount })),
      categoryData: Object.entries(categoryData)
        .map(([category, amount]) => ({ category, amount })),
      dailyData: dayNames.map(day => ({ day, amount: dailyData[day] })),
      totalExpenses,
      avgMonthlySpending,
      filteredExpenses
    };
  }, [expenses, dateRange, selectedCategory]);

  // Prediction data
  const predictionData = useMemo(() => {
    if (!showPredictions || processedData.monthlyData.length === 0) return [];
    
    const lastAmount = processedData.monthlyData[processedData.monthlyData.length - 1]?.amount || 0;
    const trend = 1.05; // 5% increase trend
    
    return [
      { month: 'Next Month', amount: lastAmount * trend, isPrediction: true },
      { month: 'Month +2', amount: lastAmount * trend * 1.03, isPrediction: true },
      { month: 'Month +3', amount: lastAmount * trend * 1.06, isPrediction: true }
    ];
  }, [processedData.monthlyData, showPredictions]);

  const combinedMonthlyData = [...processedData.monthlyData, ...predictionData];

  // Categories for filter
  const categories = useMemo(() => {
    if (!expenses || expenses.length === 0) return ['all'];
    return ['all', ...new Set(expenses.map(exp => exp.category))];
  }, [expenses]);

  // Key metrics
  const keyMetrics = useMemo(() => {
    if (!processedData.filteredExpenses || processedData.filteredExpenses.length === 0) {
      return {
        thisMonthTotal: 0,
        monthlyChange: 0,
        highestCategory: { category: 'None', amount: 0 },
        avgTransactionSize: 0,
        totalTransactions: 0
      };
    }

    const expenses = processedData.filteredExpenses;
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const thisMonthExpenses = expenses.filter(exp => {
      const expDate = new Date(exp.date);
      return expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear;
    });
    
    const lastMonthExpenses = expenses.filter(exp => {
      const expDate = new Date(exp.date);
      return expDate.getMonth() === (currentMonth - 1 + 12) % 12 && 
             expDate.getFullYear() === (currentMonth === 0 ? currentYear - 1 : currentYear);
    });

    const thisMonthTotal = thisMonthExpenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
    const lastMonthTotal = lastMonthExpenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
    const monthlyChange = lastMonthTotal ? ((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100 : 0;

    const highestCategory = processedData.categoryData.length > 0 
      ? processedData.categoryData.reduce((max, cat) => cat.amount > max.amount ? cat : max)
      : { category: 'None', amount: 0 };

    const avgTransactionSize = expenses.length ? processedData.totalExpenses / expenses.length : 0;

    return {
      thisMonthTotal,
      monthlyChange,
      highestCategory,
      avgTransactionSize,
      totalTransactions: expenses.length
    };
  }, [processedData]);

  // Export function
const exportData = () => {
  // Prepare the data for Excel export
  const dataToExport = processedData.filteredExpenses.map(expense => ({
    Date: new Date(expense.date).toLocaleDateString(),
    Description: expense.description,
    Category: expense.category,
    Amount: parseFloat(expense.amount),
    Notes: expense.notes || '',
  }));

  // Create a worksheet
  const worksheet = XLSX.utils.json_to_sheet(dataToExport);
  
  // Create a workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Expenses");
  
  // Generate Excel file and trigger download
  XLSX.writeFile(workbook, `expense-report-${dateRange}.xlsx`, {
    compression: true, // Enable ZIP compression for smaller files
  });
};

  // StatCard component
  const StatCard = ({ title, value, change, icon: Icon, color = 'indigo' }) => {
    const colorClasses = {
      indigo: {
        bg: 'bg-indigo-50',
        text: 'text-indigo-600',
        icon: 'text-indigo-600'
      },
      red: {
        bg: 'bg-red-50',
        text: 'text-red-600',
        icon: 'text-red-600'
      },
      green: {
        bg: 'bg-green-50',
        text: 'text-green-600',
        icon: 'text-green-600'
      },
      purple: {
        bg: 'bg-purple-50',
        text: 'text-purple-600',
        icon: 'text-purple-600'
      },
      orange: {
        bg: 'bg-orange-50',
        text: 'text-orange-600',
        icon: 'text-orange-600'
      }
    };

    return (
      <Card className="hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
            {change !== undefined && (
              <div className={`mt-2 inline-flex items-center text-sm font-medium ${change >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                {change >= 0 ? (
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 mr-1" />
                )}
                {Math.abs(change).toFixed(1)}%
              </div>
            )}
          </div>
          <div className={`p-3 rounded-lg ${colorClasses[color].bg}`}>
            <Icon className={`w-6 h-6 ${colorClasses[color].icon}`} />
          </div>
        </div>
      </Card>
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="text-center">
          <Spinner className="h-12 w-12 text-indigo-600 mx-auto" />
          <p className="mt-4 text-gray-600">Loading your financial insights...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <Card className="max-w-2xl mx-auto my-8 border-red-200">
        <div className="text-center p-8">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">Error loading reports</h3>
          <p className="mt-2 text-sm text-gray-600">{error}</p>
        </div>
      </Card>
    );
  }

  // Empty state
  if (!expenses || expenses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-4">
        <div className="text-center max-w-md">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100">
            <BarChart2 className="h-6 w-6 text-gray-400" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No expense data yet</h3>
          <p className="mt-2 text-sm text-gray-600">
            Start tracking your expenses to see detailed reports and insights.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen text-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div className="mb-4 md:mb-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Expense Analytics</h1>
            <p className="mt-2 text-gray-600">Detailed insights into your spending patterns</p>
          </div>
          <button
            onClick={exportData}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Download className="-ml-1 mr-2 h-5 w-5 text-gray-500" />
            Export Data
          </button>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label htmlFor="date-range" className="block text-sm font-medium text-gray-700 mb-1">
                Time Period
              </label>
              <div className="relative">
                <select
                  id="date-range"
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="1month">Last Month</option>
                  <option value="3months">Last 3 Months</option>
                  <option value="6months">Last 6 Months</option>
                  <option value="1year">Last Year</option>
                </select>
                <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>
            
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <div className="relative">
                <select
                  id="category"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>
                      {cat === 'all' ? 'All Categories' : cat}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div>
              <label htmlFor="chart-type" className="block text-sm font-medium text-gray-700 mb-1">
                Chart Type
              </label>
              <div className="relative">
                <select
                  id="chart-type"
                  value={chartType}
                  onChange={(e) => setChartType(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="bar">Bar Chart</option>
                  <option value="line">Line Chart</option>
                  <option value="area">Area Chart</option>
                </select>
                <ChevronDown className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => setShowPredictions(!showPredictions)}
                className={`w-full flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium ${
                  showPredictions 
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } transition-colors duration-200`}
              >
                {showPredictions ? (
                  <Eye className="w-4 h-4 mr-2" />
                ) : (
                  <EyeOff className="w-4 h-4 mr-2" />
                )}
                Predictions
              </button>
            </div>
          </div>
        </Card>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="This Month"
            value={formatCurrency(keyMetrics.thisMonthTotal)}
            change={keyMetrics.monthlyChange}
            icon={DollarSign}
            color="indigo"
          />
          <StatCard
            title="Avg Transaction"
            value={formatCurrency(keyMetrics.avgTransactionSize)}
            icon={TrendingUp}
            color="green"
          />
          <StatCard
            title="Top Category"
            value={keyMetrics.highestCategory.category}
            icon={Award}
            color="purple"
          />
          <StatCard
            title="Total Transactions"
            value={keyMetrics.totalTransactions.toString()}
            icon={BarChart2}
            color="orange"
          />
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {['overview', 'trends', 'categories', 'insights'].map((view) => (
              <button
                key={view}
                onClick={() => setActiveView(view)}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeView === view
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {view.charAt(0).toUpperCase() + view.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        {/* Chart Content */}
        <div className="space-y-6">
          {activeView === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Spending</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    {chartType === 'bar' && (
                      <BarChart data={combinedMonthlyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="month" stroke="#6b7280" />
                        <YAxis stroke="#6b7280" />
                        <Tooltip 
                          formatter={(value, name, props) => [
                            formatCurrency(value),
                            props.payload.isPrediction ? 'Predicted' : 'Actual'
                          ]}
                          contentStyle={{
                            backgroundColor: '#fff',
                            border: '1px solid #e5e7eb',
                            borderRadius: '0.375rem',
                            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                          }}
                        />
                        <Bar 
                          dataKey="amount" 
                          fill={(entry) => entry.isPrediction ? '#93C5FD' : '#3B82F6'}
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    )}
                    {chartType === 'line' && (
                      <LineChart data={combinedMonthlyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="month" stroke="#6b7280" />
                        <YAxis stroke="#6b7280" />
                        <Tooltip 
                          formatter={(value, name, props) => [
                            formatCurrency(value),
                            props.payload.isPrediction ? 'Predicted' : 'Actual'
                          ]}
                          contentStyle={{
                            backgroundColor: '#fff',
                            border: '1px solid #e5e7eb',
                            borderRadius: '0.375rem',
                            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                          }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="amount" 
                          stroke="#3B82F6" 
                          strokeWidth={2}
                          strokeDasharray="0"
                          dot={{ r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    )}
                    {chartType === 'area' && (
                      <AreaChart data={combinedMonthlyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="month" stroke="#6b7280" />
                        <YAxis stroke="#6b7280" />
                        <Tooltip 
                          formatter={(value, name, props) => [
                            formatCurrency(value),
                            props.payload.isPrediction ? 'Predicted' : 'Actual'
                          ]}
                          contentStyle={{
                            backgroundColor: '#fff',
                            border: '1px solid #e5e7eb',
                            borderRadius: '0.375rem',
                            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                          }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="amount" 
                          stroke="#3B82F6" 
                          fill="#3B82F6" 
                          fillOpacity={0.2}
                        />
                      </AreaChart>
                    )}
                  </ResponsiveContainer>
                </div>
              </Card>
              
              <Card>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Breakdown</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={processedData.categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ category, percent }) => `${category} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="amount"
                      >
                        {processedData.categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value) => [formatCurrency(value), 'Amount']}
                        contentStyle={{
                          backgroundColor: '#fff',
                          border: '1px solid #e5e7eb',
                          borderRadius: '0.375rem',
                          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                        }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>
          )}

          {activeView === 'trends' && (
            <div className="space-y-6">
              <Card>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Spending Pattern</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={processedData.dailyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="day" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip 
                        formatter={(value) => [formatCurrency(value), 'Amount']}
                        contentStyle={{
                          backgroundColor: '#fff',
                          border: '1px solid #e5e7eb',
                          borderRadius: '0.375rem',
                          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                        }}
                      />
                      <Bar 
                        dataKey="amount" 
                        fill="#3B82F6" 
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Spending Analysis</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={processedData.categoryData} 
                      layout="horizontal"
                      margin={{ left: 30, right: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis type="number" stroke="#6b7280" />
                      <YAxis 
                        dataKey="category" 
                        type="category" 
                        width={100} 
                        stroke="#6b7280"
                      />
                      <Tooltip 
                        formatter={(value) => [formatCurrency(value), 'Amount']}
                        contentStyle={{
                          backgroundColor: '#fff',
                          border: '1px solid #e5e7eb',
                          borderRadius: '0.375rem',
                          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                        }}
                      />
                      <Bar 
                        dataKey="amount" 
                        fill="#3B82F6" 
                        radius={[0, 4, 4, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>
          )}

          {activeView === 'categories' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {processedData.categoryData.map((category, index) => (
                <Card key={category.category}>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-gray-900">{category.category}</h4>
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    ></div>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 mb-2">
                    {formatCurrency(category.amount)}
                  </p>
                  <p className="text-sm text-gray-600">
                    {processedData.totalExpenses > 0 ? 
                      ((category.amount / processedData.totalExpenses) * 100).toFixed(1) : 0}% of total
                  </p>
                  <div className="mt-3 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ 
                        width: processedData.totalExpenses > 0 
                          ? `${(category.amount / processedData.totalExpenses) * 100}%` 
                          : '0%'
                      }}
                    ></div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {activeView === 'insights' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Spending Insights</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <TrendingUp className="w-5 h-5 text-green-500 mt-0.5" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Peak Spending Day</p>
                      <p className="text-sm text-gray-600">
                        {processedData.dailyData.length > 0 
                          ? processedData.dailyData.reduce((max, day) => 
                              day.amount > max.amount ? day : max).day
                          : 'N/A'
                        }
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <Target className="w-5 h-5 text-blue-500 mt-0.5" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Average Monthly Spending</p>
                      <p className="text-sm text-gray-600">
                        {formatCurrency(processedData.avgMonthlySpending)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Budget Alert</p>
                      <p className="text-sm text-gray-600">
                        {keyMetrics.monthlyChange > 10 ? 
                          'Spending increased significantly this month' : 
                          'Spending is within normal range'}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              <Card>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommendations</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="font-medium text-blue-900">
                      Optimize {keyMetrics.highestCategory.category}
                    </p>
                    <p className="text-sm text-blue-700 mt-1">
                      This is your highest spending category. Consider setting a budget limit.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="font-medium text-green-900">Track Daily Spending</p>
                    <p className="text-sm text-green-700 mt-1">
                      Your daily average is {formatCurrency(keyMetrics.avgTransactionSize)}. 
                      Setting daily limits can help control expenses.
                    </p>
                  </div>

                  {keyMetrics.monthlyChange > 0 && (
                    <div className="p-4 bg-yellow-50 rounded-lg">
                      <p className="font-medium text-yellow-900">Monthly Increase Alert</p>
                      <p className="text-sm text-yellow-700 mt-1">
                        Your spending increased by {keyMetrics.monthlyChange.toFixed(1)}% this month. 
                        Review recent transactions.
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}