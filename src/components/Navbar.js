'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Navbar.module.css';
import SubscribeModal from './SubscribeModal';

const NAV_LINKS = [
  { href: '/about', label: 'About Us' },
  { href: '/team', label: 'Our Team' },
  { href: '/activities', label: 'Activities' },
  { href: '/partners', label: 'Partners' },
  { href: '/events', label: 'Events' },
  { href: '/blogs', label: 'Blogs' },
  { href: '/contact', label: 'Contact' },
  { href: '/connect', label: 'Connect' },
];

const Navbar = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <>
      <nav className={styles.navbar}>
        <div className={`${styles.container} container`}>
          <Link href="/" className={styles.logo}>
            <img src="/images/logo.jpg" alt="Khaana Bank Trust" className={styles.navLogo} onError={(e) => e.target.style.display = 'none'} />
            <span className={styles.logoText}>Khaana<span className={styles.accent}>Bank</span></span>
            <span className={styles.subLogo}>Trust</span>
          </Link>
          
          {/* Desktop nav links */}
          <div className={styles.navLinks}>
            {NAV_LINKS.map(link => (
              <Link key={link.href} href={link.href}>{link.label}</Link>
            ))}
          </div>

          {/* Desktop actions */}
          <div className={styles.actions}>
            <Link href="/admin/login" className={`${styles.supportBtn} btn-secondary-sm`}>
              Admin
            </Link>
            <Link href="/support" className={`${styles.supportBtn} btn-secondary-sm`}>
              <span className={styles.supportTextPrimary}>Support Us</span>
              <span className={styles.supportTextHover}>Donate Us</span>
            </Link>
            <button 
              className={`${styles.subscribeBtn} btn btn-primary`}
              onClick={() => setModalOpen(true)}
            >
              Subscribe Us
            </button>
          </div>

          {/* Hamburger button — mobile only */}
          <button
            className={`${styles.hamburger} ${menuOpen ? styles.hamburgerOpen : ''}`}
            onClick={() => setMenuOpen(prev => !prev)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            <span className={styles.hamburgerLine} />
            <span className={styles.hamburgerLine} />
            <span className={styles.hamburgerLine} />
          </button>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      <div className={`${styles.mobileOverlay} ${menuOpen ? styles.mobileOverlayOpen : ''}`} onClick={() => setMenuOpen(false)} />
      <div className={`${styles.mobileMenu} ${menuOpen ? styles.mobileMenuOpen : ''}`}>
        <div className={styles.mobileMenuInner}>
          <div className={styles.mobileNavLinks}>
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`${styles.mobileNavLink} ${pathname === link.href ? styles.mobileNavLinkActive : ''}`}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className={styles.mobileDivider} />

          <div className={styles.mobileActions}>
            <Link href="/admin/login" className={styles.mobileActionBtn} onClick={() => setMenuOpen(false)}>
              🔐 Admin Panel
            </Link>
            <Link href="/support" className={styles.mobileDonateBtn} onClick={() => setMenuOpen(false)}>
              ❤️ Support / Donate Us
            </Link>
            <button
              className={styles.mobileSubscribeBtn}
              onClick={() => { setMenuOpen(false); setTimeout(() => setModalOpen(true), 300); }}
            >
              📬 Subscribe to Updates
            </button>
          </div>
        </div>
      </div>

      <SubscribeModal 
        isOpen={isModalOpen} 
        onClose={() => setModalOpen(false)} 
      />
    </>
  );
};

export default Navbar;
