import React from 'react';
import { useTranslation } from 'next-i18next';
import Card from '@/components/common/card';
import Description from '@/components/ui/description';
import Label from '@/components/ui/label';

interface ProductImageUploadProps {
  fileInputRef: React.RefObject<HTMLInputElement>;
  selectedFile: FileList | null;
  previewUrl: string | null;
  fileError: string;
  isUploadingFile: boolean;
  hasNewImage: boolean;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isEdit?: boolean;
  isRequired?: boolean;
}

export const ProductImageUpload: React.FC<ProductImageUploadProps> = ({
  fileInputRef,
  selectedFile,
  previewUrl,
  fileError,
  isUploadingFile,
  hasNewImage,
  onFileChange,
  isEdit = false,
  isRequired = true
}) => {
  const { t } = useTranslation();

  return (
    <div className="my-5 flex flex-wrap sm:my-8">
      <Description
        title={t(isEdit ? 'Update Product Image' : 'Upload Product Image')}
        details={t(isEdit 
          ? 'Upload a new image to replace the current one (JPG, PNG, WebP - Max 5MB)'
          : 'Please upload a product image (JPG, PNG, WebP - Max 5MB)'
        )}
        className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
      />

      <Card className="w-full sm:w-8/12 md:w-2/3">
        <div className="space-y-4">
          <Label>{t('Product Image')} {isRequired && !isEdit && '*'}</Label>
          
          <div className="relative">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={onFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 border border-gray-300 rounded-lg cursor-pointer"
              disabled={isUploadingFile}
            />
            {isUploadingFile && (
              <div className="absolute inset-0 bg-gray-100 bg-opacity-50 flex items-center justify-center rounded-lg">
                <span className="text-sm text-gray-600">Uploading...</span>
              </div>
            )}
          </div>
          
          {fileError && (
            <p className="text-sm text-red-600 mt-1">{fileError}</p>
          )}
          
          {selectedFile && !fileError && (
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
              <p><strong>{isEdit ? 'New Image:' : 'Selected:'}</strong> {selectedFile[0].name}</p>
              <p><strong>Size:</strong> {(selectedFile[0].size / 1024 / 1024).toFixed(2)} MB</p>
              <p><strong>Type:</strong> {selectedFile[0].type}</p>
              {isUploadingFile && <p className="text-blue-600"><strong>Status:</strong> Uploading...</p>}
              {!isUploadingFile && <p className="text-green-600"><strong>Status:</strong> Upload complete</p>}
            </div>
          )}
          
          {previewUrl && !fileError && (
            <div className="mt-4">
              <Label>{hasNewImage ? 'New Image Preview:' : isEdit ? 'Current Image:' : 'Preview:'}</Label>
              <div className="mt-2 border border-gray-200 rounded-lg p-4 bg-gray-50">
                <img 
                  src={previewUrl} 
                  alt="Product preview" 
                  className="max-w-full max-h-64 object-contain mx-auto"
                />
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
