import { useState } from 'react';
import Header from '../components/Header/Header';
import HeroSection from '../components/Hero/HeroSection';
import DestinationCards from '../components/Destinations/DestinationCards';
import InteractiveMap from '../components/Map/InteractiveMap';
import PackageGrid from '../components/Packages/PackageGrid';
import WhyChooseUs from '../components/WhyChooseUs/WhyChooseUs';
import PhotoGallery from '../components/Gallery/PhotoGallery';
import TestimonialCarousel from '../components/Testimonials/TestimonialCarousel';
import GuideCards from '../components/Team/GuideCards';
import BlogSection from '../components/Blog/BlogSection';
import ContactForm from '../components/Contact/ContactForm';
import Footer from '../components/Footer/Footer';
import BookingModal from '../components/Common/BookingModal';
import AIPlanner from '../components/Common/AIPlanner';
import ChatWidget from '../components/Common/ChatWidget';
import AuthModal from '../components/Auth/AuthModal';
import '../components/Common/Modal.css';
import '../components/Common/ChatWidget.css';
import '../components/Auth/AuthModal.css';

const Home = () => {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isAIPlannerOpen, setIsAIPlannerOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);

  const handleOpenBooking = (packageData = null) => {
    setSelectedPackage(packageData);
    setIsBookingModalOpen(true);
  };

  const handleCloseBooking = () => {
    setIsBookingModalOpen(false);
    setSelectedPackage(null);
  };

  const handleOpenAIPlanner = () => {
    setIsAIPlannerOpen(true);
  };

  const handleCloseAIPlanner = () => {
    setIsAIPlannerOpen(false);
  };

  const handleOpenAuth = () => {
    setIsAuthModalOpen(true);
  };

  const handleCloseAuth = () => {
    setIsAuthModalOpen(false);
  };

  const handlePlannerComplete = (recommendation) => {
    setIsAIPlannerOpen(false);
    if (recommendation) {
      setSelectedPackage(recommendation);
      setIsBookingModalOpen(true);
    }
  };

  return (
    <div className="app">
      <Header 
        onOpenAIPlanner={handleOpenAIPlanner} 
        onOpenBooking={handleOpenBooking}
        onOpenAuth={handleOpenAuth}
      />
      <main>
        <HeroSection onOpenBooking={handleOpenBooking} onOpenAIPlanner={handleOpenAIPlanner} />
        <DestinationCards />
        <InteractiveMap />
        <PackageGrid onBookPackage={handleOpenBooking} />
        <WhyChooseUs />
        <PhotoGallery />
        <TestimonialCarousel />
        <GuideCards />
        <BlogSection />
        <ContactForm />
      </main>
      <Footer />

      {/* Modals */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={handleCloseBooking}
        onOpenAuth={handleOpenAuth}
        selectedPackage={selectedPackage}
      />

      <AIPlanner
        isOpen={isAIPlannerOpen}
        onClose={handleCloseAIPlanner}
        onComplete={handlePlannerComplete}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={handleCloseAuth}
      />

      {/* Live Chat Widget */}
      <ChatWidget />
    </div>
  );
};

export default Home;
