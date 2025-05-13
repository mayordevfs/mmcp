import { m } from 'framer-motion';
import * as yup from 'yup';

export const customerValidationSchema = yup.object().shape({
  name: yup.string().required('form:error-name-required'),
  email: yup
    .string()
    .email('form:error-email-format')
    .required('form:error-email-required'),
  password: yup.string().required('form:error-password-required'),
});
export const userValidationSchema = yup.object().shape({
  username: yup.string().required('form:error-name-required'),
  email: yup
    .string()
    .email('form:error-email-format')
    .required('form:error-email-required'),
  password: yup.string().required('form:error-password-required'),
  firstname: yup.string().required('form:error-first-name-required'),
  lastname: yup.string().required('form:error-last-name-required'),
  mobileNo: yup.string().required('form:error-mobile-no-required'),
  userRole: yup.object().required('form:error-user-role-required'),
  branchCode: yup.object().required('form:error-branch-store-required'),
  status: yup.object().required('form:error-user-status-required'),
});
