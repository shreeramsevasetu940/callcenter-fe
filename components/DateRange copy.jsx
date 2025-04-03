// import { Button } from "@/components/ui/button";
// import { Calendar } from "@/components/ui/calendar";
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
// import { CalendarIcon } from "lucide-react";
// import moment from "moment";
// import { useState } from "react";

// const DateRange = ({ dateRange, setDateRange }) => {
//   const [tempRange, setTempRange] = useState(dateRange || { from: null, to: null });
//   const [open, setOpen] = useState(false); // Track Popover state

//   const handleDateChange = (range) => {
//     if (!range?.from || !range?.to) {
//       setTempRange(range); // Update temporary state if only one date is selected
//       return;
//     }

//     setTempRange(range);
//     setDateRange(range);
//     setOpen(false); // Close Popover only when both dates are selected
//   };

//   return (
//     <div>
//       <Popover open={open} onOpenChange={setOpen}>
//         <PopoverTrigger asChild>
//           <Button variant="outline" className="h-9 w-60 justify-start text-left">
//             <CalendarIcon className="h-4 w-4 mr-2" />
//             {tempRange?.from && tempRange?.to
//               ? `${moment(tempRange.from).format("DD MMM YYYY")} - ${moment(tempRange.to).format("DD MMM YYYY")}`
//               : "Pick date range"}
//           </Button>
//         </PopoverTrigger>
//         <PopoverContent align="start" className="w-auto p-2">
//           <Calendar
//             mode="range"
//             selected={tempRange}
//             onSelect={handleDateChange}
//             numberOfMonths={2}
//           />
//         </PopoverContent>
//       </Popover>
//     </div>
//   );
// };

// export default DateRange;

import { useState } from "react"; 
import Datepicker from "react-tailwindcss-datepicker";

const DateRange = () => {
  const [value, setValue] = useState({ 
    startDate: null, 
    endDate: null
});
  return (
    <div>
          <Datepicker 
            value={value} 
            onChange={newValue => setValue(newValue)}
        /> 
    </div>
  )
}

export default DateRange
