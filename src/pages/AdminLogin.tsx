import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, Mail, Eye, EyeOff, RefreshCw } from 'lucide-react';
import { loginAdmin, getConfig, logoutAdmin } from '../lib/store';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const config = getConfig();

  useEffect(() => {
    // Clear any stuck admin session so user can re-login fresh
    logoutAdmin();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      if (loginAdmin(email.trim(), password)) {
        navigate('/admin');
      } else {
        setError('Galat email ya password! Saare small/capital letters check karein.');
      }
      setLoading(false);
    }, 400);
  };

  const fillCredentials = () => {
    setEmail('theoutfitgrid.inquiries@gmail.com');
    setPassword('8987304834');
    setError('');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-lg border border-slate-100 p-6 sm:p-8">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full overflow-hidden bg-slate-100 mb-4 border border-slate-100">
            <img src={config.logo} alt="Logo" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-xl font-bold text-slate-900 uppercase">{config.brandName}</h1>
          <p className="text-sm text-slate-500 mt-1">Admin Login</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-600 flex items-center gap-1.5">
              <Mail size={14} /> Admin Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Admin email enter karein"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-600 flex items-center gap-1.5">
              <Lock size={14} /> Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password enter karein"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-11"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="text-xs text-rose-600 bg-rose-50 px-3 py-2 rounded-lg flex items-start gap-2">
              <RefreshCw size={14} className="shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl text-sm font-semibold hover:bg-indigo-700 disabled:opacity-60 active:scale-95 transition-all"
          >
            {loading ? 'Checking...' : 'Login to Admin Dashboard'}
          </button>
        </form>

        <div className="mt-5 space-y-2">
          <button
            type="button"
            onClick={fillCredentials}
            className="w-full py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50"
          >
            Auto-fill admin credentials
          </button>
          <div className="text-center text-[11px] text-slate-400 space-y-0.5">
            <p>Email: theoutfitgrid.inquiries@gmail.com</p>
            <p>Password: 8987304834</p>
          </div>
        </div>
      </div>
    </div>
  );
}
