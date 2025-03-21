import './globals.css';
import type { Metadata } from 'next';
import { LocalStorageProvider } from '@/components/LocalStorageProvider';

export const metadata: Metadata = {
  title: 'Project Planner',
  description: 'A simple project planning tool',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <LocalStorageProvider>
          {children}
        </LocalStorageProvider>
      </body>
    </html>
  )
}
