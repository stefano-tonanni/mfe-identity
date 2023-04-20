import { useIdentityContext } from '#providers/provider'

import { PageErrorLayout } from '#components/PageErrorLayout'
import { LayoutDefault } from '#components/LayoutDefault'
import { LoginForm } from '#components/LoginForm'
import {
  SkeletonTemplate,
  withSkeletonTemplate
} from '#components/SkeletonTemplate'

const LoginFormSkeleton = withSkeletonTemplate(LoginForm)

export default function LoginPage(): JSX.Element {
  const { state } = useIdentityContext()
  const { isLoginLoading, isOnError } = state

  if (isOnError) {
    return <PageErrorLayout statusCode={500} message='Application error.' />
  }

  return (
    <LayoutDefault>
      <div className='flex flex-col w-full'>
        <h1 className='text-[32px] leading-[38px] text-black font-semibold'>
          Login
        </h1>
        <p className='pt-2 text-sm text-gray-500 font-medium'>
          Welcome back! Please enter your details.
        </p>
        <SkeletonTemplate isLoading={isLoginLoading} delayMs={0}>
          <LoginFormSkeleton />
        </SkeletonTemplate>
      </div>
    </LayoutDefault>
  )
}
