"use client";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
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
import {StepBack, StepForward } from "lucide-react";
import { integrateGetApi } from "@/utils/api";
import { Tabs,TabsList,TabsTrigger } from "@/components/ui/tabs"
import { useRouter } from "next/router";
import { getSession, useSession } from "next-auth/react";
import { requireAuthentication } from "@/utils/utils";


export default function MemberList() {
  const [activeTab, setActiveTab] = useState('all');
  const [data, setData] = useState([]);
  const [searchkey, setSearchkey] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { data: session } = useSession();
  const authToken = session?.user?.token
  const url =
    process.env.NEXT_PUBLIC_BASEURL +
    'staff?page=' +
    currentPage +
    '&limit=25'+
    '&search=' +
    searchkey +
    '&status='+
    activeTab
    useEffect(() => {

      if (authToken) {
        integrateGetApi(url, setData, authToken)
      }else{
        console.log(session,'No auth token')
      }
    }, [authToken, searchkey, currentPage,activeTab])
    useEffect(() => {
      console.log(activeTab,'activeTab')
    }, [activeTab])
    useEffect(() => {
      const checkAuthentication = async () => {
          const session = await getSession();
          if (!session) {
              router.push('/sign-in');
          }
      };
      checkAuthentication();
  }, []); // The empty dependency array ensures that the effect runs only once on mount


  const totalPages = data?.totalPages;
  return (
    <div className="space-y-4 p-4">
<Tabs value={activeTab} onValueChange={setActiveTab}>
  <TabsList>
    <TabsTrigger value="all">All</TabsTrigger>
    <TabsTrigger value="active">Active</TabsTrigger>
    <TabsTrigger value="inactive">InActive</TabsTrigger>
    <TabsTrigger value="suspend">Suspend</TabsTrigger>
  </TabsList>
      <Input
        type="text"
        placeholder="Search Members..."
        value={searchkey}
        onChange={(e) => setSearchkey(e.target.value)}
        className="w-full md:w-1/2"
      />
      <Table>
        <TableHeader>
          <TableRow>
            {[
              { key: "name", label: "Name" },
              { key: "branch", label: "Branch" },
              { key: "role", label: "Role" },
              { key: "email", label: "Email" },
              { key: "phone", label: "Phone" },
              { key: "companyMobileNo", label: "CompanyNo" },
              { key: "status", label: "Status" },
            ].map((column) => (
              <TableHead key={column.key}>
                {column.label} 
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.staffList?.length > 0 ? (
            data?.staffList.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.branch}</TableCell>
                <TableCell>
                  <Badge>{item.role}</Badge>
                </TableCell>
                <TableCell>{item.email}</TableCell>
                <TableCell>{item.phone}</TableCell>
                <TableCell>{item.companyMobileNo}</TableCell>
                <TableCell>
                  <Badge>{item.status}</Badge>
                </TableCell>
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
      {data?.staffList?.length > 0?<div className="flex justify-between p-2 items-center">
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
                <StepForward className="h-3.5 w-3.5"/>
                </Button>
                  </div>
      </div>:""}
  </Tabs>                
    </div>
  );
}

// export async function getServerSideProps(context) {
//   return requireAuthentication(context, ({ session }) => {
//     return {
//       props: { session },
//     };
//   });
// }