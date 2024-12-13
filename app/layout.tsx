import './globals.css';
import 'react-quill/dist/quill.snow.css';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/lib/context/AuthContext';
import Navigation from '@/components/layout/Navigation';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Blog Platform',
  description: 'A modern blogging platform built with Next.js',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <AuthProvider>
          <Navigation />
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
