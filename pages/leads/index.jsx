"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import * as XLSX from "xlsx";
import {PlusCircle, StepBack, StepForward } from "lucide-react";
import { integrateGetApi } from "@/utils/api";
import { useSession } from "next-auth/react";
import Lead from "@/components/Lead";
import DateRange from "@/components/DateRange";
import axios from "axios";
export default function LeadList() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [searchkey, setSearchkey] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { data: session } = useSession();
  const [dateRange, setDateRange] = useState({
    rangeType: 'all',
    startDate: null,
    endDate: null,
  })

  const handleDateChange = ({ value, startDate, endDate }) => {
    setDateRange({
      rangeType: value,
      startDate,
      endDate,
    })
  }
  const authToken = session?.user?.token
  const userRole = session?.user?.role
  const basePath = userRole === "staff" ? "lead/staff" : "lead";
  const url =
    process.env.NEXT_PUBLIC_BASEURL +
    basePath +
    '?page=' +
    currentPage +
    '&limit=15'+
    '&search=' +
    searchkey+
    (dateRange?.startDate ? '&startDate=' + dateRange?.startDate : '') +
    (dateRange?.endDate ? '&endDate=' + dateRange?.endDate : '');

    const refechData=()=>{
      integrateGetApi(url, setData, authToken);
    }

  useEffect(() => {
    const handler = setTimeout(() => {
      if (authToken) {
        integrateGetApi(url, setData, authToken);
      } else {
        console.log(session, 'No auth token');
      }
    }, searchkey ? 2000 : 0); // 2 seconds debounce only for `searchkey`
    return () => clearTimeout(handler); // Clear timeout on dependency change
  }, [authToken, searchkey, currentPage,dateRange]);
  const handleSearch = (e) => {
    setCurrentPage(1);
    setSearchkey(e.target.value)
  }


  const downloadxls = async (e) => {
    try {
      setLoading(true);
      e.preventDefault();
      const url =process.env.NEXT_PUBLIC_BASEURL +
      basePath +
      '?page=1&limit=9999999'+
      '&search=' +
      searchkey+
      (dateRange?.startDate ? '&startDate=' + dateRange?.startDate : '') +
      (dateRange?.endDate ? '&endDate=' + dateRange?.endDate : '');
      const response = await axios.get(url, {
        headers: {
          'Content-Type': 'application/json',
          'auth-token': authToken,
        },
      });
  
      const rawData = response?.data?.leadList || [];
      // Optional: Format and flatten nested data (e.g., user and product fields)
      const formattedData = rawData.map(lead => {
        const remarks = lead.remark?.slice(0, 5) || [];
        return {
          LeadID: lead._id || '',
          StaffID: lead.staffId._id || '',
          Ref: lead.staffId.name || '',
          Name: lead.name || '',
          Phone: lead.phone || '',
          Branch: lead.branch || '',
          CreatedAt: lead.createdAt ? new Date(lead.createdAt).toLocaleString() : '',
          UpdatedAt: lead.updatedAt ? new Date(lead.updatedAt).toLocaleString() : '',
          // Add remarks individually
          'Remark 1': remarks[0] ? `${remarks[0].reason}`: '',
          'Remark 2': remarks[1] ? `${remarks[1].reason}`: '',
          'Remark 3': remarks[2] ? `${remarks[2].reason}`: '',
          'Remark 4': remarks[3] ? `${remarks[3].reason}`: '',
          'Remark 5': remarks[4] ? `${remarks[4].reason}`: '',
        };
      });
  
      const ws = XLSX.utils.json_to_sheet(formattedData);
  
      // Dynamic column width
      const maxLengths = formattedData.reduce((acc, row) => {
        Object.keys(row).forEach(key => {
          const value = row[key]?.toString() || '';
          const length = value.length;
          if (!acc[key] || length > acc[key]) {
            acc[key] = length;
          }
        });
        return acc;
      }, {});
  
      const cols = Object.keys(maxLengths).map(key => ({
        wch: maxLengths[key] < 20 ? 20 : maxLengths[key]
      }));
      ws['!cols'] = cols;
  
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Leads');
      XLSX.writeFile(wb, 'leads.xlsx');
    } catch (error) {
      console.error("Failed to download XLS:", error);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = data?.totalPages??0;
  return (
    <div className="space-y-4 p-4">
  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
  <div className="flex flex-col md:flex-row w-full md:w-auto gap-2">
  <DateRange handleDateChange={handleDateChange}/>
    <Input
      type="text"
      placeholder="Search Leads..."
      value={searchkey}
      onChange={handleSearch}
      className="w-full md:w-96"
    />
  </div>

<div className="flex space-x-2">
<Button size="sm" className="h-7 gap-1 cursor-pointer" disabled={loading} onClick={(e)=>downloadxls(e)}>Get Excel File</Button>
  {/* Add Lead Button Section */}
  <Lead refechData={refechData} Children={<Button size="sm" className="h-7 gap-1 cursor-pointer">
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="">
            Add Leads
          </span>
        </Button>} />
</div>
</div>

      <Table>
        <TableHeader>
          <TableRow>
            {[
              { key: "name", label: "Name" },
              { key: "phone", label: "Phone" },
              { key: "action", label: "Action" },
            ].map((column) => (
              <TableHead key={column.key}>
                {column.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.leadList?.length > 0 ? (
            data?.leadList?.map((item) => (
              <TableRow key={item._id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.phone}</TableCell>
                <TableCell><Lead refechData={refechData} item={item} Children={<Button variant={'outline'}>Edit</Button>}/></TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-4">
                No results found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {data?.leadList?.length > 0 ? <div className="flex justify-between p-2 items-center">
        <div className="text-xs text-muted-foreground">
          Showing <strong>{currentPage}</strong> of <strong>{totalPages}</strong>{" "}
          pages
        </div>
        <div className="flex space-x-2">
          <Button size="sm" variant="outline" className="h-7 gap-1" onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
            <StepBack className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Previous
            </span>
          </Button>
          <Button size="sm" className="h-7 gap-1" onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Next
            </span>
            <StepForward className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div> : ""}
    </div>
  );
}