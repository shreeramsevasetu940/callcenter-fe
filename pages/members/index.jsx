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
import {MoreHorizontal, PlusCircle, StepBack, StepForward } from "lucide-react";
import { integrateGetApi } from "@/utils/api";
import { Tabs,TabsList,TabsTrigger } from "@/components/ui/tabs"
import { useRouter } from "next/router";
import { getSession, useSession } from "next-auth/react";
import Link from "next/link";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function MemberList() {
  const [activeTab, setActiveTab] = useState('all');
  const [data, setData] = useState([]);
  const [searchkey, setSearchkey] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { data: session } = useSession();
  const authToken = session?.user?.token
  const router = useRouter()
  const url =
    process.env.NEXT_PUBLIC_BASEURL +
    'staff?page=' +
    currentPage +
    '&limit=25'+
    '&search=' +
    searchkey +
    '&status='+
    activeTab
    // useEffect(() => {
    //   if (authToken) {
    //     integrateGetApi(url, setData, authToken)
    //   }else{
    //     console.log(session,'No auth token')
    //   }
    // }, [authToken, searchkey, currentPage,activeTab])
    useEffect(() => {
      const handler = setTimeout(() => {
        if (authToken) {
          integrateGetApi(url, setData, authToken);
        } else {
          console.log(session, 'No auth token');
        }
      }, searchkey ? 2000 : 0); // 2 seconds debounce only for `searchkey`
    
      return () => clearTimeout(handler); // Clear timeout on dependency change
    }, [authToken, searchkey, currentPage, activeTab]);
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

  const handleSearch=(e)=>{
    setCurrentPage(1);
    setSearchkey(e.target.value)
  }

  const totalPages = data?.totalPages;
  return (
    <div className="space-y-4 p-4">
<Tabs value={activeTab} onValueChange={setActiveTab}>
 <div className="flex justify-between items-center">
 <TabsList>
    <TabsTrigger className={'cursor-pointer'} value="all">All</TabsTrigger>
    <TabsTrigger className={'cursor-pointer'} value="active">Active</TabsTrigger>
    <TabsTrigger className={'cursor-pointer'} value="inactive">InActive</TabsTrigger>
    <TabsTrigger className={'cursor-pointer'} value="suspend">Suspend</TabsTrigger>
  </TabsList>
  <Link href="/members/add">
                  <Button size="sm" className="h-7 gap-1 cursor-pointer">
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Add Members
                  </span>
                </Button>
                </Link>
</div>
      <Input
        type="text"
        placeholder="Search Members..."
        value={searchkey}
        onChange={handleSearch}
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
              { key: "action", label: "Action" },
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
                <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                aria-haspopup="true"
                                size="icon"
                                variant="ghost"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Toggle menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem>Edit</DropdownMenuItem>
                              <DropdownMenuItem>Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
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