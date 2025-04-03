// import { Button } from "@/components/ui/button";
// import { Calendar } from "@/components/ui/calendar";
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
// import { Calendar1Icon } from "lucide-react";
// import moment from "moment/moment";
// import { useState } from "react";

// export default function  index() {

//   const [dateRange, setDateRange] = useState({ from: null, to: null });

//     // ✅ Handle Date Selection
//     const handleDateChange = (range) => {
//         setDateRange(range);  // Directly update { from, to }
//     };


//   return (
//     <>
//  <Popover>
//                 <PopoverTrigger asChild>
//                     <Button variant="outline" className="h-10 w-56 justify-start text-left">
//                         <Calendar1Icon className="h-4 w-4 mr-2" />
//                         {dateRange.from && dateRange.to
//                             ? `${moment(dateRange.from).format("DD MMM YYYY")} - ${moment(dateRange.to).format("DD MMM YYYY")}`
//                             : "Pick date range"}
//                     </Button>
//                 </PopoverTrigger>
//                 <PopoverContent align="start" className="w-auto p-0">
//                     <Calendar
//                         mode="range"
//                         selected={dateRange}  // ✅ Fix: Directly use `{ from, to }`
//                         onSelect={handleDateChange}
//                         numberOfMonths={2} // 🎯 Show two months for better UX
//                     />
//                 </PopoverContent>
//             </Popover>
//     </>
//   )
// }

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar1Icon } from "lucide-react";
import moment from "moment";
import { useState } from "react";

export default function Index() {
  const [dateRange, setDateRange] = useState({ from: undefined, to: undefined });

  // ✅ Handle Date Selection
  const handleDateChange = (range) => {
    if (range) {
      setDateRange(range); // Update state only if range is valid
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="h-10 w-56 justify-start text-left">
          <Calendar1Icon className="h-4 w-4 mr-2" />
          {dateRange.from && dateRange.to
            ? `${moment(dateRange.from).format("DD MMM YYYY")} - ${moment(dateRange.to).format("DD MMM YYYY")}`
            : "Pick date range"}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-0">
        <Calendar
          mode="range"
          selected={dateRange} // ✅ Use `{ from, to }` directly
          onSelect={handleDateChange}
          numberOfMonths={2} // 🎯 Show two months for better UX
        />
      </PopoverContent>
    </Popover>
  );
}

