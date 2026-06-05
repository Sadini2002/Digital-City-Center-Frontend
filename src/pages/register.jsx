import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Register() {
  // Added role, businessName, and businessType to state
  const [formData, setFormData] = useState({ 
    role: 'BUYER', 
    name: '', 
    email: '', 
    password: '',
    businessName: '', 
    businessType: '' 
  });
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegistration = async (e) => {
    e.preventDefault();
    setError('');

    if (!agreedToTerms) return setError("You must agree to the Terms of Service.");
    if (formData.password.length < 8) return setError("Password must be at least 8 characters.");
    
    // Validation for Seller fields
    if (formData.role === 'SELLER' && (!formData.businessName || !formData.businessType)) {
      return setError("Please provide your Business Name and Type.");
    }

    setLoading(true);
    try {
      const payload = { ...formData, phone: '' };
      await axios.post('http://localhost:3000/api/auth/register', payload);
      setIsSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setIsSuccess(false);
    setFormData({ role: 'BUYER', name: '', email: '', password: '', businessName: '', businessType: '' });
    setAgreedToTerms(false);
  };

  return (
    <div className="min-h-screen flex flex-col text-on-surface">
      {/* TopNavBar */}
      <header className="w-full bg-surface shadow-sm border-b border-outline-variant z-50">
        <div className="flex flex-col w-full px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="font-headline-md text-headline-md font-bold text-primary">Digital City Center</div>
            <div className="flex items-center gap-4">
              <Link to="/login" className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors">Already have an account?</Link>
              <Link to="/login" className="bg-primary text-on-primary px-6 py-2 rounded-lg font-label-md text-label-md hover:opacity-90 active:scale-95 transition-all">Sign In</Link>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center py-section-gap px-4 md:px-8">
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          
          {/* ORIGINAL LEFT SIDE BACKGROUND */}
          <div className="hidden md:flex flex-col space-y-8">
            <div>
              <h1 className="font-display-lg text-display-lg text-primary mb-4 leading-tight">Join the Pulse of Sri Lanka's Market</h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant">Create your account to unlock personalized deals, track orders in real-time, and discover the best of local and international brands.</p>
            </div>
            <div className="grid grid-cols-1 gap-6">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-surface-container-low">
                <div className="w-12 h-12 rounded-lg bg-primary-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-on-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>local_shipping</span>
                </div>
                <div>
                  <h3 className="font-headline-md text-headline-md text-on-surface">Islandwide Delivery</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant">Fast and reliable across all districts.</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-xl bg-surface-container-low">
                <div className="w-12 h-12 rounded-lg bg-secondary-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-on-secondary-container" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
                </div>
                <div>
                  <h3 className="font-headline-md text-headline-md text-on-surface">Secure Payments</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant">100% protection for every transaction.</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE CARD */}
          <div className="bg-surface-container-lowest rounded-3xl shadow-xl border border-outline-variant p-8 md:p-10 transition-all duration-500 transform">
            
            {error && (
              <div className="mb-6 p-4 bg-error-container text-on-error-container rounded-xl font-body-md border border-error/20">{error}</div>
            )}

            {/* FORM STEP */}
            <div className={`${isSuccess ? 'hidden' : ''} transition-opacity duration-300`}>
              <h2 className="font-headline-lg text-headline-lg text-on-surface mb-2">Create Account</h2>
              <p className="font-body-md text-body-md text-on-surface-variant mb-6">Start your journey with Digital City Center today.</p>
              
              {/* --- ADDED: BUYER / SELLER TOGGLE TAB --- */}
              <div className="flex bg-surface-container rounded-xl p-1 mb-8">
                <button
                  type="button"
                  onClick={() => setFormData({...formData, role: 'BUYER'})}
                  className={`flex-1 py-3 rounded-lg text-sm font-semibold transition-all ${formData.role === 'BUYER' ? 'bg-surface-container-lowest shadow text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
                >
                  Buyer
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({...formData, role: 'SELLER'})}
                  className={`flex-1 py-3 rounded-lg text-sm font-semibold transition-all ${formData.role === 'SELLER' ? 'bg-surface-container-lowest shadow text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
                >
                  Seller / Vendor
                </button>
              </div>

              <form className="space-y-5" onSubmit={handleRegistration}>
                
                {/* --- ADDED: DYNAMIC SELLER FIELDS --- */}
                {formData.role === 'SELLER' && (
                  <div className="space-y-4 mb-2 p-4 bg-secondary-container/10 border border-secondary-container/30 rounded-xl">
                    <div className="space-y-1">
                      <label className="font-label-md text-label-md text-on-surface ml-1">Business Name</label>
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">business_center</span>
                        <input name="businessName" value={formData.businessName} onChange={handleChange} className="w-full pl-12 pr-4 py-3 rounded-xl border border-outline-variant bg-surface-bright focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none font-body-md text-body-md" placeholder="e.g., Colombo Fashion Hub" type="text"/>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="font-label-md text-label-md text-on-surface ml-1">Business Type</label>
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">category</span>
                        <input name="businessType" value={formData.businessType} onChange={handleChange} className="w-full pl-12 pr-4 py-3 rounded-xl border border-outline-variant bg-surface-bright focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none font-body-md text-body-md" placeholder="e.g., Fashion & Goods" type="text"/>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="font-label-md text-label-md text-on-surface ml-1">Full Name</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">person</span>
                    <input name="name" value={formData.name} onChange={handleChange} className="w-full pl-12 pr-4 py-3 rounded-xl border border-outline-variant bg-surface-bright focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none font-body-md text-body-md" placeholder="John Doe" required type="text"/>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-label-md text-label-md text-on-surface ml-1">Email Address</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">mail</span>
                    <input name="email" value={formData.email} onChange={handleChange} className="w-full pl-12 pr-4 py-3 rounded-xl border border-outline-variant bg-surface-bright focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none font-body-md text-body-md" placeholder="name@example.com" required type="email"/>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-label-md text-label-md text-on-surface ml-1">Password</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">lock</span>
                    <input name="password" value={formData.password} onChange={handleChange} className="w-full pl-12 pr-12 py-3 rounded-xl border border-outline-variant bg-surface-bright focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none font-body-md text-body-md" placeholder="••••••••" required type={showPassword ? "text" : "password"}/>
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-primary">
                      <span className="material-symbols-outlined">{showPassword ? 'visibility_off' : 'visibility'}</span>
                    </button>
                  </div>
                  <p className="text-[10px] text-on-surface-variant mt-1 px-1">Must be at least 8 characters.</p>
                </div>

                <div className="flex items-start gap-2 pt-2">
                  <input className="mt-1 rounded border-outline-variant text-primary focus:ring-primary" id="terms" checked={agreedToTerms} onChange={(e) => setAgreedToTerms(e.target.checked)} required type="checkbox"/>
                  <label className="font-body-md text-body-md text-on-surface-variant" htmlFor="terms">
                    I agree to the <a className="text-primary font-bold hover:underline" href="#">Terms of Service</a> and <a className="text-primary font-bold hover:underline" href="#">Privacy Policy</a>.
                  </label>
                </div>

                <button type="submit" disabled={loading} className="w-full bg-primary text-on-primary py-4 rounded-xl font-headline-md text-headline-md shadow-lg hover:shadow-primary/20 hover:scale-[1.01] active:scale-95 transition-all disabled:opacity-70">
                  {loading ? 'Creating Account...' : 'Register Now'}
                </button>

                <div className="relative flex items-center py-4">
                  <div className="flex-grow border-t border-outline-variant"></div>
                  <span className="flex-shrink mx-4 font-label-md text-label-md text-outline">OR</span>
                  <div className="flex-grow border-t border-outline-variant"></div>
                </div>

                <button className="w-full flex items-center justify-center gap-3 border border-outline-variant py-3 rounded-xl font-label-md text-label-md text-on-surface hover:bg-surface-container-low transition-colors" type="button">
                  <img alt="Google" className="w-5 h-5" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDWT1hEoAs2ri8g3CYuBEdqOQiQp5xcFPEV48A-7mwci_X-u3ATPIPgbjIb-xvL37oYlJEiONtpbuepTngIPDO5MsAWUgFgQupTvNQNcGyAm0gyl315lo0Nt_ymkuwFQVzShx__T1wFcUKzmam3TEFGo3-VvMpjryfAZD5b-CXdwgjJ7o5o6kVKzs72aHM_swkPQ5oFE9y_5-X9iNkByInwH0n-_K1nKVPCWMwkNH5U6nbs97vTAFOKWLA4T3I_XxvvPbQMKtUsdbA"/>
                  Sign up with Google
                </button>
              </form>
            </div>

            {/* SUCCESS STEP */}
            <div className={`${isSuccess ? 'flex' : 'hidden'} flex-col items-center text-center py-8 animate-fade-in`}>
              <div className="w-24 h-24 rounded-full bg-secondary-container flex items-center justify-center mb-6 animate-bounce">
                <span className="material-symbols-outlined text-on-secondary-container text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>mark_email_read</span>
              </div>
              <h2 className="font-headline-lg text-headline-lg text-on-surface mb-3">
                {formData.role === 'SELLER' ? 'Application Received!' : 'Check Your Inbox!'}
              </h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant mb-6 px-4">
                {formData.role === 'SELLER' 
                  ? "Your seller application has been submitted. We will review it and send you an email once approved."
                  : "We've sent a verification email to your address. Please click the link to verify your account."}
              </p>
              <button className="text-on-surface-variant hover:text-primary flex items-center gap-2 transition-colors" onClick={resetForm}>
                <span className="material-symbols-outlined">arrow_back</span>
                Back to registration
              </button>
            </div>

          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-section-gap px-4 md:px-6 flex flex-col md:flex-row justify-between items-center border-t border-outline-variant bg-on-tertiary-fixed text-surface-variant">
        <div className="mb-6 md:mb-0">
          <div className="font-headline-md text-headline-md font-bold text-surface-container-lowest mb-2">Digital City Center</div>
          <p className="font-label-md text-label-md">© 2024 Digital City Center. All rights reserved.</p>
        </div>
        <div className="flex flex-wrap justify-center gap-6">
          <a className="font-label-md text-label-md hover:text-primary-fixed-dim transition-colors underline" href="#">Privacy Policy</a>
          <a className="font-label-md text-label-md hover:text-primary-fixed-dim transition-colors underline" href="#">Terms of Service</a>
          <a className="font-label-md text-label-md hover:text-primary-fixed-dim transition-colors underline" href="#">Help Center</a>
          <a className="font-label-md text-label-md hover:text-primary-fixed-dim transition-colors underline" href="#">Sell on DCC</a>
          <a className="font-label-md text-label-md hover:text-primary-fixed-dim transition-colors underline" href="#">Track Order</a>
        </div>
      </footer>
    </div>
  );
}

export default Register;