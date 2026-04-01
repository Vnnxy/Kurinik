import {
    Menu, MenuButton, MenuItem, MenuItems,
  } from '@headlessui/react'
  import { UserCircleIcon } from '@heroicons/react/24/outline'
import { useState, useEffect } from 'react';
  import { Link, useLocation, useNavigate } from 'react-router-dom'; 
  
  const navigation = [
    { name: 'Pacientes', href: '/', current: true },
    { name: 'Fármacos', href: '/farmacos', current: false },
  ]

  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }
  
  export default function Sidebar({ children }) {
    const location = useLocation();
    const [logoSrc, setLogoSrc] = useState(
    'https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500');

    useEffect(() => {
      const loadCustomLogo = async () => {
        // Check if window.electron is available (Electron context)
        if (window.electron && typeof window.electron.invoke === 'function') {
          try {
            const result = await window.electron.invoke('get-custom-logo');
            if (result.success && result.dataUrl) {
              setLogoSrc(result.dataUrl); 
            } else {
              console.log(result.error); 
            }
          } catch (error) {
            console.error('Error invoking get-custom-logo:', error);
        
          }
        } else {
          console.warn('Electron IPC not available. Running in browser or preload not configured.');
          
        }
      };

    loadCustomLogo();
  }, []);

    const navigate = useNavigate()


    return (
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <aside className="w-44 bg-gray-800 text-white flex flex-col flex-shrink-0">
          <div className="flex items-center justify-center h-16 border-b border-gray-700">
            <img
              alt="Logo"
              src={logoSrc}
              className="h-8 w-auto"
            />
          </div>
          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item) => (
               <Link 
              key={item.name}
              to={item.href} 
              className={classNames(
                // Determine if the current item is active
                location.pathname === item.href 
                  ? 'bg-gray-900 text-white' // Active style
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white', // Inactive style
                'block rounded-md px-4 py-2 text-sm font-medium'
              )}
            >
                {item.name}
              </Link>
            ))}
          </nav>
          <div className="p-4 border-t border-gray-700">
            {/* Profile Menu */}
            <button
              onClick={()=>{navigate('/settings')}} // Call the navigation function
              className="flex items-center space-x-2 text-sm text-gray-300 hover:text-gray-100 focus:outline-none" // Added focus:outline-none for better accessibility/styling
            >
              <UserCircleIcon className="w-6 h-6" />
              <span>Perfil</span>
            </button>
          </div>
        </aside>
  
        {/* Main content */}
        <main className="flex-1  overflow-y-auto">{children}</main>
      </div>
    )
  }
  