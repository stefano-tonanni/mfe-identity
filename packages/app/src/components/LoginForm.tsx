import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useRouter } from 'wouter'

import { useIdentityContext } from '#providers/provider'

import type { UseFormReturn, UseFormProps } from 'react-hook-form'
import type { LoginFormValues } from '#providers/types'
import { appRoutes } from '#data/routes'
import { getCustomerEmailFromUrl } from '#utils/getParamsFromUrl'
import { useEffect, useState } from 'react'

export const validationSchema = yup.object().shape({
  customerEmail: yup
    .string()
    .email('Email is invalid')
    .required('Email is required'),
  customerPassword: yup.string().required('Password is required')
})

export const LoginForm: React.FC = () => {
  const { state, customerLogin } = useIdentityContext()
  const signUpSuccess =
    localStorage.getItem('cLayer-identity-signUpStatus') === 'success'
  const [showSignUpSuccess, setShowSignUpSuccess] = useState(
    Boolean(signUpSuccess)
  )
  const { isLoginOnError } = state
  const router = useRouter()
  const customerEmail = getCustomerEmailFromUrl()

  const form: UseFormReturn<LoginFormValues, UseFormProps> =
    useForm<LoginFormValues>({
      resolver: yupResolver(validationSchema),
      defaultValues: { customerEmail: customerEmail ?? '' }
    })

  const onSubmit = form.handleSubmit(async (formData) => {
    void customerLogin({
      customerEmail: formData.customerEmail,
      customerPassword: formData.customerPassword
    })
  })

  useEffect(() => {
    if (showSignUpSuccess) {
      setTimeout(() => {
        setShowSignUpSuccess(false)
        localStorage.removeItem('cLayer-identity-signUpStatus')
      }, 2000)
    }
  }, [showSignUpSuccess])

  return (
    <>
      <form
        className='mt-8 mb-0'
        onSubmit={(e) => {
          e.preventDefault()
          void onSubmit()
        }}
      >
        <div className='space-y-4'>
          <div className='field mb-8'>
            <div className='flex justify-between items-center mb-2'>
              <label className='text-black leading-6 font-semibold text-base'>
                Email
              </label>
            </div>
            <input
              {...form.register('customerEmail')}
              className='block w-full px-4 mt-2 h-[44px] rounded ring-inset outline-0 focus:border-primary focus:ring-primary border-gray-200 text-md'
              type='email'
            />
            {form.formState.errors?.customerEmail != null && (
              <p className='text-sm text-red-400 mt-2'>
                {form.formState.errors.customerEmail.message}
              </p>
            )}
          </div>
          <div className='field mb-8'>
            <div className='flex justify-between items-center mb-2'>
              <label className='text-black leading-6 font-semibold text-base'>
                Password
              </label>
            </div>
            <input
              {...form.register('customerPassword')}
              className='block w-full px-4 mt-2 h-[44px] rounded ring-inset outline-0 focus:border-primary focus:ring-primary border-gray-200 text-md'
              type='password'
            />
            {form.formState.errors?.customerPassword != null && (
              <p className='text-sm text-red-400 mt-2'>
                {form.formState.errors.customerPassword.message}
              </p>
            )}
          </div>
          <div className='flex pt-4'>
            <button
              type='submit'
              className='inline-flex items-center justify-center font-bold rounded text-sm leading-6 whitespace-nowrap transition duration-700 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-0 active:outline-none active:ring-2 active:ring-offset-0 border-primary text-white bg-primary hover:opacity-80 focus:ring-gray-300 active:ring-primary active:bg-primary py-2.5 px-12 w-full'
            >
              Login
            </button>
          </div>
          {isLoginOnError && (
            <div className=''>
              <span className='text-sm text-red-400 font-medium mt-2'>
                Invalid credentials.
              </span>
            </div>
          )}
          {showSignUpSuccess && (
            <div className=''>
              <span className='text-sm text-green-400 font-medium mt-2'>
                Sign up successful.
              </span>
            </div>
          )}
        </div>
      </form>
      <div>
        <p className='pt-6 text-base text-gray-500 font-medium'>
          Don't have an account?{' '}
          <a
            className='text-primary font-bold hover:opacity-80'
            href={`${router.base}${appRoutes.signUp.makePath()}${
              window?.location.search ?? ''
            }`}
          >
            Sign up for free
          </a>
          .
        </p>
      </div>
    </>
  )
}
