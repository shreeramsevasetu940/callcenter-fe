import React, { useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'

// Util function to calculate date ranges
const getDateRange = (rangeType) => {
  const now = new Date()
  let startDate, endDate

  switch (rangeType) {
    case 'today':
      startDate = new Date(now.setHours(0, 0, 0, 0))
      endDate = new Date(now.setHours(23, 59, 59, 999))
      break
    case 'yesterday':
      const yesterday = new Date(now)
      yesterday.setDate(now.getDate() - 1)
      startDate = new Date(yesterday.setHours(0, 0, 0, 0))
      endDate = new Date(yesterday.setHours(23, 59, 59, 999))
      break
    case 'week':
      const weekStart = new Date(now)
      weekStart.setDate(now.getDate() - now.getDay()) // Sunday
      startDate = new Date(weekStart.setHours(0, 0, 0, 0))
      endDate = new Date()
      break
    case 'month':
      startDate = new Date(now.getFullYear(), now.getMonth(), 1)
      endDate = new Date()
      break
    case 'year':
      startDate = new Date(now.getFullYear(), 0, 1)
      endDate = new Date()
      break
    case 'all':
    default:
      startDate = null
      endDate = null
  }

  return { startDate, endDate }
}

const DateRange = ({ handleDateChange }) => {
  const [selectedRange, setSelectedRange] = useState('all')

  const handleChange = (value) => {
    setSelectedRange(value)
    const { startDate, endDate } = getDateRange(value)
    handleDateChange({ value, startDate, endDate }) // returns full range info
  }

  return (
    <Select value={selectedRange} onValueChange={handleChange}>
      <SelectTrigger className="w-full md:w-60">
        <SelectValue placeholder="Select Time" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All</SelectItem>
        <SelectItem value="today">Today</SelectItem>
        <SelectItem value="yesterday">Yesterday</SelectItem>
        <SelectItem value="week">This Week</SelectItem>
        <SelectItem value="month">This Month</SelectItem>
        <SelectItem value="year">This Year</SelectItem>
      </SelectContent>
    </Select>
  )
}

export default DateRange
