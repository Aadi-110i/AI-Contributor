'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';

// Pages where the sidebar handles navigation, so we hide the top navbar
const SIDEBAR_PAGES = ['/dashboard', '/project'];

export function ConditionalNavbar() {
  const pathname = usePathname();
  
  // Hide navbar on pages that use the sidebar layout
  const hasSidebar = SIDEBAR_PAGES.some((page) => pathname.startsWith(page));
  
  if (hasSidebar) return null;
  
  return <Navbar />;
}
