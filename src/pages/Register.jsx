import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  Store,
  Phone,
  Briefcase,
} from 'lucide-react'

import AuthPageLayout from '../components/auth/AuthPageLayout'
import RegisterHero from '../components/auth/RegisterHero'
import AuthFormCard from '../components/auth/AuthFormCard'
import AuthInput from '../components/auth/AuthInput'

import { authApi } from '../services/api'

const PASSWORD_HINT =
  'Must be at least 8 characters with a symbol.'

function isPasswordValid(password) {
  return (
    password.length >= 8 &&
    /[^A-Za-z0-9]/.test(password)
  )
}

export default function Register() {
  const navigate = useNavigate()

  const [role, setRole] = useState('BUYER')

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // Seller fields
  const [shopName, setShopName] = useState('')
  const [businessType, setBusinessType] = useState('')
  const [phone, setPhone] = useState('')

  const [showPassword, setShowPassword] = useState(false)
  const [agreed, setAgreed] = useState(false)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()

    setError('')

    if (!name.trim() || !email.trim() || !password) {
      setError('Please fill in all required fields.')
      return
    }

    if (!isPasswordValid(password)) {
      setError(PASSWORD_HINT)
      return
    }

    if (role === 'SELLER') {
      if (!shopName.trim() || !businessType.trim()) {
        setError(
          'Please enter your shop name and business type.'
        )
        return
      }
    }

    if (!agreed) {
      setError(
        'Please agree to the Terms of Service and Privacy Policy.'
      )
      return
    }

    setLoading(true)

    try {
      let response

      if (role === 'SELLER') {
        response = await authApi.registerSeller({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
          shop_name: shopName.trim(),
          business_type: businessType.trim(),
          phone: phone.trim() || null,
        })
      } else {
        response = await authApi.register({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
        })
      }

      console.log(
        'REGISTER RESPONSE:',
        response.data
      )

      // Seller registration
      if (role === 'SELLER') {
        navigate(
          '/login?portal=seller&registered=seller',
          {
            replace: true,
          }
        )
        return
      }

      // Buyer registration
      navigate(
        '/login?registered=buyer',
        {
          replace: true,
        }
      )
    } catch (err) {
      console.error(
        'Registration error:',
        err
      )

      setError(
        err.response?.data?.message ||
          err.message ||
          'Registration failed. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthPageLayout variant="register">
      <div className="w-full min-w-0 lg:w-1/2">
        <RegisterHero />
      </div>

      <div className="flex w-full min-w-0 justify-center lg:w-1/2 lg:justify-end">
        <div className="w-full min-w-0 max-w-md">
          <AuthFormCard
            title="Create Account"
            subtitle="Choose how you want to use Digital City Center."
          >
            {error && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <form
              className="space-y-4"
              onSubmit={handleSubmit}
            >
              {/* ACCOUNT TYPE */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Account Type
                </label>

                <div className="grid grid-cols-2 gap-3">
                  {/* BUYER */}
                  <button
                    type="button"
                    onClick={() => setRole('BUYER')}
                    className={`rounded-xl border p-4 text-left transition ${
                      role === 'BUYER'
                        ? 'border-dcc-primary bg-dcc-primary/5 ring-1 ring-dcc-primary'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <User
                        className={`h-5 w-5 ${
                          role === 'BUYER'
                            ? 'text-dcc-primary'
                            : 'text-slate-500'
                        }`}
                      />

                      <span className="font-semibold">
                        Buyer
                      </span>
                    </div>

                    <p className="mt-2 text-xs text-slate-500">
                      Shop and purchase products.
                    </p>
                  </button>

                  {/* SELLER */}
                  <button
                    type="button"
                    onClick={() => setRole('SELLER')}
                    className={`rounded-xl border p-4 text-left transition ${
                      role === 'SELLER'
                        ? 'border-dcc-primary bg-dcc-primary/5 ring-1 ring-dcc-primary'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Store
                        className={`h-5 w-5 ${
                          role === 'SELLER'
                            ? 'text-dcc-primary'
                            : 'text-slate-500'
                        }`}
                      />

                      <span className="font-semibold">
                        Seller
                      </span>
                    </div>

                    <p className="mt-2 text-xs text-slate-500">
                      Create your shop and sell products.
                    </p>
                  </button>
                </div>
              </div>

              {/* FULL NAME */}
              <AuthInput
                id="name"
                label="Full Name"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                placeholder="John Doe"
                icon={User}
                required
                autoComplete="name"
                variant="auth"
              />

              {/* EMAIL */}
              <AuthInput
                id="email"
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder="name@example.com"
                icon={Mail}
                required
                autoComplete="email"
                variant="auth"
              />

              {/* SELLER ONLY FIELDS */}
              {role === 'SELLER' && (
                <>
                  <AuthInput
                    id="shopName"
                    label="Shop Name"
                    value={shopName}
                    onChange={(e) =>
                      setShopName(e.target.value)
                    }
                    placeholder="My Awesome Store"
                    icon={Store}
                    required
                    variant="auth"
                  />

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Business Type
                    </label>

                    <div className="relative">
                      <Briefcase className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                      <select
                        value={businessType}
                        onChange={(e) =>
                          setBusinessType(e.target.value)
                        }
                        className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-dcc-primary focus:ring-2 focus:ring-dcc-primary/20"
                        required
                      >
                        <option value="">
                          Select business type
                        </option>

                        <option value="INDIVIDUAL">
                          Individual
                        </option>

                        <option value="SOLE_PROPRIETORSHIP">
                          Sole Proprietorship
                        </option>

                        <option value="PARTNERSHIP">
                          Partnership
                        </option>

                        <option value="COMPANY">
                          Company
                        </option>
                      </select>
                    </div>
                  </div>

                  <AuthInput
                    id="phone"
                    label="Phone Number"
                    type="tel"
                    value={phone}
                    onChange={(e) =>
                      setPhone(e.target.value)
                    }
                    placeholder="+94 77 123 4567"
                    icon={Phone}
                    variant="auth"
                  />
                </>
              )}

              {/* PASSWORD */}
              <AuthInput
                id="password"
                label="Password"
                type={
                  showPassword
                    ? 'text'
                    : 'password'
                }
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="••••••••"
                icon={Lock}
                hint={PASSWORD_HINT}
                required
                autoComplete="new-password"
                variant="auth"
                rightElement={
                  <button
                    type="button"
                    className="text-slate-400 hover:text-slate-600"
                    onClick={() =>
                      setShowPassword((value) => !value)
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                }
              />

              {/* TERMS */}
              <label className="flex cursor-pointer items-start gap-2.5">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) =>
                    setAgreed(e.target.checked)
                  }
                  className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 text-dcc-primary focus:ring-dcc-primary"
                />

                <span className="text-sm leading-snug text-slate-600">
                  I agree to the{' '}
                  <Link
                    to="/terms"
                    className="font-semibold text-dcc-primary hover:underline"
                  >
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link
                    to="/privacy"
                    className="font-semibold text-dcc-primary hover:underline"
                  >
                    Privacy Policy
                  </Link>
                  .
                </span>
              </label>

              {/* SUBMIT */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-dcc-primary py-3 text-sm font-semibold text-white transition hover:bg-dcc-primary-hover disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading
                  ? 'Creating account...'
                  : role === 'SELLER'
                    ? 'Register as Seller'
                    : 'Create Buyer Account'}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-slate-600">
              Already have an account?{' '}
              <Link
                to={
                  role === 'SELLER'
                    ? '/login?portal=seller'
                    : '/login'
                }
                className="font-semibold text-dcc-primary hover:underline"
              >
                Sign in
              </Link>
            </div>
          </AuthFormCard>
        </div>
      </div>
    </AuthPageLayout>
  )
}