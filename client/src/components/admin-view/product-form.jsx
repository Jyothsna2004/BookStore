import { useState, useRef } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

const initialFormData = {
  title: "",
  author: "",
  description: "",
  price: "",
  category: "",
  brand: "",
  salePrice: "",
  totalStock: "",
};

const ProductForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState(initialFormData);
  const [imageUrl, setImageUrl] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const inputRef = useRef(null);

  // Drag and drop handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await handleImageUpload(e.dataTransfer.files[0]);
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      await handleImageUpload(file);
    }
  };

  const handleImageUpload = async (file) => {
    if (file.type !== "image/jpeg") {
      toast({ title: "Please upload a JPEG image", variant: "destructive" });
      return;
    }
    const formData = new FormData();
    formData.append("my_file", file);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/admin/products/upload-image",
        formData
      );
      if (response.data.success) {
        setImageUrl(response.data.result.url);
        toast({ title: "Image uploaded successfully" });
      } else {
        toast({ title: "Image upload failed", variant: "destructive" });
      }
    } catch {
      toast({ title: "Image upload failed", variant: "destructive" });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!imageUrl) {
      toast({ title: "Please upload an image", variant: "destructive" });
      setLoading(false);
      return;
    }

    const payload = {
      ...formData,
      image: imageUrl,
      stock: formData.totalStock,
      price: Number(formData.price),
      salePrice: Number(formData.salePrice),
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/api/admin/products/add",
        payload
      );
      if (response.data.success) {
        toast({ title: "Product added successfully" });
        setFormData(initialFormData);
        setImageUrl("");
        if (onSuccess) onSuccess();
      } else {
        toast({ title: "Error", description: response.data.message, variant: "destructive" });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Error adding product",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 style={{color: "red"}}>TEST PRODUCT FORM</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-4 mb-4 text-center cursor-pointer ${dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"}`}
          onClick={() => inputRef.current.click()}
          style={{ minHeight: 120 }}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg"
            style={{ display: "none" }}
            onChange={handleImageChange}
          />
          {imageUrl ? (
            <img src={imageUrl} alt="Preview" style={{ maxWidth: 120, margin: "0 auto" }} />
          ) : (
            <span>
              Drag & drop a JPEG image here, or <span style={{ color: "#2563eb", textDecoration: "underline" }}>click to select</span>
            </span>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="author">Author</Label>
          <Input id="author" name="author" value={formData.author} onChange={handleChange} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Input id="description" name="description" value={formData.description} onChange={handleChange} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Input id="category" name="category" value={formData.category} onChange={handleChange} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="brand">Language</Label>
          <Input id="brand" name="brand" value={formData.brand} onChange={handleChange} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="price">Price</Label>
          <Input id="price" name="price" type="number" value={formData.price} onChange={handleChange} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="salePrice">Sale Price</Label>
          <Input id="salePrice" name="salePrice" type="number" value={formData.salePrice} onChange={handleChange} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="totalStock">Total Stock</Label>
          <Input id="totalStock" name="totalStock" type="number" value={formData.totalStock} onChange={handleChange} required />
        </div>
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Adding..." : "Add Product"}
        </Button>
      </form>
    </div>
  );
};
export default ProductForm;