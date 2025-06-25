import * as yup from 'yup';

export const billerValidationSchema = yup.object().shape({
  billerCode: yup.string().required('Biller code is required'),
  billerName: yup.string().required('Biller name is required'),
  billerShortName: yup.string().required('Biller short name is required'),
  billerDescription: yup.string().required('Biller description is required'),
  // billerCategory: yup.string().required('Biller category is required'),
  // logoURL: yup.string().url('Must be a valid URL').required('Logo URL is required'),
  billerCategory: yup.object().required('Biller category is required'),
  validationRequired: yup.object().required('Validation is required'),
  amountType: yup.object().required('Amount type is required'),
  logoURL: yup
    .mixed()
    .test('fileSize', 'File too large', (value) => !value || (value && value.size <= 1024 * 1024)) // 1MB
    .test('fileType', 'Unsupported file type', (value) => !value || (value && ['image/jpeg', 'image/png'].includes(value.type))),
  status: yup.object().required('Status is required'),
  billerRef: yup.string().required('Biller reference is required'),
  countryCode: yup.string().required('Country code is required'),
  serviceProvider: yup.string().required('Service provider is required'),
  minAmount: yup.number().required('Minimum amount is required').min(0),
  maxAmount: yup.number().required('Maximum amount is required').min(yup.ref('minAmount'), 'Max amount must be greater than min amount'),
  products: yup.array().of(
    yup.object().shape({
      productCode: yup.string().required('Product code is required'),
      productName: yup.string().required('Product name is required'),
      productDesc: yup.string().required('Product description is required'),
      amount: yup.number().required('Amount is required').min(0),
      amountType: yup.object().required('Amount type is required'),
      status: yup.object().required('Status is required'),
    })
  ),
  paymentData: yup.array().of(
    yup.object().shape({
      fieldID: yup.string().required('Field ID is required'),
      fieldName: yup.string().required('Field name is required'),
      fieldDataType: yup.object().required('Field data type is required'),
      maxLength: yup.number().required('Max length is required').min(1),
      mandatoryFlag: yup.object().required('Mandatory flag is required'),
      inputOrOutput: yup.object().required('Input/Output is required'),
    })
  ),
});