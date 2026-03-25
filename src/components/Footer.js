import Link from 'next/link';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.grid}>
          <div className={styles.brand}>
            <Link href="/" className={styles.logo}>
              <span className={styles.logoText}>Khaana<span className={styles.accent}>Bank</span></span>
              <span className={styles.subLogo}>Trust</span>
            </Link>
            <p className={styles.description}>
              Dedicated to serving the needy through food distribution, blood donation, education, and environmental conservation. <br />
              <strong>Contact: Mr. Ankit Tripathi <br /> 
              <a href="https://wa.me/918840775823" style={{color: '#25D366'}}>📞/💬 +91 8840775823 (WhatsApp)</a></strong>
            </p>
          </div>
          
          <div className={styles.links}>
            <h4>Quick Links</h4>
            <ul>
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/activities">Our Activities</Link></li>
              <li><Link href="/events">Events & Awards</Link></li>
              <li><Link href="/support">Support Us</Link></li>
            </ul>
          </div>

          <div className={styles.social}>
            <h4>Connect With Us</h4>
            <div className={styles.icons}>
              {/* Icons will be added here later */}
              <a href="#" className={styles.icon}>Ig</a>
              <a href="#" className={styles.icon}>Fb</a>
              <a href="#" className={styles.icon}>Yt</a>
              <a href="#" className={styles.icon}>Tw</a>
            </div>
            <Link href="/contact" className={styles.contactBtn}>Get In Touch</Link>
          </div>
        </div>
        
        <div className={styles.bottom}>
          <p>&copy; {new Date().getFullYear()} Khaana Bank Trust. All Rights Reserved.</p>
          <div className={styles.legal}>
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
