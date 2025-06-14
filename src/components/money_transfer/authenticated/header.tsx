import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Settings, Bell, Menu } from 'lucide-react';

const DashboardNavigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  const navigationItems = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Payments', href: '/payments' },
    { name: 'Analytics', href: '/analytics' },
    { name: 'Cards', href: '/cards' },
    { name: 'History', href: '/history' },
    { name: 'Services', href: '/services' },
    { name: 'Help', href: '/help' },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const isActiveLink = (href:any) => {
    return router.pathname === href;
  };

  return (
    <nav className="bg-white rounded-2xl shadow-lg p-4 lg:p-6 mb-5 relative">
      <div className="flex items-center justify-between w-full">
        {/* Left Section */}
        <div className="flex items-center gap-6 lg:gap-10 flex-1">
          {/* Logo */}
          <Link href="/dashboard">
            <a className="flex items-center gap-2 font-semibold text-lg">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-400 rounded-lg flex items-center justify-center font-bold text-sm text-white">
                GF
              </div>
            </a>
          </Link>
          
          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center gap-6 lg:gap-8 list-none">
            {navigationItems.map((item) => (
              <li key={item.name} className="relative">
                <Link href={item.href}>
                  <a 
                    className={`text-slate-500 font-medium text-sm lg:text-base py-2 transition-colors duration-200 relative hover:text-blue-500 ${
                      isActiveLink(item.href) ? 'text-blue-500' : ''
                    }`}
                  >
                    {item.name}
                    {isActiveLink(item.href) && (
                      <span className="absolute -bottom-4 left-0 right-0 h-0.5 bg-blue-500 rounded-full"></span>
                    )}
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3 lg:gap-4">
          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-lg transition-colors duration-200 hover:bg-slate-100"
          >
            <Menu size={20} />
          </button>

          {/* Settings Button */}
          <button className="p-2 rounded-lg transition-colors duration-200 hover:bg-slate-100">
            <Settings size={20} />
          </button>

          {/* Notification Button */}
          <button className="relative p-2 rounded-lg transition-colors duration-200 hover:bg-slate-100">
            <Bell size={20} />
            <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></div>
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-3 cursor-pointer p-1 lg:p-2 rounded-xl transition-colors duration-200 hover:bg-slate-100">
            <span className="hidden sm:block font-medium text-slate-800 text-sm lg:text-base">Mathieu</span>
            <div className="w-8 h-8 lg:w-9 lg:h-9 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
              M
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-25 z-40 md:hidden"
            onClick={closeMobileMenu}
          ></div>
          
          {/* Mobile Menu Content */}
          <div className="absolute top-full left-0 right-0 bg-white rounded-xl shadow-xl mt-2 p-4 z-50 md:hidden">
            <ul className="flex flex-col gap-4 list-none">
              {navigationItems.map((item) => (
                <li key={item.name}>
                  <Link href={item.href}>
                    <a 
                      onClick={closeMobileMenu}
                      className={`block text-slate-500 font-medium text-base p-3 rounded-lg transition-all duration-200 hover:text-blue-500 hover:bg-blue-50 ${
                        isActiveLink(item.href) ? 'text-blue-500 bg-blue-50' : ''
                      }`}
                    >
                      {item.name}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
            
            {/* Mobile User Section */}
            <div className="pt-4 mt-4 border-t border-slate-200">
              <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors duration-200">
                <div className="w-9 h-9 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  M
                </div>
                <span className="font-medium text-slate-800">Mathieu</span>
              </div>
            </div>
          </div>
        </>
      )}
    </nav>
  );
};

export default DashboardNavigation;