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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { integrateGetApi } from "@/utils/api";

export default function Order({ Children, item = null, refechData = () => { } }) {
  const [loading, setLoading] = useState(false);
  const dialogCloseRef = useRef(null);
  const [orderDetails, setOrderDetails] = useState({ phone: '', name: '', address: '', price: '' });
  const [products, setProducts] = useState([{ name: '', id: '', qty: 1 }]);
  const [deliveryPartner, setDeliveryPartner] = useState('');
  const [step, setStep] = useState(1);
  const [allProducts, setAllProducts] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: session } = useSession();
  const authToken = session?.user?.token;

useEffect(() => {
  if (authToken) { 
    const url= process.env.NEXT_PUBLIC_BASEURL +
    'product?limit=999999'
    integrateGetApi(url,setAllProducts,authToken)
  }
}, [authToken])


  useEffect(() => {
    if (item) {
      setOrderDetails({
        phone: item?.phone,
        name: item?.name,
        address: item?.address,
        price: item?.price || ''
      });
      setProducts(item?.products ?? [{ name: '', id: '', qty: 1 }]);
      setDeliveryPartner(item?.deliveryPartner || '');
    }
  }, [item]);

  useEffect(() => {
    console.log(allProducts,'allProducts')

  }, [allProducts])
  
  const filteredProducts = allProducts?.productList?.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  )
  // .slice(0, 5);


  const handleClear = () => {
    setOrderDetails({ phone: '', name: '', address: '', price: '' });
    setProducts([{ name: '', id: '', qty: 1 }]);
    setDeliveryPartner('');
  };

  const handleOrderChange = (e) => {
    const { name, value } = e.target;
    setOrderDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleProductChange = (index, field, value) => {
    const updatedProducts = [...products];
    updatedProducts[index][field] = value;
    setProducts(updatedProducts);
  };

  const handleAddProduct = () => {
    setProducts([...products, { name: '', id: '', qty: 1 }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...orderDetails,
        products,
        deliveryPartner
      };

      let response;
      if (item) {
        response = await axios.put(process.env.NEXT_PUBLIC_BASEURL + 'order/' + item?._id, payload, {
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
      } else {
        showToast.error('Failed to submit data:', response.statusText);
      }
    } catch (error) {
      showToast.error('Failed to submit data');
    } finally {
      dialogCloseRef.current?.click();
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
        <form className="space-y-5">
        {step==1? <div className="space-y-4">
      {/* Products Section */}
<div className="flex flex-col gap-1">
  {products.map((product, index) => (
    <div key={index} className="flex flex-col border-2 rounded-lg p-1">
    <div className="flex space-x-2">
    <Select
        value={product?.name}
        onValueChange={(value) => handleProductChange(index, 'name', value)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Name" />
        </SelectTrigger>
        <SelectContent>
          {filteredProducts?.map((product, idx) => (
            <SelectItem key={idx} value={product?.name}>
              {product?.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button variant={'destructive'}>Remove</Button>
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

  <Button type="button" onClick={handleAddProduct} className="mt-2">
    Add Product
  </Button>
</div>

          </div>:step==2?<div className="space-y-4">
            {[
              { label: 'Phone', name: 'phone', type: 'tel' },
              { label: 'Name', name: 'name', type: 'text' },
              { label: 'Price', name: 'price', type: 'number' },
              { label: 'Address', name: 'address', type: 'textarea' }
            ].map(({ label, name, type }) => (
              <div key={label} className="*:not-first:mt-2">
                <Label htmlFor={name}>{label}</Label>
                {type === "textarea" ? (
                  <Textarea id={name} name={name} value={orderDetails[name]} onChange={handleOrderChange} />
                ) : (
                  <Input id={name} name={name} value={orderDetails[name]} onChange={handleOrderChange} type={type} required />
                )}
              </div>
            ))}
            {/* Delivery Partner */}
            <div>
              <Label>Delivery Partner</Label>
              <Select
  value={deliveryPartner}
  onChange={(e) => setDeliveryPartner(e.target.value)}
>
  <SelectTrigger className="w-full">
    <SelectValue placeholder="Select Partner" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="DHL">DHL</SelectItem>
    <SelectItem value="FedEx">FedEx</SelectItem>
    <SelectItem value="UPS">UPS</SelectItem>
  </SelectContent>
</Select>
            </div>
          </div>:''}

        {step==1? <Button className="cursor-pointer w-full" onClick={()=>setStep(2)}>
              Next
          </Button>:step==2?
          <div className="flex space-x-2"> <Button className="cursor-pointer w-full" onClick={()=>setStep(1)} >
          Back
          </Button>
          <Button type="submit" className="cursor-pointer w-full" onClick={handleSubmit} disabled={loading}>
            {loading ? (
              <div className="h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              item ? "Update" : "Save"
            )}
          </Button>
          </div>:""}
        </form>
        <DialogClose ref={dialogCloseRef} />
      </DialogContent>
    </Dialog>
  );
}
