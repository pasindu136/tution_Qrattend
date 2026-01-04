import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import MobileAppEntry from "@/components/MobileAppEntry";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-blue-100">

      {/* Mobile App Splash & Redirect */}
      <MobileAppEntry />

      {/* 1. Navigation Bar */}
      <Navbar />

      {/* 2. Main Banner Section */}
      <Hero />

      {/* 3. Features Grid */}
      <Features />

      {/* 4. Contact Us Section */}
      <Contact />

      {/* 5. Footer */}
      <Footer />

    </div>
  );
}