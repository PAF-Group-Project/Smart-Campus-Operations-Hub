import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Eye,
  EyeOff,
  GraduationCap,
  Loader2,
  LockKeyhole,
  Mail,
  ShieldCheck,
  UserRound
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const campusImage = '/images/login-campus.jpg';

const LoginPage = () => {
  const { user, loginGoogle, loginWithPassword, registerWithPassword } = useAuth();
  const [mode, setMode] = useState('login');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [showPassword, setShowPassword] = useState(false);

  const isLogin = mode === 'login';

  if (user) {
    return <Navigate to="/" replace />;
  }

  const onChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setStatus({ type: '', message: '' });

    try {
      if (isLogin) {
        await loginWithPassword({
          email: formData.email,
          password: formData.password
        });
        setStatus({ type: 'success', message: 'Logged in successfully.' });
        toast.success('Login successful');
      } else {
        await registerWithPassword({
          name: formData.name,
          email: formData.email,
          password: formData.password
        });
        setStatus({ type: 'success', message: 'Account created and logged in.' });
        toast.success('Account created successfully');
      }
    } catch (error) {
      const message = error?.response?.data?.message || 'Authentication failed';
      setStatus({ type: 'error', message });
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const switchMode = (nextMode) => {
    setMode(nextMode);
    setFormData((prev) => ({ ...prev, password: '' }));
    setStatus({ type: '', message: '' });
    setShowPassword(false);
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center justify-center">
        <section className="grid w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-200/70 lg:grid-cols-[0.9fr_1fr]">
          <div className="relative hidden min-h-[680px] overflow-hidden bg-slate-950 lg:block">
            <img src={campusImage} alt="Modern campus building exterior" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/35 via-slate-950/25 to-slate-950/80" />
            <div className="absolute left-8 right-8 top-8 flex items-center justify-between">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-2 text-sm font-semibold text-white backdrop-blur">
                <GraduationCap className="h-4 w-4" />
                Smart Campus
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-400/15 px-3 py-2 text-sm font-semibold text-emerald-100 ring-1 ring-emerald-300/30 backdrop-blur">
                <ShieldCheck className="h-4 w-4" />
                Secure access
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <div className="rounded-2xl border border-white/15 bg-white/12 p-6 text-white backdrop-blur-md">
                <h1 className="text-4xl font-semibold leading-tight">Run campus operations from one polished workspace.</h1>
                <p className="mt-4 text-sm leading-6 text-white/78">
                  Coordinate resources, users, notifications, and service work with a dashboard built for everyday campus teams.
                </p>
                <div className="mt-6 grid grid-cols-3 gap-3">
                  {['Resources', 'Tickets', 'Alerts'].map((item) => (
                    <div key={item} className="rounded-xl border border-white/15 bg-white/10 px-3 py-3">
                      <CheckCircle2 className="mb-2 h-4 w-4 text-cyan-200" />
                      <p className="text-xs font-semibold text-white/90">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center p-5 sm:p-8 lg:p-12">
            <div className="w-full max-w-md">
              <div className="mb-8 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/25">
                  <Building2 className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Smart Campus</p>
                  <h2 className="text-xl font-bold text-slate-950">Operations Hub</h2>
                </div>
              </div>

              <div className="mb-6 overflow-hidden rounded-2xl border border-slate-200 lg:hidden">
                <img src={campusImage} alt="Modern campus building exterior" className="h-40 w-full object-cover" />
              </div>

              <div className="mb-7">
                <p className="text-sm font-semibold text-indigo-600">{isLogin ? 'Welcome back' : 'Create workspace access'}</p>
                <h3 className="mt-2 text-3xl font-bold tracking-normal text-slate-950">
                  {isLogin ? 'Login to continue' : 'Create your account'}
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {isLogin
                    ? 'Access your dashboard, notifications, users, and campus workflows.'
                    : 'Set up your profile and start using the campus operations dashboard.'}
                </p>
              </div>

              <div className="mb-6 grid grid-cols-2 rounded-2xl bg-slate-100 p-1" role="tablist" aria-label="Authentication mode">
                {[
                  ['login', 'Login'],
                  ['register', 'Create account']
                ].map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    role="tab"
                    aria-selected={mode === value}
                    onClick={() => switchMode(value)}
                    className={`rounded-xl px-3 py-2.5 text-sm font-bold transition ${
                      mode === value
                        ? 'bg-white text-indigo-700 shadow-sm ring-1 ring-slate-200'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {status.message && (
                  <div
                    className={`rounded-xl px-4 py-3 text-sm font-semibold ${
                      status.type === 'error'
                        ? 'bg-rose-50 text-rose-700 ring-1 ring-rose-200'
                        : 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
                    }`}
                  >
                    {status.message}
                  </div>
                )}

                {!isLogin && (
                  <div>
                    <label htmlFor="name" className="mb-2 block text-sm font-semibold text-slate-700">
                      Full name
                    </label>
                    <div className="relative">
                      <UserRound className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                      <input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={onChange}
                        required={!isLogin}
                        autoComplete="name"
                        placeholder="Alex Morgan"
                        className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-12 text-sm font-medium text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-semibold text-slate-700">
                    Email address
                  </label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={onChange}
                      required
                      autoComplete="email"
                      placeholder="you@campus.edu"
                      className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-12 text-sm font-medium text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="mb-2 block text-sm font-semibold text-slate-700">
                    Password
                  </label>
                  <div className="relative">
                    <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={onChange}
                      required
                      autoComplete={isLogin ? 'current-password' : 'new-password'}
                      placeholder="Enter your password"
                      className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-12 pr-14 text-sm font-medium text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 text-sm font-bold text-white shadow-lg shadow-indigo-600/25 transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Please wait
                    </>
                  ) : (
                    <>
                      {isLogin ? 'Login with email' : 'Create account'}
                      <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                    </>
                  )}
                </button>
              </form>

              <div className="my-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-slate-200" />
                <span className="text-xs font-bold uppercase tracking-wide text-slate-400">Or</span>
                <div className="h-px flex-1 bg-slate-200" />
              </div>

              <button
                type="button"
                onClick={loginGoogle}
                className="flex h-12 w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="" className="mr-3 h-5 w-5" />
                Continue with Google
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default LoginPage;
