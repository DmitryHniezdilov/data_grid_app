import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { Typography } from '@mui/material'

const Error = () => {
  const router = useRouter()

  useEffect(() => {
    setTimeout(() => {
      router.push('/')
    }, 3000)
  }, [router])

  return (
    <div>
      <Typography align="center">
        Error!
      </Typography>
      <Typography align="center">
        Something is going wrong...
      </Typography>
    </div>
  )
}

export default Error
