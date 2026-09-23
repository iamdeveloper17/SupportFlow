import { useState } from "react";
import toast from "react-hot-toast";
import api from "../../api/axios.js";

export default function FileUpload({ onUploaded }) {
  const [uploading, setUploading] = useState(false);

  const handleChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File too large (max 5MB)");
      return;
    }
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onUploaded?.(res.data.data);
      toast.success("Uploaded!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <label className="inline-block cursor-pointer text-sm text-primary-600 hover:underline">
      <input
        type="file"
        className="hidden"
        onChange={handleChange}
        disabled={uploading}
      />
      {uploading ? "Uploading..." : "📎 Attach file"}
    </label>
  );
}