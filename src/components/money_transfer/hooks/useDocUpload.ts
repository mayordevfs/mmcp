
import { uploadClient } from "@/data/money_transfer/upload";
import { useEffect, useState } from "react"
import { toast } from "react-toastify";

export const useDocUpload = (file:FileList|null)=>{
    const [fileUrl,setFileUrl] = useState('');
    const [fileError, setFileError] = useState<string>('');
    const [isUploadingFile, setIsUploadingFile] = useState(false);
    const fileArray = Array.from(file as FileList || []);

    useEffect(()=>{
        if (!file?.length) {
            return
        }
        setIsUploadingFile(true);
        uploadClient.upload(fileArray)
        .then((res:any)=>{
            if (res?.data?.code!=='000') {
                toast.error('Something went wrong')
            }
            else{
                const filename = res.data?.refNo
                setFileUrl(filename)
                toast.success('File uploaded successfully')
            }
        })
        .catch((error)=>{
            console.error('Upload error:', error);
            toast.error("File upload failed!");
            setFileUrl('');
        })
        .finally(()=>{
            setIsUploadingFile(false);
        })
    },[file])
    return{
            fileUrl,
            isUploadingFile
    }
}