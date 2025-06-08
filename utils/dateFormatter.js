"use client";

export function formatDate(date, options = {}) {
  if (!date) return '';
  
  const defaultOptions = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  };
  
  const finalOptions = { ...defaultOptions, ...options };
  
  const dateObj = date instanceof Date ? date : new Date(date);
  return dateObj.toLocaleDateString('en-US', finalOptions);
}

export function formatDateForInput(date) {
  if (!date) return '';
  
  const dateObj = date instanceof Date ? date : new Date(date);
  return dateObj.toISOString().split('T')[0];
}