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
import moment from "moment";

export default function Lead({ Children, item = null, refechData = () => { } }) {
  const [loading, setLoading] = useState(false);
  const dialogCloseRef = useRef(null);
  const [leadDetails, setLeadDetails] = useState({ phone: '', name: ''});
  const [remarks, setRemarks] = useState([{ reason: '' }]);
  const { data: session } = useSession();
  const authToken = session?.user?.token
  useEffect(() => {
    if (item) {
      setLeadDetails({
        phone: item?.phone,
        name: item?.name,
      })
      setRemarks(item?.remark ?? [{ reason: '' }])
    }
  }, [item])


  const handleClear = () => {
    if (item) {
      setLeadDetails({
        phone: item?.phone,
        name: item?.name,
      })
      setRemarks(item?.remark ?? [{ reason: '' }])
    }
    else {
      setLeadDetails({ phone: '', name: ''});
      setRemarks([{ reason: '' }])
    }
  }

  const handleLeadChange = (e) => {
    const { name, value } = e.target;
    setLeadDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddRemark = () => {
    setRemarks([...remarks, { reason: '' }]);
  };

  const handleRemarkChange = (index, value) => {
    const updatedRemarks = [...remarks];
    updatedRemarks[index].reason = value;
    setRemarks(updatedRemarks);
  };

  const isAddRemarkDisabled = remarks.some((remark) => !remark.reason.trim());
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading
    try {
      const payload = { ...leadDetails, remark: remarks?.filter(obj => obj.reason?.trim()) };
      let response;
      if (item) {
        response = await axios.put(process.env.NEXT_PUBLIC_BASEURL + 'lead/' + item?._id, payload, {
          headers: {
            "auth-token": authToken,
            'Content-Type': 'application/json',
          },
        });
      }
      else {
        response = await axios.post(process.env.NEXT_PUBLIC_BASEURL + 'lead', payload, {
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

  return (
    <Dialog
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          handleClear(); // Dialog close hone par clear function ko call karega
        }
      }}>
      <DialogTrigger asChild>
        {Children}
      </DialogTrigger>
      <DialogContent>
        <div className="flex flex-col gap-2">
          <DialogHeader>
            <DialogTitle className="text-left">Customer Details</DialogTitle>
          </DialogHeader>
        </div>
        <form className="space-y-5">
          <div className="space-y-4">
            {[{ label: 'Phone', name: 'phone' }, { label: 'Name', name: 'name' }].map(({ label, name }) => (
              <div key={label} className="*:not-first:mt-2">
                <Label htmlFor={name}>{label}</Label>
                <Input id={name}
                  name={name}
                  value={leadDetails[name]}
                  onChange={handleLeadChange}
                  type="text" required />
              </div>
            ))}
            <div className="*:not-first:mt-2">
              <Label>Remarks</Label>
              {remarks.map((remark, index) => (
                <>
                  <div
                    key={index}
                    className={`flex items-center gap-2`}
                  >
                    <div
                      className={`p-2 rounded-lg shadow-md w-full text-sm ${remark?.date && 'bg-gray-200'} text-black`}
                    >
                      <Input
                        type="text"
                        value={remark.reason}
                        disabled={remark.date}
                        onChange={(e) => handleRemarkChange(index, e.target.value)}
                        required
                        className="bg-transparent border-none outline-none w-full"
                      />
                      <hr />
                      <span
                        className={`block text-xs mt-1 text-right text-black/50`}
                      >
                        {moment(remark?.date).format('lll')}
                      </span>
                    </div>
                  </div>
                </>
              ))}
              <Button
                type="button"
                className="mx-auto "
                onClick={handleAddRemark}
                disabled={isAddRemarkDisabled}
              >
                Add Remark
              </Button>
            </div>
          </div>
          <Button
            type="submit"
            className={'cursor-pointer w-full'}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <div className=" h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
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
