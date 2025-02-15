import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { UserProvider } from "./utils/Auth";
import { ThemeProvider } from "./utils/ThemeProvider";
import Navbar from './utils/Navbar';
import { Toaster } from "sonner";
const poppins = Poppins({ subsets: ["latin"], weight: "400" });
// const jost = Jost({ subsets: ["latin"] });

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={poppins.className} suppressHydrationWarning={true}>
        <UserProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
          >

            <Navbar />
            <Toaster/>
            <div className="p-2 md:p-5">
              {children}
            </div>



          </ThemeProvider>
        </UserProvider>
      </body>

    </html>
  );
}
