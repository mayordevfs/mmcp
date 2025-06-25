// hooks/useFileUpload.ts
import { useState, useRef, useEffect } from 'react';
import { uploadClient } from '@/data/client/upload';
import { toast } from 'react-toastify';

export const useFileUpload = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<FileList | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string>('');
  const [fileUrl, setFileUrl] = useState('');
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [hasNewImage, setHasNewImage] = useState(false);

  const fileArray = Array.from(selectedFile as FileList || []);

  // Auto-upload when file is selected
  useEffect(() => {
    if (!selectedFile?.length) {
      return;
    }
    
    setIsUploadingFile(true);
    setHasNewImage(true);
    
    uploadClient.upload(fileArray)
    .then((res: any) => {
      const filename = res?.data?.refNo;
      setFileUrl(filename);
      toast.success("Image uploaded successfully");
    })
    .catch((err) => {
      console.error('Upload error:', err);
      toast.error("File upload failed!");
      setFileUrl('');
      setHasNewImage(false);
    })
    .finally(() => {
      setIsUploadingFile(false);
    });
  }, [selectedFile]);

  console.log(fileUrl);
  

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    originalImageUrl?: string
  ) => {
    const file = event.target.files;
    setFileError('');
    
    if (!file || file.length === 0) {
      setSelectedFile(null);
      setFileUrl('');
      setHasNewImage(false);
      
      // Revert to original image if available
      if (originalImageUrl) {
        setPreviewUrl(originalImageUrl);
      } else {
        setPreviewUrl(null);
      }
      return;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file[0].type)) {
      setFileError('Only JPG, PNG, and WebP files are allowed');
      resetFileInput(originalImageUrl);
      return;
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024;
    if (file[0].size > maxSize) {
      setFileError('File size must be less than 5MB');
      resetFileInput(originalImageUrl);
      return;
    }

    setSelectedFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file[0]);
  };

  const resetFileInput = (originalImageUrl?: string) => {
    setSelectedFile(null);
    setFileUrl('');
    setHasNewImage(false);
    
    if (originalImageUrl) {
      setPreviewUrl(originalImageUrl);
    } else {
      setPreviewUrl(null);
    }
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const setInitialImage = (imageUrl: string) => {
    setPreviewUrl(imageUrl);
    setSelectedFile(null);
    setFileUrl('');
    setHasNewImage(false);
    setFileError('');
    setIsUploadingFile(false);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return {
    fileInputRef,
    selectedFile,
    previewUrl,
    fileError,
    fileUrl,
    isUploadingFile,
    hasNewImage,
    handleFileChange,
    resetFileInput,
    setInitialImage
  };
};
