import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import Modal from '../ui/modal/modal';
import Label from '../ui/label';
import Input from '../ui/input';
import Button from '../ui/button';

type CustomerFormData = {
    contactName: string
    contactEmail: string
    contactPhone: string
}

type AddCustomerModalProps = {
    open: boolean,
    onClose: () => void
    handleCustomerSubmit: (data: CustomerFormData) => void
}

const AddCustomerModal = ({
    open,
    onClose,
    handleCustomerSubmit
}: AddCustomerModalProps) => {
    const [loading, setLoading] = useState(false)
    
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch
    } = useForm<CustomerFormData>({
        defaultValues: {
            contactName: '',
            contactEmail: '',
            contactPhone: ''
        }
    })

    // Reset form when modal closes
    useEffect(() => {
        if (!open) {
            reset()
        }
    }, [open, reset])

    const onSubmit = async (data: CustomerFormData) => {
        if (!data.contactEmail || !data.contactName || !data.contactPhone) {
            return
        }
        setLoading(true)
        handleCustomerSubmit(data)
        setLoading(false)
        onClose()
    }

    const content = (
        <div className='m-auto w-[800px] rounded bg-light p-7 space-y-5'>
            <div>
                <h2 className='font-semibold text-lg md:text-xl lg:text-2xl'>Add Customer</h2>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
                <div className=''>
                    <Label htmlFor='contactName' className='mb-2'>Customer name</Label>
                    <Input
                        id='contactName'
                        type='text'
                        placeholder='Enter customer name'
                        className='w-full'
                        {...register('contactName', { required: 'Customer name is required' })}
                    />
                    {errors.contactName && (
                        <span className='text-red-500 text-sm'>{errors.contactName.message}</span>
                    )}
                </div>
                <div>
                    <Label htmlFor='contactEmail' className='mb-2'>Customer Email</Label>
                    <Input
                        id='contactEmail'
                        type='email'
                        placeholder='Enter customer email'
                        className='w-full'
                        {...register('contactEmail', { 
                            required: 'Email is required',
                            pattern: {
                                value: /^\S+@\S+$/i,
                                message: 'Invalid email address'
                            }
                        })}
                    />
                    {errors.contactEmail && (
                        <span className='text-red-500 text-sm'>{errors.contactEmail.message}</span>
                    )}
                </div>
                <div>
                    <Label htmlFor='contactPhone' className='mb-2'>Customer Phone Number</Label>
                    <Input
                        id='contactPhone'
                        type='text'
                        placeholder='Enter customer phone number'
                        className='w-full'
                        {...register('contactPhone', { required: 'Phone number is required' })}
                    />
                    {errors.contactPhone && (
                        <span className='text-red-500 text-sm'>{errors.contactPhone.message}</span>
                    )}
                </div>
                <Button type="submit" disabled={loading}>
                    {loading ? "Please wait.." : "Save Customer"}
                </Button>
            </form>
        </div>
    )

    if (typeof open !== 'undefined') {
        return (
            <Modal open={open} onClose={onClose}>
                {content}
            </Modal>
        );
    }

    return content;
}

export default AddCustomerModal