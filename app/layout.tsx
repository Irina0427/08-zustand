
import type { ReactNode } from "react";

import TanStackProvider from "@/components/TanStackProvider/TanStackProvider";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";

import "@/app/globals.css";

export const metadata = {
  title: "NoteHub",
  description: "Manage your notes efficiently",
};

type RootLayoutProps = {
  children: ReactNode;
  modal?: ReactNode;
};

export default function RootLayout({ children, modal }: RootLayoutProps) {
  return (
<html lang="en">
  <body>
    <TanStackProvider>
      <Header />
      <main className="content">
        {children}
        {modal ?? null}
      </main>
      <Footer />
    </TanStackProvider>
  </body>
</html>
  );
}
