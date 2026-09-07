'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';

// Pages where we hide the top navbar (either because they have a sidebar, or they are standalone fullscreen pages)
const HIDDEN_NAVBAR_PAGES = ['/dashboard', '/project', '/login'];

export function ConditionalNavbar() {
  const pathname = usePathname();
  
  // Hide navbar on pages that should not have it
  const hideNavbar = HIDDEN_NAVBAR_PAGES.some((page) => pathname.startsWith(page));
  
  if (hideNavbar) return null;
  
  return <Navbar />;
}
