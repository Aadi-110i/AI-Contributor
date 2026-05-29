import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { NotificationProvider } from '@/lib/notifications-context';
import { ConditionalNavbar } from '@/components/ConditionalNavbar';
import { ThemeProvider } from '@/components/ThemeProvider';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: 'WiiBuild Platform — Build Together with AI',
  description:
    'A collaborative platform where teams build projects using different AI tools, each contributing modules that merge into one working application.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <NotificationProvider>
            <ConditionalNavbar />
            <main style={{ position: 'relative', minHeight: '100vh' }}>
              {children}
            </main>
          </NotificationProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
