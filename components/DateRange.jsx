import React from 'react';

const DateRangeInputs = ({ dateRange, setDateRange }) => {
  const handleStartDateChange = (e) => {
    const newStartDate = e.target.value;
    
    // Update the dateRange object with the new start date
    setDateRange({
      ...dateRange,
      startDate: newStartDate,
      // Reset end date if it's before the new start date
      endDate: dateRange.endDate && newStartDate > dateRange.endDate ? '' : dateRange.endDate
    });
  };

  const handleEndDateChange = (e) => {
    const newEndDate = e.target.value;
    
    // Only update if end date isn't before start date
    if (!dateRange.startDate || newEndDate >= dateRange.startDate) {
      setDateRange({
        ...dateRange,
        endDate: newEndDate
      });
    }
  };

  return (
   <>
     {/* <div className="flex  sm:flex-row gap-4">
      <div className="flex flex-col">
        <label htmlFor="start-date" className="text-sm font-medium text-gray-700 mb-1">
          Start Date
        </label>
        <input
          id="start-date"
          type="date"
          value={dateRange.startDate || ''}
          onChange={handleStartDateChange}
          className="px-3 py-1 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="end-date" className="text-sm font-medium text-gray-700 mb-1">
          End Date
        </label>
        <input
          id="end-date"
          type="date"
          value={dateRange.endDate || ''}
          onChange={handleEndDateChange}
          min={dateRange.startDate || ''}
          disabled={!dateRange.startDate}
          className="px-3 py-1 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
      </div>
    </div> */}
   </>
  );
};

export default DateRangeInputs;