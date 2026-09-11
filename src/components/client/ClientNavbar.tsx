import React, { useState, useEffect } from 'react';
import { Compass, Menu, X, Search, CloudSun, Lock, Ticket } from 'lucide-react';
import { RealTimeNotificationCenter } from '../common/RealTimeNotificationCenter';

interface ClientNavbarProps {
  onOpenBooking: (packageId?: string) => void;
  onOpenTracker: () => void;
  onOpenAdminAuth?: () => void;
  onOpenWeatherRadar?: () => void;
  isStaffLoggedIn?: boolean;
  onOpenAdminPortal?: () => void;
}

export const ClientNavbar: React.FC<ClientNavbarProps> = ({
  onOpenBooking,
  onOpenTracker,
  onOpenWeatherRadar,
  onOpenAdminAuth,
  isStaffLoggedIn,
  onOpenAdminPortal,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const [logoTapCount, setLogoTapCount] = useState(0);

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    scrollToSection('hero');

    // Mobile Easter Egg 1: Rapidly tapping brand logo 5 times unlocks/triggers Admin Authentication
    const nextCount = logoTapCount + 1;
    setLogoTapCount(nextCount);

    if (nextCount >= 5) {
      setLogoTapCount(0);
      if (navigator.vibrate) {
        navigator.vibrate([40, 60, 40]);
      }
      if (isStaffLoggedIn && onOpenAdminPortal) {
        onOpenAdminPortal();
      } else if (onOpenAdminAuth) {
        onOpenAdminAuth();
      }
    } else {
      // Reset counter if taps are separated by more than 2 seconds
      setTimeout(() => {
        setLogoTapCount(0);
      }, 2000);
    }
  };

  return (
    <header
      id="main-navigation"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'glass-obsidian-nav py-4 shadow-2xl'
          : 'bg-gradient-to-b from-[#070B0E]/90 via-[#070B0E]/40 to-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 flex items-center justify-between">
        {/* Brand Logo with Compass Icon & Secret Discreet Multi-click Staff Ingress */}
        <a
          href="#hero"
          onClick={(e) => {
            e.preventDefault();
            handleLogoClick(e);
          }}
          className="flex items-center gap-3 group focus:outline-none cursor-pointer select-none"
          id="brand-logo-link"
          title="Holiday Travelers Travel and Tours Inc."
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sunset-coral/20 to-sunset-coral/10 border border-sunset-coral/60 flex items-center justify-center text-sunset-coral group-hover:scale-105 group-hover:border-sunset-coral transition-all duration-300 shadow-md shadow-sunset-coral/10">
            <Compass className="w-5 h-5 group-hover:rotate-45 transition-transform duration-500" />
          </div>
          <div className="flex flex-col">
            <span className="font-serif-display text-xl sm:text-2xl text-ivory tracking-wide font-normal leading-tight">
              Holiday Travelers
            </span>
            <span className="text-[10px] font-sans-body tracking-[0.2em] uppercase text-sand-muted font-light">
              Travel & Tours Inc.
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
          <button
            onClick={() => scrollToSection('specialties')}
            className="text-sm font-sans-body text-sand-muted hover:text-ivory transition-colors tracking-wide"
            id="nav-services-btn"
          >
            Services
          </button>
          <a
            href="https://www.facebook.com/share/p/1DrMyBougo/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-sans-body text-cyan-300 hover:text-cyan-200 transition-colors tracking-wide flex items-center gap-1.5"
            id="nav-visa-fb-btn"
            title="Inquire about Visa & Passport on official Facebook post"
          >
            <span>Visa Inquiries</span>
            <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">FB</span>
          </a>
          <button
            onClick={() => scrollToSection('destinations')}
            className="text-sm font-sans-body text-sand-muted hover:text-ivory transition-colors tracking-wide"
            id="nav-destinations-btn"
          >
            Destinations
          </button>
          <button
            onClick={() => scrollToSection('expeditions')}
            className="text-sm font-sans-body text-sand-muted hover:text-ivory transition-colors tracking-wide"
            id="nav-journeys-btn"
          >
            Packages
          </button>
          <button
            onClick={() => scrollToSection('reviews')}
            className="text-sm font-sans-body text-sand-muted hover:text-ivory transition-colors tracking-wide"
            id="nav-reviews-btn"
          >
            Reviews
          </button>
          {onOpenWeatherRadar && (
            <button
              onClick={onOpenWeatherRadar}
              className="text-sm font-sans-body text-cyan-300 hover:text-cyan-200 transition-colors tracking-wide flex items-center gap-1.5"
              id="nav-weather-radar-btn"
            >
              <CloudSun className="w-4 h-4 text-cyan-400" />
              Weather
            </button>
          )}
          <button
            onClick={onOpenTracker}
            className="text-sm font-sans-body text-sand-muted hover:text-ivory transition-colors tracking-wide flex items-center gap-1.5 active:scale-95"
            id="nav-track-btn"
            title="Check Tickets & Live Travel Status"
          >
            <Ticket className="w-3.5 h-3.5 text-sunset-coral" />
            <span>Check Tickets</span>
          </button>
        </nav>

        {/* Action CTAs */}
        <div className="hidden md:flex items-center gap-3">
          {/* Real-time notification center */}
          <RealTimeNotificationCenter onOpenTracker={onOpenTracker} />

          {isStaffLoggedIn && (
            <button
              onClick={onOpenAdminPortal}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-medium bg-sunset-coral/15 hover:bg-sunset-coral/25 text-sunset-coral border border-sunset-coral/40 transition-all shadow-sm"
              title="Open Admin Operations Tower"
              id="nav-admin-portal-active-btn"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Admin Portal</span>
            </button>
          )}

          <button
            onClick={() => onOpenBooking()}
            className="group relative inline-flex items-center justify-center gap-2 bg-sunset-coral hover:bg-[#ff765b] text-white px-7 py-3 rounded-full text-xs font-semibold tracking-[0.15em] uppercase shadow-xl shadow-sunset-coral/30 hover:shadow-sunset-coral/50 hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 border border-white/10"
            id="nav-begin-journey-btn"
          >
            <span>Begin Journey</span>
            <span className="w-1.5 h-1.5 rounded-full bg-white/80 group-hover:bg-white animate-pulse" />
          </button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex md:hidden items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-ivory p-2 rounded-lg hover:bg-white/5 focus:outline-none"
            aria-label="Toggle Navigation Menu"
            id="mobile-menu-toggle-btn"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-obsidian border-b border-white/10 px-6 py-6 mt-3 space-y-4">
          <button
            onClick={() => scrollToSection('specialties')}
            className="block w-full text-left py-2 text-ivory text-base font-serif-display"
          >
            Agency Services
          </button>
          <a
            href="https://www.facebook.com/share/p/1DrMyBougo/"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMobileMenuOpen(false)}
            className="block w-full text-left py-2 text-cyan-300 text-base font-serif-display flex items-center justify-between"
          >
            <span>Visa & Passport Inquiries</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">FB Page</span>
          </a>
          <button
            onClick={() => scrollToSection('destinations')}
            className="block w-full text-left py-2 text-ivory text-base font-serif-display"
          >
            Islands & Destinations
          </button>
          <button
            onClick={() => scrollToSection('expeditions')}
            className="block w-full text-left py-2 text-ivory text-base font-serif-display"
          >
            Tour Packages
          </button>
          <button
            onClick={() => scrollToSection('reviews')}
            className="block w-full text-left py-2 text-ivory text-base font-serif-display"
          >
            Client Reviews
          </button>
          {onOpenWeatherRadar && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenWeatherRadar();
              }}
              className="block w-full text-left py-2 text-cyan-300 text-base font-sans-body flex items-center gap-2"
            >
              <CloudSun className="w-4 h-4 text-cyan-400" />
              Global Weather Radar
            </button>
          )}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenTracker();
            }}
            className="block w-full text-left py-2 text-sunset-coral text-base font-sans-body flex items-center gap-2"
          >
            <Ticket className="w-4 h-4 text-sunset-coral" />
            <span>Check Tickets</span>
          </button>

          {isStaffLoggedIn ? (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenAdminPortal) onOpenAdminPortal();
              }}
              className="block w-full text-left py-2 text-sunset-coral text-base font-sans-body flex items-center gap-2"
            >
              <Lock className="w-4 h-4" />
              Enter Admin Portal
            </button>
          ) : (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenAdminAuth) onOpenAdminAuth();
              }}
              className="block w-full text-left py-2 text-sand-muted hover:text-ivory text-base font-sans-body flex items-center gap-2"
            >
              <Lock className="w-4 h-4" />
              Staff & Operator Login
            </button>
          )}

          <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBooking();
              }}
              className="w-full bg-sunset-coral text-white py-3 rounded-full text-sm font-medium tracking-wide text-center"
            >
              Begin Journey
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
