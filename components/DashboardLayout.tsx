import { ReactNode } from "react";

import ModalProvider from "./ModalProvider";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import ToasterProvider from "./ToasterProvider";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <>
      <ModalProvider />
      <ToasterProvider />

      <div className="h-full relative">
        <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 bg-gray-900">
          <Sidebar />
        </div>

        <main className="md:pl-72">
          <Navbar />
          {children}
        </main>
      </div>
    </>
  );
};

export default DashboardLayout;
