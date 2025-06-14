import useEmail from '@/stores/userEmail';
import axiosInstanceNoAuth from '@/utils/fetch-function-no-auth';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState, useRef, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';

// Type definitions
interface OTPFormData {
  otp: string[];
  email: string;
}

interface VerifyOTPPayload {
  otp: string;
  email: string;
}

interface ResendOTPPayload {
  email: string;
}

interface APIResponse {
  success: boolean;
  message: string;
  data?: any;
}

export default function OTPVerification() {
  const [resendTimer, setResendTimer] = useState<number>(60);
  const [canResend, setCanResend] = useState<boolean>(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
   const {email,clearEmail} = useEmail()
   const router = useRouter()
  const { control, handleSubmit, setValue, watch, formState: { errors } } = useForm<OTPFormData>({
    defaultValues: {
      otp: ['', '', '', ''],
      email
    }
  });

  // API functions
  const verifyOTP = async (payload: VerifyOTPPayload): Promise<APIResponse> => {
    // Replace with your actual API endpoint
    const response = await fetch('/onboarding/customer/verify-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'OTP verification failed');
    }
    
    return response.json();
  };

  const resendOTP = async (email: string): Promise<APIResponse> => {
    // Replace with your actual API endpoint
    const response = await fetch('/onboarding/customer/resend-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email } as ResendOTPPayload),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to resend OTP');
    }
    
    return response.json();
  };

  // React Query mutations
  const verifyMutation = useMutation<APIResponse, Error, VerifyOTPPayload>(
    (data)=>axiosInstanceNoAuth.request({
      url:'onboarding/customer/verify-otp',
      method:'POST',
      data:data
    }),
    {
      onSuccess: (data) => {
      console.log('Verification successful:', data);
      // Handle success - redirect or show success message
    //   alert('OTP verified successfully!');
      // You might want to redirect here
      // router.push('/dashboard');
      if (data?.data?.code!=='000') {
        toast.error('Error verifying OTP')
      }
      else{
        toast.success('OTP verified successfully!')
        clearEmail()
        router.push('/money_transfer/login')
      }
    },
    onError: (error) => {
      console.error('Verification failed:', error);
      toast.error('Error verifying OTP')
      // alert('Verification failed. Please check your code and try again.');
    },
    }
  );

  const resendMutation = useMutation<APIResponse, Error, string>({
    mutationFn: resendOTP,
    onSuccess: (data) => {
      console.log('OTP resent successfully:', data);
      setResendTimer(60);
      setCanResend(false);
      alert('OTP sent successfully!');
    },
    onError: (error) => {
      console.error('Resend failed:', error);
      alert('Failed to resend OTP. Please try again.');
    },
  });

  const watchedOTP = watch('otp');

  // Timer for resend functionality
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  const handleOTPChange = (index: number, value: string) => {
    if (value.length > 1) return; // Prevent multiple characters
    
    const newOTP = [...watchedOTP];
    newOTP[index] = value;
    setValue('otp', newOTP);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !watchedOTP[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    const otpArray = pastedData.split('').concat(Array(6).fill('')).slice(0, 6);
    setValue('otp', otpArray);
    
    // Focus the last filled input or first empty one
    const lastFilledIndex = otpArray.findIndex(val => !val);
    const focusIndex = lastFilledIndex === -1 ? 5 : Math.max(0, lastFilledIndex - 1);
    inputRefs.current[focusIndex]?.focus();
  };

  const onSubmit = async (data: OTPFormData) => {
    const payload: VerifyOTPPayload = {
      otp: data.otp.join(''),
      email: data.email
    };

    verifyMutation.mutate(payload);
  };

  const handleResendOTP = async () => {
    if (!canResend || resendMutation.isLoading) return;
    
    resendMutation.mutate(watch('email'));
  };

  const isOTPComplete = watchedOTP.every(digit => digit !== '');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Verify Your Email</h1>
          <p className="text-gray-600">
            We've sent a 6-digit code to<br />
            <span className="font-semibold text-gray-900">{watch('email')}</span>
          </p>
        </div>

        {/* Error Display */}
        {(verifyMutation.isError || resendMutation.isError) && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <svg className="w-5 h-5 text-red-400 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="text-sm font-medium text-red-800">
                  {verifyMutation.isError ? 'Verification Failed' : 'Resend Failed'}
                </h3>
                <p className="text-sm text-red-700 mt-1">
                  {verifyMutation.error?.message || resendMutation.error?.message || 'An error occurred. Please try again.'}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {/* OTP Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Enter verification code
            </label>
            <div className="flex space-x-3 justify-center">
              {[0, 1, 2, 3].map((index) => (
                <Controller
                  key={index}
                  name={`otp.${index}`}
                  control={control}
                  rules={{
                    required: 'Required',
                    pattern: {
                      value: /^[0-9]$/,
                      message: 'Only numbers allowed'
                    }
                  }}
                  render={({ field }) => (
                    <input
                      {...field}
                      ref={(el) => inputRefs.current[index] = el}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      className={`w-12 h-12 text-center text-xl font-semibold border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 ${
                        errors.otp?.[index] 
                          ? 'border-red-500 bg-red-50' 
                          : field.value 
                            ? 'border-blue-600 bg-indigo-50' 
                            : 'border-gray-300 hover:border-gray-400'
                      }`}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                        handleOTPChange(index, e.target.value);
                      }}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={handlePaste}
                    />
                  )}
                />
              ))}
            </div>
            {errors.otp && (
              <p className="text-red-500 text-sm mt-2 text-center">
                Please enter a valid 6-digit code
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="button"
            onClick={handleSubmit(onSubmit)}
            disabled={!isOTPComplete || verifyMutation.isLoading}
            className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 ${
              !isOTPComplete || verifyMutation.isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-blue-400 hover:bg-indigo-700 active:bg-indigo-800 shadow-lg hover:shadow-xl'
            }`}
          >
            {verifyMutation.isLoading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Verifying...
              </div>
            ) : (
              'Verify Code'
            )}
          </button>
        </div>

        {/* Resend Section */}
        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm mb-3">
            Didn't receive the code?
          </p>
          {canResend ? (
            <button
              onClick={handleResendOTP}
              disabled={resendMutation.isLoading}
              className={`font-semibold text-sm underline transition-colors duration-200 ${
                resendMutation.isLoading 
                  ? 'text-gray-400 cursor-not-allowed' 
                  : 'text-indigo-600 hover:text-indigo-800'
              }`}
            >
              {resendMutation.isLoading ? 'Sending...' : 'Resend Code'}
            </button>
          ) : (
            <p className="text-gray-500 text-sm">
              Resend code in {resendTimer}s
            </p>
          )}
        </div>

        {/* Back Link */}
        <div className="mt-6 text-center">
          <Link href={'/money_transfer/login'}>
            <button
            type="button"
            className="text-gray-500 hover:text-gray-700 text-sm transition-colors duration-200"
            
          >
            ← Back to login
          </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

// TODO: 1.) Retrieve the OTP value from the user email box
// TODO: 2.) Store the user email address in a state that persists
// TODO 3.)  Clear the state on successful verfiication.