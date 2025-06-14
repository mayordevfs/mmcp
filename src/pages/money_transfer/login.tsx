import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from 'react-query';
import { Mail, Lock, Loader2, Eye, EyeOff, X, Shield } from 'lucide-react';
import axiosInstanceNoAuth from '@/utils/fetch-function-no-auth';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { allowedRoles, getAuthCredentials, hasAccess, isAuthenticated, setAuthCredentials } from '@/utils/auth-transfer-utils';
import Alert from '@/components/ui/alert';
import { useTranslation } from 'next-i18next';
import { Router, useRouter } from 'next/router';
import useUser_transfer from '@/stores/userStoreTransfer';

// Zod validation schema
const loginSchema = z.object({
  username: z.string()
    .min(1, 'Username is required')
    .email('Please enter a valid email address'),
  password: z.string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters')
});

const otpSchema = z.object({
  otp: z.string()
    .min(1, 'OTP is required')
    .regex(/^\d{6}$/, 'OTP must be exactly 6 digits')
});

type LoginForm = z.infer<typeof loginSchema>;
type OTPForm = z.infer<typeof otpSchema>;

export default function LoginForm() {
  const {token,permissions} = getAuthCredentials()
  console.log(token,permissions);
  const {setUser} = useUser_transfer()
 
  
  const [showPassword, setShowPassword] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [loginData, setLoginData] = useState<LoginForm | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter()
  const {t} = useTranslation()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema)
  });

  const {
    register: registerOTP,
    handleSubmit: handleSubmitOTP,
    formState: { errors: otpErrors },
    reset: resetOTP
  } = useForm<OTPForm>({
    resolver: zodResolver(otpSchema)
  });

  // Login mutation
  const { mutate: loginUser, isLoading } = useMutation(
    (data: any) => axiosInstanceNoAuth({
      method: "POST",
      url: "auth/login",
      data: data.payload,
      headers: {
        'x-otp': data.otp
      }
    }),
    {
      onSuccess: (response) => {
        if (response?.data?.responseCode !== '00') {
          toast.error("Error signing in user");
        } else {
          toast.success('Login successful!');
          localStorage.setItem('token_money_transfer', response.data.ticketID);
          // localStorage.setItem('user_money_transfer', JSON.stringify(response.data));
          setUser(response?.data)
          setShowOTPModal(false);
           if (response?.data?.ticketID) {
            if (hasAccess(allowedRoles, ["CUSTOMER"])) {
              setAuthCredentials(response?.data.ticketID, [
                'CUSTOMER',
              ]);
              // router.push('/money_transfer/dashboard');
              return;
            }
          setErrorMessage('form:error-enough-permission');
        }
        resetOTP();
        reset();

        console.log('Login response:', response);
        // Handle successful login (e.g., store token, redirect)
        // Example: localStorage.setItem('token', response.data.token);
        // Example: router.push('/dashboard');
      }
    },
      onError: (error: any) => {
        console.error('Login error:', error);
        
        if (error?.response?.data) {
          const status = error.response.status;
          const message = error.response.data.message || 'Unknown error';
          
          switch (status) {
            case 400:
              toast.error(`Bad request: ${message}`);
              break;
            case 401:
              toast.error("Invalid username, password, or OTP");
              break;
            case 403:
              toast.error("Access forbidden - account may be suspended");
              break;
            case 422:
              toast.error("Validation error - please check your input");
              break;
            case 500:
              toast.error("Server error - please try again later");
              break;
            default:
              toast.error("Login failed");
          }
        } else {
          toast.error("Network error - please check your connection");
        }
      },
    }
  );

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onContinue = async (data: LoginForm) => {
    // Store login data and show OTP modal
    setLoginData(data);
    setShowOTPModal(true);
  };

  const onSubmitWithOTP = async (otpData: OTPForm) => {
    if (!loginData) {
      toast.error('Please fill in login details first');
      return;
    }

    try {
      // Build payload with required fields
      const payload = {
        username: loginData.username,
        password: loginData.password,
        userlang: "en",
        deviceId: "000",
        channelType: "WEB",
        entityCode: "H2P"
      };
      
      console.log('Login Data:', payload);
      console.log('OTP:', otpData.otp);
      
      loginUser({
        payload,
        otp: otpData.otp
      });
    } catch (error) {
      console.error('Login failed:', error);
      toast.error('Login failed. Please try again.');
    }
  };

  const handleCloseModal = () => {
    setShowOTPModal(false);
    resetOTP();
  };

  const handleForgotPassword = () => {
    // Handle forgot password logic
    toast.info('Forgot password functionality would be implemented here');
  };

  if (isAuthenticated({ 
    token_money_transfer:token,
    permissions_money_transfer:permissions
   })) {
      router.replace('/money_transfer/dashboard');
      console.log(true);
    }

  console.log(isAuthenticated({
    token_money_transfer:token,
    permissions_money_transfer:permissions
  }));
  console.log('hasaccess',hasAccess(allowedRoles,['CUSTOMER']))
  
    

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-400 px-8 py-6">
              <h2 className="text-3xl font-bold text-white text-center">Welcome Back</h2>
              <p className="text-blue-100 text-center mt-2">Sign in to your account</p>
            </div>
            
            <form className="px-8 py-8 space-y-6" onSubmit={handleSubmit(onContinue)}>
              {/* Username Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="inline w-4 h-4 mr-1" />
                  Email Address *
                </label>
                <input
                  {...register('username')}
                  type="email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your email address"
                  autoComplete="email"
                />
                {errors.username && (
                  <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Lock className="inline w-4 h-4 mr-1" />
                  Password *
                </label>
                <div className="relative">
                  <input
                    {...register('password')}
                    type={showPassword ? "text" : "password"}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your password"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                )}
              </div>

              {/* Forgot Password Link */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm text-blue-600 hover:text-blue-500 transition-colors duration-200"
                >
                  Forgot your password?
                </button>
              </div>

              {/* Continue Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-400 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center"
                >
                  Continue
                </button>
              </div>

              {/* Sign Up Link */}
              <div className="text-center pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    className="text-blue-600 hover:text-blue-500 font-medium transition-colors duration-200"
                  >
                    <Link href={`/money_transfer/register`}>Create one here</Link>
                  </button>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* OTP Modal */}
      {showOTPModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Shield className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Enter OTP</h3>
              </div>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmitOTP(onSubmitWithOTP)} className="p-6">
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-4">
                  Please enter the 6-digit OTP sent to your registered device to complete the login process.
                </p>
                
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  OTP Code *
                </label>
                <input
                  {...registerOTP('otp')}
                  type="text"
                  inputMode='numeric'
                  pattern='[0-9]*'
                  maxLength={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-center text-lg font-mono tracking-wider"
                  placeholder="000000"
                  autoComplete="one-time-code"
                />
                {otpErrors.otp && (
                  <p className="text-red-500 text-sm mt-1">{otpErrors.otp.message}</p>
                )}
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-400 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin h-4 w-4 mr-2" />
                      Signing in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {errorMessage ? (
        <Alert
          message={t(errorMessage)}
          variant="error"
          closeable={true}
          className="mt-5"
          onClose={() => setErrorMessage(null)}
        />
      ) : null}
    </>
  );
}