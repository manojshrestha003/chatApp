const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dtzkakmru/image/upload";

const CLOUDINARY_UPLOAD_PRESET = "ml_default"; 

const upload = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    const response = await fetch(CLOUDINARY_URL, {
      method: "POST",
      body: formData
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Cloudinary upload error:", data);
      throw new Error("Upload failed: " + data.error?.message);
    }

    return data.secure_url;
  } catch (error) {
    console.error("Upload function error:", error);
    throw error;
  }
};

export default upload;
