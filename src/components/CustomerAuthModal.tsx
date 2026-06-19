import { useState, useRef } from 'react';
import { X, User, Phone, Mail, Lock, CheckCircle } from 'lucide-react';
import { registerCustomer, loginCustomer } from '../lib/store';

interface CustomerAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess?: () => void;
}

export default function CustomerAuthModal({ isOpen, onClose, onAuthSuccess }: CustomerAuthModalProps) {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [form, setForm] = useState({ name: '', mobile: '', email: '', password: '' });
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setStatus(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);

    if (mode === 'login') {
      if (!form.mobile.trim() || !form.password.trim()) {
        setStatus({ type: 'error', message: 'Mobile aur password enter karein.' });
        return;
      }
      const res = loginCustomer(form.mobile.trim(), form.password.trim());
      if (res.success) {
        setStatus({ type: 'success', message: 'Login successful!' });
        onAuthSuccess?.();
        setTimeout(() => {
          onClose();
          setStatus(null);
          setForm({ name: '', mobile: '', email: '', password: '' });
        }, 1200);
      } else {
        setStatus({ type: 'error', message: res.message || 'Login failed.' });
      }
      return;
    }

    // Signup
    if (!form.name.trim() || !form.mobile.trim() || !form.email.trim() || !form.password.trim()) {
      setStatus({ type: 'error', message: 'Saare fields fill karein.' });
      return;
    }

    setLoading(true);
    const res = registerCustomer({
      name: form.name.trim(),
      mobile: form.mobile.trim(),
      email: form.email.trim(),
      password: form.password.trim(),
    });

    if (res.success) {
      // Also submit to formsubmit.co to send email to theoutfitgrid.inquiries@gmail.com
      formRef.current?.submit();
      setStatus({ type: 'success', message: 'Account created!' });
      onAuthSuccess?.();
      setTimeout(() => {
        onClose();
        setStatus(null);
        setForm({ name: '', mobile: '', email: '', password: '' });
      }, 1500);
    } else {
      setStatus({ type: 'error', message: res.message || 'Signup failed.' });
    }
    setLoading(false);
  };

  const switchMode = (newMode: 'login' | 'signup') => {
    setMode(newMode);
    setStatus(null);
    setForm({ name: '', mobile: '', email: '', password: '' });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl p-6">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full"
        >
          <X size={20} />
        </button>

        <div className="text-center mb-5">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 mb-3">
            <User size={24} />
          </div>
          <h2 className="text-lg font-bold text-slate-900">
            {mode === 'login' ? 'Customer Login' : 'Create Account'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {mode === 'login'
              ? 'Apne account mein login karein'
              : 'Offers aur new arrivals ke updates paayein'}
          </p>
        </div>

        <form
          ref={formRef}
          onSubmit={handleSubmit}
          action="https://formsubmit.co/theoutfitgrid.inquiries@gmail.com"
          method="POST"
          target="_blank"
          className="space-y-4"
        >
          <input type="hidden" name="_captcha" value="false" />
          <input type="hidden" name="_template" value="table" />
          <input type="hidden" name="_subject" value="New Customer Signup - OUTFIT GRID" />

          {mode === 'signup' && (
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-600 flex items-center gap-1.5">
                <User size={13} /> Full Name
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Aapka naam"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required={mode === 'signup'}
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-600 flex items-center gap-1.5">
              <Phone size={13} /> Mobile Number
            </label>
            <input
              name="mobile"
              type="tel"
              value={form.mobile}
              onChange={handleChange}
              placeholder="10 digit mobile number"
              pattern="[0-9]{10}"
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {mode === 'signup' && (
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-600 flex items-center gap-1.5">
                <Mail size={13} /> Email Address
              </label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="email@example.com"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required={mode === 'signup'}
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-600 flex items-center gap-1.5">
              <Lock size={13} /> Password
            </label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {status && (
            <div
              className={`text-xs px-3 py-2 rounded-lg flex items-center gap-2 ${
                status.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-rose-50 text-rose-700'
              }`}
            >
              {status.type === 'success' && <CheckCircle size={14} />}
              {status.message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl text-sm font-bold hover:bg-indigo-700 disabled:opacity-60 active:scale-95 transition-all"
          >
            {loading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Create Account'}
          </button>
        </form>

        <div className="mt-5 text-center text-xs text-slate-500">
          {mode === 'login' ? (
            <>
              Naya account?{' '}
              <button onClick={() => switchMode('signup')} className="text-indigo-600 font-semibold hover:underline">
                Signup karein
              </button>
            </>
          ) : (
            <>
              Pehle se account hai?{' '}
              <button onClick={() => switchMode('login')} className="text-indigo-600 font-semibold hover:underline">
                Login karein
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
