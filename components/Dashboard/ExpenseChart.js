"use client";
import { useEffect, useRef } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  DoughnutController,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

const COLORS = [
  '#3B82F6', // Blue
  '#EF4444', // Red
  '#10B981', // Green
  '#F59E0B', // Yellow
  '#8B5CF6', // Purple
  '#F97316', // Orange
  '#06B6D4', // Cyan
  '#84CC16', // Lime
  '#EC4899', // Pink
  '#6B7280', // Gray 
];

export default function ExpenseChart({ monthlyData, categoryTotals }) {
  const barChartRef = useRef(null);
  const pieChartRef = useRef(null);
  const barChartInstance = useRef(null);
  const pieChartInstance = useRef(null);

  useEffect(() => {
    ChartJS.register(
      CategoryScale,
      LinearScale,
      BarElement,
      BarController,
      DoughnutController,
      ArcElement,
      Title,
      Tooltip,
      Legend
    );
  }, []);

  useEffect(() => {
    // Destroy previous charts
    if (barChartInstance.current) {
      barChartInstance.current.destroy();
    }
    if (pieChartInstance.current) {
      pieChartInstance.current.destroy();
    }

    // Bar Chart
    if (barChartRef.current && monthlyData?.length > 0) {
      const ctx = barChartRef.current.getContext('2d');
      barChartInstance.current = new ChartJS(ctx, {
        type: 'bar',
        data: {
          labels: monthlyData.map(item => item.month), // Fixed: was item.match
          datasets: [{
            label: 'Monthly Expenses',
            data: monthlyData.map(item => item.total), // Fixed: was item.month
            backgroundColor: '#3b82f6',
            borderColor: '#2563eb',
            borderWidth: 1,
            borderRadius: 4,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  return `Amount: $${context.parsed.y.toFixed(2)}`; // Added $ symbol
                }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: function (value) {
                  return '$' + value.toFixed(0); // Fixed: removed '+' prefix, added '$'
                }
              }
            }
          }
        }
      });
    }

    // Pie Chart
    if (pieChartRef.current && categoryTotals?.length > 0) {
      const ctx = pieChartRef.current.getContext('2d');
      pieChartInstance.current = new ChartJS(ctx, {
        type: 'doughnut',
        data: {
          labels: categoryTotals.map(item => item.category),
          datasets: [{
            data: categoryTotals.map(item => item.total),
            backgroundColor: COLORS.slice(0, categoryTotals.length),
            borderWidth: 2,
            borderColor: "#ffffff",
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                padding: 20,
                usePointStyle: true
              }
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  return `${context.label}: $${context.parsed.toFixed(2)}`; // Added $ symbol
                }
              }
            }
          }
        }
      });
    }

    // Cleanup
    return () => {
      if (barChartInstance.current) {
        barChartInstance.current.destroy();
      }
      if (pieChartInstance.current) {
        pieChartInstance.current.destroy();
      }
    };
  }, [monthlyData, categoryTotals]);

  return (
    <div className="space-y-6">
      {/* Monthly Expenses Bar Chart */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Expenses (Last 6 Months)</h3>
        <div className="h-80">
          <canvas ref={barChartRef}></canvas>
        </div>
      </div>

      {/* Category Breakdown Pie Chart */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Expenses by Category</h3>
        <div className="h-80">
          <canvas ref={pieChartRef}></canvas>
        </div>
      </div>
    </div>
  );
}