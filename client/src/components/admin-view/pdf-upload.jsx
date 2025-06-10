import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";

const PDFUpload = ({ onUploadSuccess }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
    } else {
      toast({
        title: "Invalid file type",
        description: "Please select a PDF file",
        variant: "destructive",
      });
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select a PDF file to upload",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("pdf", selectedFile);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/admin/products/upload-pdf",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        toast({
          title: "Success",
          description: "PDF uploaded successfully",
        });
        setSelectedFile(null);
        if (onUploadSuccess) {
          onUploadSuccess(response.data.pdfUrl);
        }
      }
    } catch (error) {
      toast({
        title: "Upload failed",
        description: error.response?.data?.message || "Error uploading PDF",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="pdf">Upload PDF</Label>
        <Input
          id="pdf"
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          disabled={uploading}
        />
      </div>
      <Button
        onClick={handleUpload}
        disabled={!selectedFile || uploading}
        className="w-full"
      >
        {uploading ? "Uploading..." : "Upload PDF"}
      </Button>
    </div>
  );
};

export default PDFUpload; 