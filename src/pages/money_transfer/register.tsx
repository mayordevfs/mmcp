import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery } from 'react-query';
import { Listbox, Transition } from '@headlessui/react';
import { ChevronDown, Check, User, Mail, Phone, Lock, Calendar, Globe, Loader2 } from 'lucide-react';
import axiosInstanceNoAuth from '@/utils/fetch-function-no-auth';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import useEmail from '@/stores/userEmail';

// Zod validation schema
const registrationSchema = z.object({
  firstname: z.string().min(2, 'First name must be at least 2 characters'),
  lastname: z.string().min(2, 'Last name must be at least 2 characters'),
  middlename: z.string().optional(),
  mobileNo: z.string()
    .regex(/^\d+$/, 'Mobile number must contain only numbers')
    .min(10, 'Mobile number must be at least 10 digits')
    .max(15, 'Mobile number must not exceed 15 digits'),
  email: z.string().email('Please enter a valid email address'),
  city: z.string().min(2, 'City must be at least 2 characters'),
  gender: z.enum(['Male', 'Female'], { required_error: 'Please select a gender' }),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
 password: z.string()
  .min(6, 'Password must be at least 6 digits')
  .regex(/^\d+$/, 'Password must contain only numbers'),
  nationality: z.string().min(1, 'Please select your nationality'),
  referralCode: z.string().optional(),
  bvn: z.string()
    .regex(/^\d+$/, 'BVN must contain only numbers')
    .length(11, 'BVN must be exactly 11 digits')
});

type RegistrationForm = z.infer<typeof registrationSchema>;

interface Country {
  name: { common: string };
  cca2: string;
  flag: string;
}

const genderOptions = ['Male', 'Female'];

// Fetch countries function for react-query
const fetchCountries = async (): Promise<Country[]> => {
  const response = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2,flag');
  if (!response.ok) {
    throw new Error('Failed to fetch countries');
  }
  const data = await response.json();
  return data.sort((a: Country, b: Country) => 
    a.name.common.localeCompare(b.name.common)
  );
};

