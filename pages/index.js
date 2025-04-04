// "use client";

// import React, { useState } from "react";
// import { format } from "date-fns";
// import { DayPicker } from "react-day-picker";
// import "react-day-picker/dist/style.css";

// export default function DateRangePicker({ selectedRange, setSelectedRange }) {
//   const [isOpen, setIsOpen] = useState(false);

//   return (
//     <div className="relative">
//       {/* Date Picker Trigger */}
//       <button
//         onClick={() => setIsOpen(!isOpen)}
//         className="flex items-center gap-2 border px-4 py-2 rounded-lg shadow-sm bg-white w-64"
//       >
//         📅 {selectedRange?.from ? (
//           <span>
//             {format(selectedRange.from, "MMM dd, yyyy")} -{" "}
//             {selectedRange.to ? format(selectedRange.to, "MMM dd, yyyy") : "..."}
//           </span>
//         ) : (
//           <span className="text-gray-400">Select date range</span>
//         )}
//       </button>

//       {/* Date Picker Popup */}
//       {isOpen && (
//         <div className="absolute z-10 mt-2 bg-white p-3 shadow-lg rounded-lg">
//           <DayPicker
//             mode="range"
//             selected={selectedRange}
//             onSelect={setSelectedRange}
//             numberOfMonths={2}
//           />
//         </div>
//       )}
//     </div>
//   );
// }


"use client";

import React, { useState } from "react";

export default function Dashboard() {

  return (
    <div className="">
    </div>
  );
}