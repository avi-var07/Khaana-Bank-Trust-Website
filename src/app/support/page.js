'use client';
import { useState } from 'react';

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function SupportPage() {
  const [view, setView] = useState('support'); // 'support' or 'donate'
  const [loading, setLoading] = useState(false);
  const [customAmount, setCustomAmount] = useState('');

  const handleDonate = async (amount) => {
    const finalAmount = amount || customAmount;
    if (!finalAmount || isNaN(finalAmount)) {
      alert('Please enter a valid amount');
      return;
    }

    setLoading(true);
    try {
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        alert('Razorpay SDK failed to load. Are you online?');
        setLoading(false);
        return;
      }

      const res = await fetch('/api/donate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: finalAmount })
      });
      
      const data = await res.json();
      
      if (res.status === 501) {
        alert(data.error);
        setLoading(false);
        return;
      }

      const options = {
        key: data.key_id,
        amount: data.amount,
        currency: data.currency,
        name: "Khaana Bank Trust",
        description: "Donation for social initiatives",
        order_id: data.id,
        handler: function (response) {
          alert(`Payment Successful! Payment ID: ${response.razorpay_payment_id}`);
          window.location.href = '/support?success=true';
        },
        prefill: {
          name: "Donor",
          email: "donor@khaanabanktrust",
          contact: "8840775823"
        },
        theme: {
          color: "#ff5e14" // NGO primary color
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } catch (err) {
      console.error(err);
      alert('Connection error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="support-page">
      <section className="page-header">
        <div className="container">
          <h1>{view === 'support' ? 'Support Us' : 'Donate Us'}</h1>
          <p>Your contribution directly impacts lives on the ground.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="toggle-wrapper">
            <div className={`active-bg ${view}`}></div>
            <button 
              className={`toggle-btn ${view === 'support' ? 'active' : ''}`}
              onClick={() => setView('support')}
            >
              Support Us Info
            </button>
            <button 
              className={`toggle-btn ${view === 'donate' ? 'active' : ''}`}
              onClick={() => setView('donate')}
            >
              Donate Now
            </button>
          </div>

          <div className="content-area glass-card fade-in" key={view}>
            {view === 'support' ? (
              <div className="support-info">
                <h2>Ways to Support</h2>
                <div className="info-grid">
                  <div className="info-item">
                    <h3>Bank Transfer</h3>
                    <p>You can donate directly to our NGO bank account:</p>
                    <div className="bank-details">
                      <p><strong>Account Name:</strong> Khaana Bank</p>
                      <p><strong>Bank:</strong> Punjab National Bank</p>
                      <p><strong>Account Number:</strong> 1375100100003551</p>
                      <p><strong>IFSC Code:</strong>PUNB0137510 </p>
                      <p><strong>Branch:</strong>Mughalsarai </p>
                    </div>
                  </div>
                  <div className="info-item">
                    <h3>In-Kind Donations</h3>
                    <p>We accept raw food materials, clothes, medicines, and educational kits.</p>
                    <p>Please contact us at <strong>+91 8840775823</strong> to schedule a pickup or drop-off.</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="donate-area text-center">
                <h2>Make an Online Donation</h2>
                <p>Fast, secure, and direct impact through Razorpay.</p>
                <div className="donation-options">
                  <div className="option-card">
                    <div className="amount">₹500</div>
                    <p>Provides 10 daily meals</p>
                    <button className="btn btn-primary" onClick={() => handleDonate(500)} disabled={loading}>
                      {loading ? 'Processing...' : 'Process Donation'}
                    </button>
                  </div>
                  <div className="option-card">
                    <div className="amount">₹1500</div>
                    <p>Sponsors a child's education for a month</p>
                    <button className="btn btn-primary" onClick={() => handleDonate(1500)} disabled={loading}>
                      {loading ? 'Processing...' : 'Process Donation'}
                    </button>
                  </div>
                  <div className="option-card">
                    <div className="amount">₹5000</div>
                    <p>Organizes 1 Blood Donation Camp</p>
                    <button className="btn btn-primary" onClick={() => handleDonate(5000)} disabled={loading}>
                      {loading ? 'Processing...' : 'Process Donation'}
                    </button>
                  </div>
                </div>
                <div className="custom-donate">
                  <p>Or enter a custom amount</p>
                  <div className="input-group">
                     <span>₹</span>
                     <input 
                       type="number" 
                       placeholder="Enter amount" 
                       value={customAmount}
                       onChange={(e) => setCustomAmount(e.target.value)}
                     />
                     <button className="btn btn-primary" onClick={() => handleDonate()} disabled={loading}>
                       {loading ? '...' : 'Donate'}
                     </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <style jsx>{`
        .page-header {
          padding: 80px 0;
          background: linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?q=80&w=2070') center/cover;
          color: white;
          text-align: center;
        }

        .page-header h1 { font-size: 3.5rem; margin-bottom: 10px; transition: var(--transition); }
        .page-header p { font-size: 1.2rem; opacity: 0.9; }

        .section { padding: 60px 0 100px; }

        .toggle-wrapper {
          display: flex;
          background: #eee;
          padding: 5px;
          border-radius: 50px;
          width: fit-content;
          margin: 0 auto 60px;
          position: relative;
        }

        .toggle-btn {
          padding: 12px 30px;
          border-radius: 50px;
          border: none;
          background: transparent;
          font-weight: 700;
          cursor: pointer;
          position: relative;
          z-index: 2;
          transition: var(--transition);
        }

        .toggle-btn.active { color: white; }
        
        .active-bg {
          position: absolute;
          top: 5px;
          bottom: 5px;
          width: calc(50% - 5px);
          background: var(--primary);
          border-radius: 50px;
          transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          z-index: 1;
        }

        .active-bg.donate { transform: translateX(100%); }

        .content-area { padding: 60px; }

        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; margin-top: 40px; }
        .bank-details { background: rgba(0,0,0,0.03); padding: 30px; border-radius: 12px; margin-top: 20px; }
        .bank-details p { margin-bottom: 10px; }

        .donation-options {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 30px;
          margin: 40px 0;
        }

        .option-card {
          padding: 40px 20px;
          border: 1px solid #eee;
          border-radius: 15px;
          transition: var(--transition);
        }

        .option-card:hover { border-color: var(--primary); transform: translateY(-5px); }
        .amount { font-size: 2.5rem; font-weight: 800; color: var(--primary); margin-bottom: 10px; }

        .custom-donate { margin-top: 60px; border-top: 1px solid #eee; padding-top: 60px; }
        .input-group { 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          gap: 15px; 
          margin-top: 20px; 
        }

        .input-group span { font-size: 1.5rem; font-weight: 700; }
        .input-group input { padding: 12px 20px; border: 2px solid #eee; border-radius: 8px; font-size: 1.1rem; width: 200px; outline: none; }
        .input-group input:focus { border-color: var(--primary); }

        .text-center { text-align: center; }

        @media (max-width: 992px) {
          .info-grid, .donation-options { grid-template-columns: 1fr; }
          .content-area { padding: 30px 20px; }
        }
      `}</style>
    </div>
  );
}
