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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { integrateGetApi } from "@/utils/api";
import Address from "./Address";
import moment from "moment/moment";

export default function Order({ Children, allProducts = {}, item = null, refechData = () => { } }) {
  const [loading, setLoading] = useState(false);
  const dialogCloseRef = useRef(null);
  const [orderDetails, setOrderDetails] = useState({ phone: '', name: '', address: '', price: ''});
  const [products, setProducts] = useState([{ name: '', id: '', qty: 1 }]);
  const [step, setStep] = useState(1);
  const [addresses, setAddresses] = useState(null);
  const [changeAddress, setChangeAddress] = useState(false);
  const { data: session } = useSession();

  const authToken = session?.user?.token;
  useEffect(() => {
    if (orderDetails?.phone?.length == 10 && step == 3) {
      const url = process.env.NEXT_PUBLIC_BASEURL +
        'address?limit=999999&search=' + orderDetails?.phone
      integrateGetApi(url, setAddresses, authToken)
    }
  }, [orderDetails?.phone, step])

  const refechAddresses = () => {
    if (orderDetails?.phone?.length == 10 && step == 3) {
      const url = process.env.NEXT_PUBLIC_BASEURL +
        'address?limit=999999&search=' + orderDetails?.phone
      integrateGetApi(url, setAddresses, authToken)
    }
  }

  useEffect(() => {
    if (item) {
      setOrderDetails({
        phone: item?.phone,
        name: item?.name,
        address: item?.address,
        price: item?.price || '',
      });
      setProducts(item?.products ?? [{ name: '', id: '', price: 0, qty: 1 }]);
    }
  }, [item]);

  const handleClear = () => {
    setStep(1);
    setAddresses(null);
    if (item) {
      setOrderDetails({
        phone: item?.phone,
        name: item?.name,
        address: item?.address,
        price: item?.price || '',
      });
      setProducts(item?.products ?? [{ name: '', id: '', price: 0, qty: 1 }]);
    }
    else {
      setOrderDetails({ phone: '', name: '', address: '', price: ''});
      setProducts([{ name: '', id: '', price: 0, qty: 1 }]);
    }
  };

  const handleOrderChange = (e) => {
    const { name, value } = e.target;
    setOrderDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleProductChange = (index, field, value) => {
    const updatedProducts = [...products];
    updatedProducts[index][field] = value;
    if (field == "price" || field == "qty") {
      setOrderDetails((prev) => ({
        ...prev,
        price: products.reduce(
          (acc, product) =>
            acc + Number(product.price || 0) * Number(product.qty || 1),
          0
        ),
      }));
    }
    setProducts(updatedProducts);
  };

  const handleAddProduct = () => {
    setProducts([...products, { name: '', id: '', qty: 1 }]);
  };

  const handleRemoveProduct = (index) => {
    const updatedProducts = products.filter((_, idx) => idx !== index);
    setProducts(updatedProducts);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...orderDetails,
        products
      };

      let response;
      if (item) {
        response = await axios.put(process.env.NEXT_PUBLIC_BASEURL + 'order/update/' + item?._id, payload, {
          headers: { "auth-token": authToken, 'Content-Type': 'application/json' },
        });
      } else {
        response = await axios.post(process.env.NEXT_PUBLIC_BASEURL + 'order', payload, {
          headers: { "auth-token": authToken, 'Content-Type': 'application/json' },
        });
      }

      if (response.status === 200 || response.status === 201) {
        refechData();
        handleClear();
        showToast.success('Data submitted successfully');
        dialogCloseRef.current?.click();
      } else {
        showToast.error('Failed to submit data:', response.statusText);
      }
    } catch (error) {
      showToast.error('Failed to submit data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog onOpenChange={(isOpen) => !isOpen && handleClear()}>
      <DialogTrigger asChild>
        {Children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-left">Order Details</DialogTitle>
        </DialogHeader>
        {step == 1 ? <div className="space-y-4">
          {/* Products Section */}
          <div className="flex flex-col gap-1">
            {products?.map((product, index) => (
              <div key={index} className="flex flex-col border-2 rounded-lg p-1">
                <div className={`flex ${products?.length != 1 && 'space-x-2'}`}>
                  <Select
                    value={product?.name}
                    onValueChange={(value) => {
                      const selectedProduct = allProducts?.productList?.find((p) => p.name === value);
                      handleProductChange(index, 'name', value);
                      handleProductChange(index, 'id', selectedProduct?._id);
                      handleProductChange(index, 'price', selectedProduct?.price || 0);
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Name" />
                    </SelectTrigger>
                    <SelectContent>
                      {allProducts?.productList?.map((product, idx) => (
                        <SelectItem key={idx} value={product?.name}>
                          {product?.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {products?.length != 1 && <Button variant={'destructive'} onClick={() => handleRemoveProduct(index)}>Remove</Button>}
                </div>

                <div className="flex gap-2">
                  <div className="flex-1">
                    <Label htmlFor={`price-${index}`}>Price</Label>
                    <Input
                      id={`price-${index}`}
                      placeholder="Price"
                      type="number"
                      value={product.price ?? 0}
                      onChange={(e) => handleProductChange(index, 'price', e.target.value)}
                    />
                  </div>

                  <div className="flex-1">
                    <Label htmlFor={`qty-${index}`}>Qty</Label>
                    <Input
                      id={`qty-${index}`}
                      placeholder="Qty"
                      type="number"
                      value={product.qty ?? 1}
                      onChange={(e) => handleProductChange(index, 'qty', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}

            <div className="*:not-first:mt-2">
              <Label htmlFor={'price'}>Price</Label>
              <Input id={"price"} name={"price"} value={orderDetails["price"] ?? products?.reduce((acc, product) => acc + (Number(product.price || 0) * Number(product.qty || 1)), 0)} onChange={handleOrderChange} type={'number'} required />
            </div>

          </div>

        </div> : step == 2 ? <div className="space-y-4">
          {
            [
              { label: 'Phone', name: 'phone', type: 'tel' },
              { label: 'Name', name: 'name', type: 'text' },
            ]?.map(({ label, name, type }) => (
              <div key={label} className="*:not-first:mt-2">
                <Label htmlFor={name}>{label}</Label>
                <Input id={name} name={name} value={orderDetails[name]} onChange={handleOrderChange} type={type} required />
              </div>
            ))
          }
        </div> : step == 3 ?
          <div className="space-y-4">
            <div className="*:not-first:mt-2">
              <Label htmlFor={"address"}>Address</Label>
              {orderDetails?.phone == item?.phone && (!changeAddress && item) && <Input disabled value={orderDetails?.address?.address} />}
              {orderDetails?.phone == item?.phone && (!changeAddress && item) && <Button onClick={() => setChangeAddress(true)}>Change</Button>}
              {(changeAddress || !item || orderDetails?.phone !== item?.phone) &&
                <div>
                  {addresses?.addressList?.length > 0 ?
                    <Select
                      value={orderDetails?.address || ''}
                      onValueChange={(value) => {
                        setOrderDetails((prev) => ({ ...prev, address: value }));
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Address" />
                      </SelectTrigger>
                      <SelectContent>
                        {addresses?.addressList?.map((address, idx) => (
                          <SelectItem key={idx} value={address?._id || ''}>
                            {address?.address || 'Unknown Address'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    :
                    <div className="flex items-center justify-center">
                      <div className="mx-auto my-2 p-2 text-center">
                        <p className="text-gray-500">No address found</p>
                        <Address refechData={refechAddresses} Children={<Button>Add</Button>} phone={orderDetails?.phone} />
                      </div>
                    </div>
                  }
                </div>}
            </div>
          </div>
          : ''}

        {step == 1 ? (
          <div className="flex space-x-2 mt-2">
            <Button
              type="button"
              className="cursor-pointer w-full"
              disabled={loading || !products.length || products.some((product) => !product.name?.trim())}
              onClick={handleAddProduct}
            >
              Add Product
            </Button>
            <Button
              type="button"
              className="cursor-pointer w-full"
              disabled={loading || !products.length || products.some((product) => !product.name?.trim())}
              onClick={() => setStep(2)}
            >
              Next
            </Button>
          </div>
        ) : step == 2 ? (
          <div className="flex space-x-2">
            <Button
              type="button"
              className="cursor-pointer w-full"
              onClick={() => setStep(1)}
            >
              Back
            </Button>
            <Button
              type="button"
              className="cursor-pointer w-full"
              disabled={loading || !orderDetails?.name || !orderDetails?.phone}
              onClick={() => setStep(3)}
            >
              Next
            </Button>
          </div>
        ) : step == 3 ? (
          <div className="flex space-x-2">
            <Button
              type="button"
              className="cursor-pointer w-full"
              onClick={() => setStep(2)}
            >
              Back
            </Button>
            <Button
              className="cursor-pointer w-full"
              onClick={(e) => handleSubmit(e)}
              disabled={loading}
            >
              {loading ? (
                <div className="flex justify-center items-center w-full">
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                item ? "Update" : "Save"
              )}
            </Button>
          </div>
        ) : ""}

        <DialogClose ref={dialogCloseRef} />
      </DialogContent>
    </Dialog>
  );
}
