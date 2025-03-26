"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useRef, useState } from 'react';
import { Textarea } from "./ui/textarea";
import { useSession } from "next-auth/react";
import axios from "axios";
import { showToast } from "./ToastComponent";
import { integrateGetApi } from "@/utils/api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
const PostOfficeTable = ({ data, selectedData, setSelectedData }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSelect = (item) => {
    setSelectedData((prevDetails) => ({
      ...prevDetails, // Existing fields ko preserve karna
      pincode: item?.Pincode || prevDetails?.pincode,
      village: item?.Name || prevDetails?.village,
      district: item?.District || prevDetails?.district,
      taluka: item?.Block || prevDetails?.taluka,
      state: item?.State || prevDetails?.state,
    }));
    setIsDialogOpen(false);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setIsDialogOpen(true)}>View / Edit Address</Button>
      </DialogTrigger>

      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Post Office Details</DialogTitle>
        </DialogHeader>

        <RadioGroup
          value={selectedData?.Name || selectedData?.name || ""}
          onValueChange={(value) => {
            const selectedItem = data.find((item) => item.Name === value);
            handleSelect(selectedItem);
          }}
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Select</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Block</TableHead>
                <TableHead>District</TableHead>
                <TableHead>State</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <RadioGroupItem value={item.Name} />
                  </TableCell>
                  <TableCell>{item.Name}</TableCell>
                  <TableCell>{item.Block}</TableCell>
                  <TableCell>{item.District}</TableCell>
                  <TableCell>{item.State}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </RadioGroup>
      </DialogContent>
    </Dialog>
  );
};


export default function Address({ Children, item = null, refechData = () => { } }) {
  const [loading, setLoading] = useState(false);
  const dialogCloseRef = useRef(null);
  const [indianPostDetails, setIndianPostDetails] = useState(null);
  const [addressDetails, setAddressDetails] = useState({ pincode: '', village: '', district: '', taluka: '', state: '', phone: '', landmark: '', address: '' });
  const { data: session } = useSession();
  const authToken = session?.user?.token
  useEffect(() => {
    if (item) {
      setAddressDetails({
        pincode: item?.pincode, village: item?.village, district: item?.district, taluka: item?.taluka, state: item?.state, phone: item?.phone, landmark: item?.landmark, address: item?.address
      })
    }
  }, [item])


  const handleClear = () => {
    if (item) {
      setAddressDetails({
        pincode: item?.pincode, village: item?.village, district: item?.district, taluka: item?.taluka, state: item?.state, phone: item?.phone, landmark: item?.landmark, address: item?.address
      })
    }
    else {
      setAddressDetails({ pincode: '', village: '', district: '', taluka: '', state: '', phone: '', landmark: '', address: '' });
    }
  }

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddressDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading
    try {
      const payload = {...addressDetails};
      let response;
      if (item) {
        response = await axios.put(process.env.NEXT_PUBLIC_BASEURL + 'address/' + item?._id, payload, {
          headers: {
            "auth-token": authToken,
            'Content-Type': 'application/json',
          },
        });
      }
      else {
        response = await axios.post(process.env.NEXT_PUBLIC_BASEURL + 'address', payload, {
          headers: {
            "auth-token": authToken,
            'Content-Type': 'application/json',
          },
        });
      }

      if (response.status === 200 || response.status === 201) {
        refechData();
        handleClear();
        showToast.success('Data submitted successfully');
        console.log('Data submitted successfully:', response.data);
      } else {
        showToast.error('Failed to submit data:', response.statusText);
        console.error('Failed to submit data:', response.statusText);
      }
    } catch (error) {
      showToast.error('Failed to submit data:');
      console.error('Error while submitting data:', error.message);
    } finally {
      dialogCloseRef.current?.click();
      setLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    if (addressDetails.pincode?.length === 6) {
      integrateGetApi(`https://api.postalpincode.in/pincode/${addressDetails.pincode}`, setIndianPostDetails)
    }
  }, [addressDetails?.pincode])

  const isSubmitDisabled = Object.values(addressDetails).some(value => !value.trim());

  return (
    <Dialog
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          handleClear();
        }
      }}>
      <DialogTrigger asChild>
        {Children}
      </DialogTrigger>
      <DialogContent>
        <div className="flex flex-col gap-2">
          <DialogHeader>
            <DialogTitle className="text-left">Address Details</DialogTitle>
          </DialogHeader>
        </div>
        <form className="space-y-5">
          <div className="flex flex-wrap">
            {[
              { label: 'Pincode', name: 'pincode', width: 'lg:w-1/2' },
              { label: 'Village', name: 'village', width: 'lg:w-1/2', disabled: true },
              { label: 'Taluka', name: 'taluka', width: 'lg:w-1/2', disabled: true },
              { label: 'District', name: 'district', width: 'lg:w-1/2', disabled: true },
              { label: 'State', name: 'state', width: 'lg:w-1/2', disabled: true }, // State with button
              { label: 'Phone', name: 'phone', width: 'w-full' },
              { label: 'Landmark', name: 'landmark', width: 'w-full' },
              { label: 'Address', name: 'address', width: 'w-full' }
            ].map(({ label, name, width, disabled = false }) => (
              <div key={label} className={`w-full ${width} px-2 flex items-center gap-2`}>
                <div className="flex-grow">
                  <Label htmlFor={name}>{label}</Label>
                  {name !== "address" ? (
                    <Input
                      id={name}
                      name={name}
                      value={addressDetails[name]}
                      onChange={handleAddressChange}
                      disabled={disabled}
                      type="text"
                      required
                    />
                  ) : (
                    <Textarea
                      id={name}
                      name={name}
                      value={addressDetails[name]}
                      onChange={handleAddressChange}
                      placeholder="Type your address here."
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
          <div>{indianPostDetails?.PostOffice?.length}</div>
          {indianPostDetails?.[0]?.PostOffice?.length && <PostOfficeTable selectedData={addressDetails} setSelectedData={setAddressDetails} data={indianPostDetails?.[0]?.PostOffice} />}
          <Button
            type="submit"
            className={'cursor-pointer w-full'}
            onClick={handleSubmit}
            disabled={loading||isSubmitDisabled}
          >
            {loading ? (
              <div className="h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              item ? "Update" : "Save"
            )}
          </Button>
        </form>
        <DialogClose ref={dialogCloseRef} />
      </DialogContent>
    </Dialog>

  );
}
