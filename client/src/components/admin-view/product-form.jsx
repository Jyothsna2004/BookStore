import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import axios from "axios";
import PDFUpload from "./pdf-upload";

const ProductForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    description: "",
    price: "",
    imageUrl: "",
    pdfUrl: "",
    category: "",
    totalStock: "",
    isDigital: false,
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handlePDFUpload = (pdfUrl) => {
    setFormData((prev) => ({
      ...prev,
      pdfUrl,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/admin/products/add",
        formData
      );

      if (response.data.success) {
        toast({
          title: "Success",
          description: "Product added successfully",
        });
        setFormData({
          title: "",
          author: "",
          description: "",
          price: "",
          imageUrl: "",
          pdfUrl: "",
          category: "",
          totalStock: "",
          isDigital: false,
        });
        if (onSuccess) {
          onSuccess();
        }
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="author">Author</Label>
        <Input
          id="author"
          name="author"
          value={formData.author}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="price">Price</Label>
        <Input
          id="price"
          name="price"
          type="number"
          value={formData.price}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="imageUrl">Image URL</Label>
        <Input
          id="imageUrl"
          name="imageUrl"
          value={formData.imageUrl}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Input
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="totalStock">Total Stock</Label>
        <Input
          id="totalStock"
          name="totalStock"
          type="number"
          value={formData.totalStock}
          onChange={handleChange}
          required
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="isDigital"
          name="isDigital"
          checked={formData.isDigital}
          onCheckedChange={(checked) => 
            setFormData(prev => ({ ...prev, isDigital: checked }))
          }
        />
        <Label htmlFor="isDigital">This is a digital book</Label>
      </div>

      {formData.isDigital && (
        <div className="space-y-2">
          <Label>PDF Upload</Label>
          <PDFUpload onUploadSuccess={handlePDFUpload} />
          {formData.pdfUrl && (
            <p className="text-sm text-green-600">PDF uploaded successfully</p>
          )}
        </div>
      )}

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Adding..." : "Add Product"}
      </Button>
    </form>
  );
};

export default ProductForm; 