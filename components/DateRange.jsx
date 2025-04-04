import React from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'

const DateRange = () => {
  return (
    <Select>
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
