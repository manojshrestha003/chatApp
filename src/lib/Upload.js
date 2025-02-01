const CLOUDINARY_URL = "cloudinary://532734332778875:MORP7mnER5yFMNBH5PbpaffVE88@dtzkakmru";  // Corrected URL
const CLOUDINARY_UPLOAD_PRESET = "ml_default";  // Replace with your actual preset name

const upload = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

  const response = await fetch(CLOUDINARY_URL, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) throw new Error("Upload failed");

  const data = await response.json();
  return data.secure_url; // Get direct image URL
};

export default upload;
