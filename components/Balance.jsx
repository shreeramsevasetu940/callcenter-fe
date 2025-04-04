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
import { useSession } from "next-auth/react";
import axios from "axios";
import { showToast } from "./ToastComponent";

export default function Balance({ Children, item = null, refechData = () => { } }) {
  const [loading, setLoading] = useState(false);
  const dialogCloseRef = useRef(null);
  const [balanceDetails, setBalanceDetails] = useState({ amount:0 });
  const { data: session } = useSession();
  const authToken = session?.user?.token
  useEffect(() => {
    if (item) {
      setBalanceDetails({
        amount: item?.amount
      })
    }
  }, [item])

  const handleClear=()=>{
    if (item) {
      setBalanceDetails({
        amount: item?.amount
      })
    }
    else{ 
      setBalanceDetails({amount:0 });
    }
  } 

  const handleBalanceChange = (e) => {
    const { name, value } = e.target;
    setBalanceDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading
    try {
      const payload = balanceDetails
      let response;
      if (item) {
        response = await axios.put(process.env.NEXT_PUBLIC_BASEURL + 'balance/' + item?._id, payload, {
          headers: {
            "auth-token": authToken,
            'Content-Type': 'application/json',
          },
        });
      }
      else {
        response = await axios.post(process.env.NEXT_PUBLIC_BASEURL + 'balance', payload, {
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
            <DialogTitle className="text-left">Balance Details</DialogTitle>
          </DialogHeader>
        </div>
        <form className="space-y-5">
          <div className="space-y-4">
            {[ { label: 'Amount', name: 'amount' }].map(({ label, name }) => (
              <div key={label} className="*:not-first:mt-2">
                <Label htmlFor={name}>{label}</Label>
                <Input id={name}
                  name={name}
                  value={balanceDetails[name]}
                  onChange={handleBalanceChange}
                  type={'number'} required />
              </div>
            ))}
          </div>
          <Button
            type="submit"
            className={'cursor-pointer w-full'}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <div className=" h-5 bbalance-2 bbalance-white bbalance-t-transparent rounded-full animate-spin"></div>
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
