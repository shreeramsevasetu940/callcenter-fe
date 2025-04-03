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
import { PlusCircle, StepBack, StepForward } from "lucide-react";
import { integrateGetApi } from "@/utils/api";
import { useSession } from "next-auth/react";
import Order from "@/components/Order";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { showToast } from "@/components/ToastComponent";
import axios from "axios";
import DateRange from "@/components/DateRange";
export default function OrderList() {
  const [dateRange, setDateRange] = useState({ from: undefined, to: undefined });
  const [activeTab, setActiveTab] = useState('All');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [searchkey, setSearchkey] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [allProducts, setAllProducts] = useState(null);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const { data: session } = useSession();
  const authToken = session?.user?.token
  const url =
    process.env.NEXT_PUBLIC_BASEURL +
    'order/staff?page=' +
    currentPage +
    '&limit=25' +
    '&search=' +
    searchkey +
    '&status=' +
    activeTab

  const refechData = () => {
    const url =
      process.env.NEXT_PUBLIC_BASEURL +
      'order/staff?page=1&limit=25&search=' +
      searchkey +
      '&status=' +
      activeTab
    setData([]);
    integrateGetApi(url, setData, authToken);
  }

  useEffect(() => {
    if (authToken) {
      const url = process.env.NEXT_PUBLIC_BASEURL +
        'product?limit=999999'
      integrateGetApi(url, setAllProducts, authToken)
    }
  }, [authToken])

  useEffect(() => {
    const handler = setTimeout(() => {
      if (authToken) {
        setData([]);
        integrateGetApi(url, setData, authToken);
      } else {
        console.log(session, 'No auth token');
      }
    }, searchkey ? 2000 : 0); // 2 seconds debounce only for `searchkey`
    return () => clearTimeout(handler); // Clear timeout on dependency change
  }, [authToken, searchkey, currentPage, activeTab]);
  const handleSearch = (e) => {
    setCurrentPage(1);
    setSearchkey(e.target.value)
  }

  const handleSelectOrder = (orderId) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleSelectAll = () => {
    if (selectedOrders.length === data?.orderList?.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(data?.orderList?.map((item) => item._id) || []);
    }
  };

  const bulkUpdateOrderStatus = async (status) => {
    setLoading(true);
    try {
      const payload = {
        orderIds: selectedOrders,
        newStatus: status
      };

      const response = await axios.put(process.env.NEXT_PUBLIC_BASEURL + 'order/bulk-update-status', payload, {
          headers: { "auth-token": authToken, 'Content-Type': 'application/json' },
        });
      if (response.status === 200 || response.status === 201) {
        refechData();
        showToast.success('order status change successfully');
      } else {
        showToast.error('Failed to submit data:', response.statusText);
      }
    } catch (error) {
      showToast.error('Failed to submit data');
    } finally {
      setSelectedOrders([]);
      setLoading(false);
    }
  };



  const totalPages = data?.totalPages ?? 0;
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <div className="flex justify-between items-center">
        <TabsList className={'m-2'}>
          <TabsTrigger className={'cursor-pointer'} value="All">All</TabsTrigger>
          <TabsTrigger className={'cursor-pointer'} value="Pending">Pending</TabsTrigger>
          <TabsTrigger className={'cursor-pointer'} value="Dispatch">Dispatch</TabsTrigger>
          <TabsTrigger className={'cursor-pointer'} value="Delivered">Delivered</TabsTrigger>
          <TabsTrigger className={'cursor-pointer'} value="Cancelled">Cancelled</TabsTrigger>
          <TabsTrigger className={'cursor-pointer'} value="RTO">RTO</TabsTrigger>
        </TabsList>
      </div>
      <div className="space-y-4 p-4">
        <div className="flex justify-between space-x-2 items-center">
        <div className="md:flex max-sm:space-y-2 md:space-x-2">
        <DateRange dateRange={dateRange} setDateRange={setDateRange}/>
          <Input
            type="text"
            placeholder="Search Orders..."
            value={searchkey}
            onChange={handleSearch}
            className="w-60 md:w-96"
          />
          </div>
          <div className="space-x-2 flex">

          {activeTab=="Pending" &&<Button size="sm" className="h-7 gap-1 cursor-pointer" disabled={!selectedOrders?.length || loading} onClick={() => bulkUpdateOrderStatus('Dispatch')}>Dispatch</Button>}
          {activeTab=="Pending" && <Button size="sm" className="h-7 gap-1 cursor-pointer" disabled={!selectedOrders?.length || loading} onClick={() => bulkUpdateOrderStatus('Cancelled')}>Cancelled</Button>}
            <Order allProducts={allProducts} refechData={refechData} Children={<Button size="sm" className="h-7 gap-1 cursor-pointer">
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Add Orders
              </span>
            </Button>} />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              {activeTab=="Pending"&&<TableHead>
                <Checkbox
                  checked={selectedOrders.length === data?.orderList?.length && data?.orderList?.length > 0}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>}
              {[
                { key: "name", label: "Name" },
                { key: "phone", label: "Phone" },
                { key: "amount", label: "Amount" },
                { key: "status", label: "Status" },
                { key: "deliveryPartner", label: "DeliveryPartner" },
                { key: "action", label: "Action" },
              ].map((column) => (
                <TableHead key={column.key}>
                  {column.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.orderList?.length > 0 ? (
              data?.orderList?.map((item) => (
                <TableRow key={item._id}>
                {activeTab=="Pending"&&<TableCell>
                    <Checkbox
                      checked={selectedOrders.includes(item?._id)}
                      onCheckedChange={() => handleSelectOrder(item?._id)}
                    />
                  </TableCell>}
                  <TableCell>{item?.name}</TableCell>
                  <TableCell>{item?.phone}</TableCell>
                  <TableCell>{item?.price}</TableCell>
                  <TableCell><Badge>{item?.orderStatus}</Badge></TableCell>
                  <TableCell>{item?.deliveryPartner}</TableCell>
                  <TableCell><Order allProducts={allProducts} refechData={refechData} item={item} Children={<Button variant={'outline'}>Edit</Button>} /></TableCell>
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
        {data?.orderList?.length > 0 ? <div className="flex justify-between p-2 items-center">
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
    </Tabs>
  );
}