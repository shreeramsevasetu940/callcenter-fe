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
import {PlusCircle, StepBack, StepForward } from "lucide-react";
import { integrateGetApi } from "@/utils/api";
import { useSession } from "next-auth/react";
import Product from "@/components/Product";
export default function ProductList() {
  const [data, setData] = useState([]);
  const [searchkey, setSearchkey] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { data: session } = useSession();
  const authToken = session?.user?.token
  const url =
    process.env.NEXT_PUBLIC_BASEURL +
    'product?page=' +
    currentPage +
    '&limit=25'+
    '&search=' +
    searchkey

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
  }, [authToken, searchkey, currentPage]);
  const handleSearch = (e) => {
    setCurrentPage(1);
    setSearchkey(e.target.value)
  }

  const totalPages = data?.totalPages??0;
  return (
    <div className="space-y-4 p-4">
      <div className="flex justify-between items-center space-x-2">
        <Input
          type="text"
          placeholder="Search Products..."
          value={searchkey}
          onChange={handleSearch}
          className="w-full md:w-1/2"
        />
        <Product refechData={refechData} Children={<Button size="sm" className="h-7 gap-1 cursor-pointer">
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Add Products
          </span>
        </Button>} />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            {[
              { key: "name", label: "Name" },
              { key: "price", label: "Price" },
              { key: "action", label: "Action" },
            ].map((column) => (
              <TableHead key={column.key}>
                {column.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.productList?.length > 0 ? (
            data?.productList?.map((item) => (
              <TableRow key={item._id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.price}</TableCell>
                <TableCell><Product refechData={refechData} item={item} Children={<Button variant={'outline'}>Edit</Button>}/></TableCell>
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
      {data?.productList?.length > 0 ? <div className="flex justify-between p-2 items-center">
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