export default function RegistrationForm() {
  const [selectedGender, setSelectedGender] = useState<string>('');
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const {setEmail} = useEmail()
  const router = useRouter()
  // Use react-query to fetch countries
  const { 
    data: countries = [], 
    isLoading: isLoadingCountries, 
    error: countriesError 
  } = useQuery<Country[]>('countries', fetchCountries, {
    staleTime: 1000 * 60 * 60, // 1 hour
    cacheTime: 1000 * 60 * 60 * 24, // 24 hours
    retry: 3,
    refetchOnWindowFocus: false
  });
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<RegistrationForm>({
    resolver: zodResolver(registrationSchema)
  });

  // Auto-generate full name
  const firstname = watch('firstname');
  const lastname = watch('lastname');

  const email = watch('email')
  // console.log(email);
  
  
  useEffect(() => {
    if (firstname && lastname) {
      setValue('name' as any, `${firstname} ${lastname}`);
    }
  }, [firstname, lastname, setValue]);

  // Registration mutation
  const { mutate: registerUser, isLoading } = useMutation(
    (data: any) => axiosInstanceNoAuth({
      method: "POST",
      url: "onboarding/customer/simple-onboard",
      data: data
    }),
    {
      onSuccess: (data) => {
        if (data?.data?.code!=='000') {
          toast.error("Error saving user")
          
        }
        else if (data?.data?.code==='E412') {
          toast.error("User already exists")
        }
        else{
          toast.success('User registered successfully');
          setEmail(email)
          router.push('/money_transfer/verify-otp')
        }
      },
      onError: (error: any) => {
        console.error('Registration error:', error);
        
        if (error?.response?.data) {
          const status = error.response.status;
          const message = error.response.data.message || 'Unknown error';
          
          switch (status) {
            case 400:
              toast.error(`Bad request: ${message}`);
              break;
            case 422:
              toast.error("Validation error - please check your input");
              break;
            case 500:
              toast.error("Server error - please try again later");
              break;
            default:
              toast.error("Error registering user");
          }
        } else {
          toast.error("Network error - please check your connection");
        }
      },
    }
  );

  const handleGenderChange = (value: string) => {
    setSelectedGender(value);
    setValue('gender', value as 'Male' | 'Female');
  };

  const handleCountryChange = (country: Country) => {
    setSelectedCountry(country);
    setValue('nationality', country.name.common);
  };

  const onSubmit = async (data: RegistrationForm) => {
    try {
      // Build payload with extracted country code
      const payload = {
        ...data,
        name: `${data.firstname} ${data.lastname}`,
        customerType: "individual",
        deviceId: "",
        geolocation: "",
        countryCode: selectedCountry?.cca2 || "NG", // Use selected country code or default to Nigeria
        onboardingId: ""
      };
      
      console.log('Registration Data:', payload);
      registerUser(payload);
    } catch (error) {
      console.error('Registration failed:', error);
      toast.error('Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-400 px-8 py-6">
            <h2 className="text-3xl font-bold text-white text-center">Create Account</h2>
            <p className="text-blue-100 text-center mt-2">Join us and get started today</p>
          </div>
          
          <form className="px-8 py-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="inline w-4 h-4 mr-1" />
                  First Name *
                </label>
                <input
                  {...register('firstname')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your first name"
                />
                {errors.firstname && (
                  <p className="text-red-500 text-sm mt-1">{errors.firstname.message}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="inline w-4 h-4 mr-1" />
                  Last Name *
                </label>
                <input
                  {...register('lastname')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your last name"
                />
                {errors.lastname && (
                  <p className="text-red-500 text-sm mt-1">{errors.lastname.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="inline w-4 h-4 mr-1" />
                Middle Name
              </label>
              <input
                {...register('middlename')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter your middle name (optional)"
              />
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="inline w-4 h-4 mr-1" />
                  Mobile Number *
                </label>
                <input
                  {...register('mobileNo')}
                  type="tel"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="07067546597"
                />
                {errors.mobileNo && (
                  <p className="text-red-500 text-sm mt-1">{errors.mobileNo.message}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="inline w-4 h-4 mr-1" />
                  Email Address *
                </label>
                <input
                  {...register('email')}
                  type="email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="your.email@example.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Globe className="inline w-4 h-4 mr-1" />
                City *
              </label>
              <input
                {...register('city')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter your city"
              />
              {errors.city && (
                <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
              )}
            </div>

            {/* Gender and Date of Birth */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender *
                </label>
                <div className="relative">
                  <Listbox value={selectedGender} onChange={handleGenderChange}>
                    <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-white py-3 pl-4 pr-10 text-left border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <span className="block truncate">
                        {selectedGender || 'Select gender'}
                      </span>
                      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      </span>
                    </Listbox.Button>
                    <Transition
                      enter="transition duration-100 ease-out"
                      enterFrom="transform scale-95 opacity-0"
                      enterTo="transform scale-100 opacity-100"
                      leave="transition duration-75 ease-out"
                      leaveFrom="transform scale-100 opacity-100"
                      leaveTo="transform scale-95 opacity-0"
                    >
                      <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
                        {genderOptions.map((gender) => (
                          <Listbox.Option
                            key={gender}
                            value={gender}
                            className={({ active }) =>
                              `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                                active ? 'bg-blue-100 text-blue-900' : 'text-gray-900'
                              }`
                            }
                          >
                            {({ selected }) => (
                              <>
                                <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                  {gender}
                                </span>
                                {selected && (
                                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                                    <Check className="h-5 w-5" />
                                  </span>
                                )}
                              </>
                            )}
                          </Listbox.Option>
                        ))}
                      </Listbox.Options>
                    </Transition>
                  </Listbox>
                </div>
                {errors.gender && (
                  <p className="text-red-500 text-sm mt-1">{errors.gender.message}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="inline w-4 h-4 mr-1" />
                  Date of Birth *
                </label>
                <input
                  {...register('dateOfBirth')}
                  type="date"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
                {errors.dateOfBirth && (
                  <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Lock className="inline w-4 h-4 mr-1" />
                Password *
              </label>
              <input
                {...register('password')}
                type="password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Create a strong password"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Nationality */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Globe className="inline w-4 h-4 mr-1" />
                Nationality *
              </label>
              <div className="relative">
                <Listbox 
                  value={selectedCountry} 
                  onChange={handleCountryChange}
                  disabled={isLoadingCountries}
                >
                  <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-white py-3 pl-4 pr-10 text-left border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed">
                    <span className="flex items-center">
                      {isLoadingCountries && (
                        <Loader2 className="animate-spin h-4 w-4 mr-2 text-gray-400" />
                      )}
                      <span className="block truncate">
                        {isLoadingCountries 
                          ? 'Loading countries...' 
                          : selectedCountry 
                            ? `${selectedCountry.flag} ${selectedCountry.name.common}`
                            : 'Select your nationality'
                        }
                      </span>
                    </span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    </span>
                  </Listbox.Button>
                  <Transition
                    enter="transition duration-100 ease-out"
                    enterFrom="transform scale-95 opacity-0"
                    enterTo="transform scale-100 opacity-100"
                    leave="transition duration-75 ease-out"
                    leaveFrom="transform scale-100 opacity-100"
                    leaveTo="transform scale-95 opacity-0"
                  >
                    <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
                      {countriesError ? (
                        <div className="px-4 py-2 text-red-600 text-sm">
                          Failed to load countries. Please try again.
                        </div>
                      ) : countries.length === 0 && !isLoadingCountries ? (
                        <div className="px-4 py-2 text-gray-500 text-sm">
                          No countries available
                        </div>
                      ) : (
                        countries.map((country) => (
                          <Listbox.Option
                            key={country.cca2}
                            value={country}
                            className={({ active }) =>
                              `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                                active ? 'bg-blue-100 text-blue-900' : 'text-gray-900'
                              }`
                            }
                          >
                            {({ selected }) => (
                              <>
                                <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                  {country.flag} {country.name.common}
                                </span>
                                {selected && (
                                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                                    <Check className="h-5 w-5" />
                                  </span>
                                )}
                              </>
                            )}
                          </Listbox.Option>
                        ))
                      )}
                    </Listbox.Options>
                  </Transition>
                </Listbox>
              </div>
              {errors.nationality && (
                <p className="text-red-500 text-sm mt-1">{errors.nationality.message}</p>
              )}
              {countriesError && (
                <p className="text-red-500 text-sm mt-1">Unable to load countries. Please refresh the page.</p>
              )}
            </div>

            {/* Additional Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Referral Code
                </label>
                <input
                  {...register('referralCode')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter referral code (optional)"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  BVN *
                </label>
                <input
                  {...register('bvn')}
                  type="tel"
                  maxLength={11}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="12345600011"
                />
                {errors.bvn && (
                  <p className="text-red-500 text-sm mt-1">{errors.bvn.message}</p>
                )}
              </div>
            </div>

            <div className="pt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-400 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5 mr-2" />
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}