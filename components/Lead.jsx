"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from 'react';
import { Textarea } from "./ui/textarea";

export default function Lead() {
  const [leadDetails, setLeadDetails] = useState({ phone: '', name: '', address: '' });
  const [remarks, setRemarks] = useState([{ reason: '' }]);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ leadDetails, remarks });
  };

  return (
    <Dialog >
      <DialogTrigger asChild>
        <Button variant="outline">Card details</Button>
      </DialogTrigger>
      <DialogContent>
        <div className="flex flex-col gap-2">
          <DialogHeader>
            <DialogTitle className="text-left">Customer Details</DialogTitle>
          </DialogHeader>
        </div>
        <form className="space-y-5">
          <div className="space-y-4">
            {[{ label: 'Phone', name: 'phone' }, { label: 'Name', name: 'name' }, { label: 'Address', name: 'address' }].map(({ label, name }) => (
                <div key={label} className="*:not-first:mt-2">
                  <Label htmlFor={name}>{label}</Label>
                {name!=="address"?<Input id={name}
                    name={name}
                    value={leadDetails[name]}
                    onChange={handleLeadChange}
                    type="text" required />:
                  <Textarea id={name}
                    name={name}
                    value={leadDetails[name]}
                    onChange={handleLeadChange}
                    placeholder="Type your address here." />}
                </div>
            ))}
            <div className="*:not-first:mt-2">
              <Label>Remarks</Label>
              {remarks.map((remark, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    type="text"
                    value={remark.reason}
                    onChange={(e) => handleRemarkChange(index, e.target.value)}
                    required
                  />
                </div>
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

          <Button onClick={handleSubmit} type="button" className="w-full">
            Save
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
