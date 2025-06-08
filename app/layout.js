import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import { ThemeProvider } from "../context/ThemeContext";
import AuthCheck from "@/components/Auth/AuthCheck";
import MainLayout from "@/components/Layout/MainLayout";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Expense Tracker",
  description: "This site is developed by Gurpreet Singh.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <AuthProvider>
            <AuthCheck>
              <MainLayout>
                {children}
                <Toaster position="top-right" />
              </MainLayout>
            </AuthCheck>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}