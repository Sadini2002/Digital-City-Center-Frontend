import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Loader2 } from 'lucide-react'

import SiteLayout from '../layouts/SiteLayout'
import { usersApi } from '../services/api'
import { setAuthToken } from '../utils/authStorage'

export default function GoogleAuthSuccess() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true

    async function completeGoogleLogin() {
      try {
        const token =
          searchParams.get('token')

        if (!token) {
          throw new Error(
            'Google login token was not provided.'
          )
        }

        // Store JWT
        await setAuthToken(
          token,
          true
        )

        // Get complete user profile
        const response =
          await usersApi.getProfile()

        const user =
          response?.data?.data ??
          response?.data?.user ??
          response?.data

        if (!user) {
          throw new Error(
            'Could not retrieve Google account information.'
          )
        }

        localStorage.setItem(
          'user',
          JSON.stringify(user)
        )

        if (!mounted) return

        // ======================================================
        // ROLE-BASED REDIRECTION
        // ======================================================
        const role =
          String(user.role || '').toUpperCase()

        if (role === 'SELLER') {
          navigate(
            '/seller/dashboard',
            { replace: true }
          )

          return
        }

        if (
          role.includes('ADMIN') ||
          role.includes('SUPER')
        ) {
          navigate(
            '/login',
            { replace: true }
          )

          return
        }

        navigate(
          '/',
          { replace: true }
        )
      } catch (err) {
        console.error(
          'Google login completion error:',
          err
        )

        if (mounted) {
          setError(
            err?.message ||
              'Google login failed.'
          )
        }
      }
    }

    completeGoogleLogin()

    return () => {
      mounted = false
    }
  }, [navigate, searchParams])

  if (error) {
    return (
      <SiteLayout activeAuth="login">
        <div className="flex min-h-[60vh] items-center justify-center px-4">
          <div className="w-full max-w-md rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
            <h1 className="text-xl font-bold text-red-600">
              Google Login Failed
            </h1>

            <p className="mt-3 text-sm text-slate-600">
              {error}
            </p>

            <button
              type="button"
              onClick={() =>
                navigate('/login', {
                  replace: true,
                })
              }
              className="mt-6 rounded-lg bg-dcc-primary px-5 py-2.5 text-sm font-semibold text-white"
            >
              Back to Login
            </button>
          </div>
        </div>
      </SiteLayout>
    )
  }

  return (
    <SiteLayout activeAuth="login">
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-dcc-primary" />

        <p className="mt-4 text-sm text-slate-600">
          Completing Google sign in…
        </p>
      </div>
    </SiteLayout>
  )
}