import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

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
      if (mode === 'login') {
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
  };

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="mx-auto w-full max-w-xl">
        <div className="rounded-2xl bg-white p-8 shadow-lg ring-1 ring-slate-200">
          <h1 className="text-3xl font-bold text-slate-900">Smart Campus</h1>
          <p className="mt-2 text-slate-600">Sign in to continue to Operations Hub</p>

          <div className="mt-6 grid grid-cols-2 rounded-xl bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => switchMode('login')}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                mode === 'login' ? 'bg-white text-slate-900 shadow' : 'text-slate-600'
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => switchMode('register')}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                mode === 'register' ? 'bg-white text-slate-900 shadow' : 'text-slate-600'
              }`}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {status.message && (
              <div
                className={`rounded-lg px-3 py-2 text-sm ${
                  status.type === 'error'
                    ? 'bg-rose-50 text-rose-700 ring-1 ring-rose-200'
                    : 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
                }`}
              >
                {status.message}
              </div>
            )}
            {mode === 'register' && (
              <div>
                <label htmlFor="name" className="mb-1 block text-sm font-medium text-slate-700">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={onChange}
                  required={mode === 'register'}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={onChange}
                required
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-1 block text-sm font-medium text-slate-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={onChange}
                required
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-lg bg-slate-900 px-4 py-2.5 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? 'Please wait...' : mode === 'login' ? 'Login with Email' : 'Create Account'}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Or</span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <button
            onClick={loginGoogle}
            className="flex w-full items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-3 shadow-sm transition hover:bg-slate-50"
          >
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google"
              className="mr-3 h-5 w-5"
            />
            <span className="font-medium text-slate-700">Continue with Google</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
