import { ProductFormValues } from "@/types";

export const buildProductPayload = (
  values: ProductFormValues,
  fileUrl: string,
  user: any,
  originalProduct?: any,
  hasNewImage?: boolean
) => {
  let finalImageURL = '';
  
  if (originalProduct) {
    // Edit mode
    finalImageURL = `/${originalProduct?.picture?.split('/').pop()}` || '';
    if (hasNewImage && fileUrl) {
      finalImageURL = fileUrl;
    }
  } else {
    // Create mode
    finalImageURL = fileUrl;
  }

  return {
    productId: originalProduct?.id || null,
    productName: values?.productName,
    productPrice: values?.productPrice,
    costPrice: values?.costPrice,
    productCategory: values?.productCategory?.label || values?.productCategory,
    stockQuantity: values?.stockQuantity,
    productDescription: values?.productDescription,
    imageURL: finalImageURL,
    productCode: originalProduct?.productCode || "",
    unitQuantity: values?.unitQuantity,
    base64Image: '',
    storeId: '2001',
    barCode: values.barCode || '',
    brand: values?.brand?.value  || values?.brand || "",
    ccy: user?.ccy
  };
};