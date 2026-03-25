import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Khaana Bank Trust - Serving Humanity through Nutrition & Care",
  description: "Official website of Khaana Bank Trust, an NGO dedicated to food distribution, blood donation, education, and environmental conservation.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main style={{ marginTop: 'var(--header-height)', minHeight: 'calc(100vh - var(--header-height))' }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
