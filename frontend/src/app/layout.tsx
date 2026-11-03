import type { Metadata } from 'next';
import './globals.css';
import { NotificationProvider } from '@/lib/notifications-context';
import { ConditionalNavbar } from '@/components/ConditionalNavbar';
import { ThemeProvider } from '@/components/ThemeProvider';

export const metadata: Metadata = {
  title: 'WiiBuild Platform — Build Together with AI',
  description:
    'A collaborative platform where teams build projects using different AI tools, each contributing modules that merge into one working application.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
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
