import React, { useState } from 'react';
import { Eye, EyeOff, Copy, RefreshCw, Key, Settings, CheckCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import useGetLookup from '@/hooks/useGetLookup';
import Input from '@/components/ui/input';
import { useTranslation } from 'next-i18next';
import Label from '@/components/ui/label';
import SelectInput from '@/components/ui/select-input';
import Navbar from '@/components/layouts/navigation/top-navbar';
import Button from '@/components/ui/button';

interface FormData {
  ipAddress: string;
  callbackUrl: string;
  token: string;
  bankCode: string;
  settlementBankAccount: string;
}

interface GeneratedKeys {
  clientId: string;
  clientSecret: string;
}

interface BankCode {
  value: string;
  label: string;
}

interface CopiedState {
  clientId: boolean;
  clientSecret: boolean;
}

const initialValues = {
    ipAddress: '',
    callbackUrl: '',
    token: '',
    bankCode: '',
    settlementBankAccount: ''
}

type ActiveTab = 'generate' | 'update';

export default function ApiKeyManager(): JSX.Element {
  const [activeTab, setActiveTab] = useState<ActiveTab>('generate');
  const {t} = useTranslation()
  const {register,handleSubmit,control,reset} = useForm({
    shouldUnregister:true,
    defaultValues:initialValues
  })
  const [generatedKeys, setGeneratedKeys] = useState<GeneratedKeys | null>(null);
  const [showSecret, setShowSecret] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<CopiedState>({ clientId: false, clientSecret: false });

  const bankCode = useGetLookup("BANK")
  console.log(bankCode);
  
  const handleGenerateKeys = async () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const newKeys = {
        clientId: `client_${Math.random().toString(36).substr(2, 16)}`,
        clientSecret: `secret_${Math.random().toString(36).substr(2, 32)}`
      };
      setGeneratedKeys(newKeys);
      setIsLoading(false);
    }, 2000);
  };

  const handleUpdateKeys = async () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      alert('API key configuration updated successfully!');
    }, 1500);
  };

  const handleRegenerateKeys = async () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const newKeys = {
        clientId: `client_${Math.random().toString(36).substr(2, 16)}`,
        clientSecret: `secret_${Math.random().toString(36).substr(2, 32)}`
      };
      setGeneratedKeys(newKeys);
      setIsLoading(false);
    }, 2000);
  };

  const copyToClipboard = async (text:string, type:any) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(prev => ({ ...prev, [type]: true }));
      setTimeout(() => setCopied(prev => ({ ...prev, [type]: false })), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 space-y-3">
      
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="rounded-2xl mb-3 p-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Key className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">API Key Management</h1>
              <p className="text-gray-600">Generate and manage your API credentials</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('generate')}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === 'generate'
                  ? 'bg-blue-50 text-[#0071CE] border-b-2 border-[#0071CE]'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Key className="w-4 h-4" />
                Generate New API Key
              </div>
            </button>
            <button
              onClick={() => setActiveTab('update')}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === 'update'
                  ? 'bg-blue-50 text-[#0071CE] border-b-2 border-[#0071CE]'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Settings className="w-4 h-4" />
                Update API Configuration
              </div>
            </button>
          </div>

          <div className="p-8">
            {activeTab === 'generate' && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <Key className="w-6 h-6 text-blue-600" />
                  <h2 className="text-xl font-semibold text-gray-900">Generate New API Key</h2>
                </div>

                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <Input
                      label={t('IP Address')}
                      {...register('ipAddress',{required:'This field is required'})}
                      placeholder='192.168.1....'
                      variant="outline"
                      className="mb-5"
                    />
                    <Input
                      label={t('Callback URL')}
                      {...register('callbackUrl',{required:'This field is required'})}
                      placeholder='https://yourcallbackurl.com'
                      variant="outline"
                      className="mb-5"
                    />

                    <Input
                      label={t('Token')}
                      {...register('token',{required:'This field is required'})}
                      variant="outline"
                      placeholder='123456'
                      className="mb-5"
                    />

                    <div className="mb-5">
                      <Label>{t('Bank Code')}</Label>
                      <SelectInput
                        name="bankCode"
                        control={control}
                        getOptionLabel={(option: any) => option.name}
                        getOptionValue={(option: any) => option.id}
                        options={bankCode}
                        rules={{
                          required:'This field is required'
                        }}
                      />
                    </div>
                  </div>

                  <Input
                      label={t('Settlement Bank Account')}
                      {...register('settlementBankAccount',{required:'This field is required'})}
                      variant="outline"
                      placeholder='1234567890'
                      className="mb-5"
                    />

                  <Button
                    type="button"
                    onClick={handleGenerateKeys}
                    disabled={isLoading}
                    className="w-full  text-white py-3 px-6 rounded-lg font-medium  transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Key className="w-4 h-4" />
                        Generate API Key
                      </>
                    )}
                  </Button>
                </div>

                {/* Generated Keys Display */}
                {generatedKeys && (
                  <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-xl">
                    <div className="flex items-center gap-2 mb-4">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <h3 className="text-lg font-semibold text-green-800">API Keys Generated Successfully!</h3>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-green-200 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Client ID</label>
                        <div className="flex items-center gap-2">
                          <code className="flex-1 px-3 py-2 bg-gray-50 border rounded font-mono text-sm">
                            {generatedKeys.clientId}
                          </code>
                          <button
                            onClick={() => copyToClipboard(generatedKeys.clientId, 'clientId')}
                            className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                          >
                            {copied.clientId ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Client Secret</label>
                        <div className="flex items-center gap-2">
                          <code className="flex-1 px-3 py-2 bg-gray-50 border rounded font-mono text-sm">
                            {showSecret ? generatedKeys.clientSecret : '••••••••••••••••••••••••••••••••'}
                          </code>
                          <button
                            onClick={() => setShowSecret(!showSecret)}
                            className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                          >
                            {showSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => copyToClipboard(generatedKeys.clientSecret, 'clientSecret')}
                            className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                          >
                            {copied.clientSecret ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-green-700 mt-3">
                      ⚠️ Save these credentials securely. They will not be shown again.
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'update' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Settings className="w-6 h-6 text-blue-600" />
                    <h2 className="text-xl font-semibold text-gray-900">Update API Configuration</h2>
                  </div>
                  <button
                    onClick={handleRegenerateKeys}
                    disabled={isLoading}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Regenerating...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4" />
                        Regenerate Keys
                      </>
                    )}
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <Input
                      label={t('IP Address')}
                      {...register('ipAddress',{required:'This field is required'})}
                      variant="outline"
                      placeholder='192.168.1...'
                      className="mb-5"
                    />

                    <Input
                      label={t('Callback URL')}
                      {...register('callbackUrl',{required:'This field is required'})}
                      variant="outline"
                      placeholder='https://yourcallbackurl.com'
                      className="mb-5"
                    />

                     <Input
                      label={t('Token')}
                      {...register('token',{required:'This field is required'})}
                      variant="outline"
                      placeholder='123456'
                      className="mb-5"
                    />

                    <div className="mb-5">
                      <Label>{t('Bank Code')}</Label>
                      <SelectInput
                        name="bankCode"
                        control={control}
                        getOptionLabel={(option: any) => option.name}
                        getOptionValue={(option: any) => option.id}
                        options={bankCode}
                        rules={{
                          required:'This field is required'
                        }}
                      />
                    </div>
                  </div>

                  <Input
                      label={t('Settlement Bank Account')}
                      {...register('settlementBankAccount',{required:'This field is required'})}
                      variant="outline"
                      placeholder='1234567890'
                      className="mb-5"
                    />

                  <Button
                    type="button"
                    onClick={handleUpdateKeys}
                    disabled={isLoading}
                    className="w-full  text-white py-3 px-6 rounded-lg font-medium  transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Settings className="w-4 h-4" />
                        Update Configuration
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}