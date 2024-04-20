import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";


import "./globals.css";
import { ThemeProvider } from "../providers/theme-provider";
import ModalProvider from "../providers/modal-provider"
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";

const dmSans = DM_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Omega",
  description: "All in one Agency Solution",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={dmSans.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ModalProvider>
            <Toaster />
            <SonnerToaster richColors/>
            {children}
          </ModalProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}