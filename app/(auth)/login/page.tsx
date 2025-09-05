import React, { Suspense } from 'react'
import LoginForm from './_components/LoginFrom'


const page = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
      </Suspense>
    </div>
  )
}

export default page
