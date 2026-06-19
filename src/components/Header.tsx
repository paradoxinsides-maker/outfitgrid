import { useState, useEffect } from 'react';
import { Search, X, ShoppingBag, User, LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import type { SiteConfig, CustomerLead } from '../types';
import { getLoggedInCustomer, logoutCustomer } from '../lib/store';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  config: SiteConfig;
  onAccountClick?: () => void;
  showSearch?: boolean;
  onLogout?: () => void;
}

export default function Header({
  searchQuery,
  onSearchChange,
  config,
  onAccountClick,
  showSearch = true,
  onLogout,
}: HeaderProps) {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');
  const [customer, setCustomer] = useState<CustomerLead | null>(null);

  useEffect(() => {
    setCustomer(getLoggedInCustomer());
  }, []);

  const handleCustomerLogout = () => {
    logoutCustomer();
    setCustomer(null);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm">
      <div className="bg-slate-900 text-white text-[10px] sm:text-xs text-center py-1.5 px-4 truncate">
        {config.headerAnnouncement}
      </div>

      <div className="max-w-5xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden bg-white border border-slate-100 shadow-sm">
              <img
                src={config.logo}
                alt={config.brandName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/logo.png';
                }}
              />
            </div>
            <span className="font-extrabold text-sm sm:text-lg text-slate-900 tracking-tight hidden sm:block uppercase">
              {config.brandName}
            </span>
          </Link>

          {showSearch && (
            <div className="flex-1 max-w-md relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Product search karein..."
                className="w-full pl-10 pr-4 py-2 rounded-full bg-slate-100 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          )}

          <div className="flex items-center gap-1 shrink-0">
            {!isAdminPage ? (
              <>
                <button
                  onClick={onAccountClick}
                  className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-100"
                  aria-label="Account"
                >
                  <User size={20} />
                  <span className="text-xs font-medium hidden sm:inline">
                    {customer ? customer.name.split(' ')[0] : 'Login'}
                  </span>
                </button>
                {customer && (
                  <button
                    onClick={handleCustomerLogout}
                    className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                    title="Logout"
                  >
                    <LogOut size={18} />
                  </button>
                )}
              </>
            ) : (
              <button
                onClick={onLogout}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-white"
              >
                <LogOut size={16} />
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
