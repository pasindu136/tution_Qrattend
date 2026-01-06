import { Inter, Noto_Sans_Sinhala } from "next/font/google";
import "./globals.css";
import PWAInstallPrompt from "@/components/PWAInstallPrompt"; // Import

const inter = Inter({ subsets: ["latin"] });
const notoSansSinhala = Noto_Sans_Sinhala({ subsets: ["sinhala"] });

export const metadata = {
  title: "TuitionMate - Manage Your Classes",
  description: "The ultimate student management system for tutors.",
  manifest: '/manifest.json',
};

export const viewport = {
  themeColor: '#1e40af',
  viewportFit: 'cover',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // Prevents zooming on inputs which feels more 'native'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${notoSansSinhala.className}`}>
        {children}
        <PWAInstallPrompt />
      </body>
    </html>
  );
}
