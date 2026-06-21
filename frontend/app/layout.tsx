import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ServiceHub BD — Find Trusted Services Near You',
  description: 'Multi-vendor service marketplace for Bangladesh',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">{children}</body>
    </html>
  );
}
