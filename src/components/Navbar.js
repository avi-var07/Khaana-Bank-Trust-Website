'use client';
import { useState } from 'react';
import Link from 'next/link';
import styles from './Navbar.module.css';
import SubscribeModal from './SubscribeModal';

const Navbar = () => {
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <>
      <nav className={styles.navbar}>
        <div className={`${styles.container} container`}>
          <Link href="/" className={styles.logo}>
            <img src="/images/logo.jpg" alt="Khaana Bank Trust" className={styles.navLogo} onError={(e) => e.target.style.display = 'none'} />
            <span className={styles.logoText}>Khaana<span className={styles.accent}>Bank</span></span>
            <span className={styles.subLogo}>Trust</span>
          </Link>
          
          <div className={styles.navLinks}>
            <Link href="/about">About Us</Link>
            <Link href="/team">Our Team</Link>
            <Link href="/activities">Activities</Link>
            <Link href="/partners">Partners</Link>
            <Link href="/events">Events</Link>
            <Link href="/blogs">Blogs</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/connect">Connect</Link>
          </div>

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
        </div>
      </nav>
      
      <SubscribeModal 
        isOpen={isModalOpen} 
        onClose={() => setModalOpen(false)} 
      />
    </>
  );
};

export default Navbar;
