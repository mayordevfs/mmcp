import { Upload, FileText, X } from 'lucide-react'
import Label from '@/components/ui/label'
import React from 'react'

interface FileUploadProps {
  id: string
  label: string
  uploadedFile: File | null
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  onRemoveFile: () => void
  required?: boolean
}

const FileUpload: React.FC<FileUploadProps> = ({
  id,
  label,
  uploadedFile,
  onFileChange,
  onRemoveFile,
  required = false
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-medium text-gray-700">
        {label} {required && '*'}
      </Label>
      <div className="relative">
        <input
          id={id}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
          onChange={onFileChange}
          className="hidden"
        />
        <label
          htmlFor={id}
          className="flex items-center justify-center w-full h-12 px-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-white hover:bg-gray-50 hover:border-green-400 transition-all duration-200"
        >
          {uploadedFile ? (
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-green-600" />
                <span className="text-sm text-gray-700 truncate">
                  {uploadedFile.name}
                </span>
              </div>
              <button
                type="button"
                onClick={onRemoveFile}
                className="p-1 hover:bg-red-100 rounded-full transition-colors"
              >
                <X className="h-4 w-4 text-red-500" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-gray-500">
              <Upload className="h-4 w-4" />
              <span className="text-sm">Choose {label.toLowerCase()}</span>
            </div>
          )}
        </label>
      </div>
      <p className="text-xs text-gray-500">
        Accepted formats: PDF, JPG, PNG, DOC, DOCX
      </p>
    </div>
  )
}

export default FileUpload