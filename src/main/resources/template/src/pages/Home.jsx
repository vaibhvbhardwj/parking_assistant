import React, { useState } from 'react';
import "../styles/Home.css";
import HowItWorks from "../components/HowItWorks";
import * as Lucide from 'lucide-react';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Home() {
    // State for the CTA form
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        businessType: '',
        message: ''
    });

    const [formStatus, setFormStatus] = useState(null); // 'success', 'error', or 'loading'

    // Simple handler for form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Simple form submission handler
    const handleSubmit = async (e) => {
  e.preventDefault();
  setFormStatus("loading");

  const payload = {
    fullName: formData.name,
    email: formData.email,
    businessType: formData.businessType,
    message: formData.message,
  };

  try {
    const res = await fetch("http://localhost:5000/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (res.ok) {
      setFormStatus("success");
      setFormData({
        name: "",
        email: "",
        businessType: "",
        message: "",
      });
    } else {
      setFormStatus("error");
      alert(data.message || "Something went wrong");
    }
  } catch (err) {
    setFormStatus("error");
    alert("Network or server error");
  }
};


    // Common Button component for styling
    const PrimaryButton = ({ children, className = '', onClick, type = 'button' }) => (
        <button
            onClick={onClick}
            type={type}
            className={`primary-btn ${className}`}
        >
            {children}
        </button>
    );

    // Common Input Field component
    const InputField = ({ label, name, type = 'text', value, onChange, placeholder, required = false }) => (
        <div className="form-group">
            <label htmlFor={name} className="form-label">{label}{required && <span style={{ color: '#ef4444' }}>*</span>}</label>
            <input
                type={type}
                name={name}
                id={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                className="form-input"
            />
        </div>
    );
    // --- Component Sections ---

    // 1. Hero Section
    const HeroSection = () => (
        <div className="hero-section "  >
            <div className="max-w-4xl mx-auto  ">
                <h1 className="hero-title leading-tight">
                    Parking Simplified: <span className="hero-subtitle block sm:inline" style={{ marginTop: '0.5rem' }}>Book in Seconds, Earn in Minutes.</span>
                </h1>
                <p className="hero-description">
                    Park smart, earn fast: The all-in-one cloud platform for secure spots, instant transactions, and max revenue.
                </p>
                <div className="hero-actions">
                    <PrimaryButton>
                        Find a Parking
                    </PrimaryButton>
                    <button className="secondary-btn">
                        List a Parking
                    </button>
                </div>
            </div>
        </div>
    );

    // 2. Why Us Section
    const WhyUsSection = () => (
        <div className="section bg-white">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl sm:text-4xl font-bold text-center" style={{ color: '#1f2937', marginBottom: '3rem' }}>
                    Why Choose ParkEase?
                </h2>
                <div className="why-us-grid">
                    <WhyUsCard
                        Icon={Lucide.TrendingUp} // Updated usage
                        title="Optimize Revenue"
                        description="Implement dynamic pricing strategies to maximize earnings during peak demand, automatically and without manual intervention."
                    />
                    <WhyUsCard
                        Icon={Lucide.Truck} // Updated usage
                        title="Keep Traffic Moving"
                        description="Our lightning-fast, user-friendly interface ensures rapid processing, drastically cutting down entry and exit wait times."
                    />
                    <WhyUsCard
                        Icon={Lucide.CheckCircle} // Updated usage
                        title="Unmatched Reliability"
                        description="Leverage secure, cloud-based infrastructure with 99.9% guaranteed uptime. Your operations never sleep."
                    />
                </div>
            </div>
        </div>
    );

    const WhyUsCard = ({ Icon, title, description }) => (
        <div className="why-us-card">
            <Icon className="card-icon" />
            <h3 className="text-xl font-semibold" style={{ color: '#1f2937', marginBottom: '0.5rem' }}>{title}</h3>
            <p style={{ color: '#4b5563' }}>{description}</p>
        </div>
    );


    // 3. Features Section
    const FeaturesSection = () => (
        <div className="section bg-indigo-50">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl sm:text-4xl font-bold text-center" style={{ color: '#1f2937', marginBottom: '3rem' }}>
                    Powerful Features for Total Control
                </h2>
                <div className="features-list">
                    <FeatureItem
                        Icon={Lucide.Key}
                        title="Smart Entry/Exit"
                        description="Seamless integration with automated license plate recognition (ALPR) systems for ticketless parking."
                        benefit="Reduces processing time by 40%."
                    />
                    <FeatureItem
                        Icon={Lucide.DollarSign}
                        title="Dynamic Pricing Engine"
                        description="Set rules to automatically adjust rates based on time of day, day of the week, special events, or lot occupancy."
                        benefit="Maximizes revenue during peak hours."
                    />
                    <FeatureItem
                        Icon={Lucide.CreditCard}
                        title="Contactless Payments"
                        description="Accept all major digital payment methods: Tap-to-Pay, Apple Pay, Google Pay, and QR-code payments at the kiosk or handheld device."
                        benefit="Provides a secure and convenient experience."
                    />
                    <FeatureItem
                        Icon={Lucide.Briefcase}
                        title="Dedicated Valet Mode"
                        description="Specialized workflow to track vehicle location, key status, and manage valet staff performance in real-time."
                        benefit="Instant tracking minimizes customer wait times."
                    />
                </div>
            </div>
        </div>
    );

    const FeatureItem = ({ Icon, title, description, benefit }) => (
        <div className="feature-item">
            <Icon className="feature-icon" />
            <div style={{ flex: 1 }}>
                <h3 className="text-xl font-semibold" style={{ color: '#1f2937' }}>{title}</h3>
                <p style={{ color: '#4b5563', marginTop: '0.25rem' }}>{description}</p>
                <p className="feature-benefit">
                    <span style={{ fontWeight: 700 }}>Benefit:</span> {benefit}
                </p>
            </div>
        </div>
    );

    // 4. Pricing Section
    const pricingPlans = [
        {
            name: 'Starter',
            price: '₹499',
            description: 'Essential management for small to medium-sized lots.',
            spots: 'Up to 50 Spots',
            features: [
                { text: 'Basic reporting & analytics', included: true },
                { text: 'Email support', included: true },
                { text: 'Single location management', included: true },
                { text: 'Dynamic pricing engine', included: false },
            ],
            cta: 'Start 14-Day Trial',
        },
        {
            name: 'Professional',
            price: '₹1499',
            description: 'Advanced features for growing operators with multiple sites.',
            spots: 'Unlimited Spots',
            features: [
                { text: 'Advanced analytics & forecasting', included: true },
                { text: '24/7 Priority support', included: true },
                { text: 'Multi-location dashboard', included: true },
                { text: 'Dynamic pricing engine', included: true },
            ],
            cta: 'Book a Live Demo',
            isPopular: true,
        },
        {
            name: 'Enterprise',
            price: 'Custom',
            description: 'Tailored solutions for large-scale operations and custom integrations.',
            spots: 'Custom Quote',
            features: [
                { text: 'Everything in Professional', included: true },
                { text: 'Dedicated account manager', included: true },
                { text: 'API access for custom integrations', included: true },
                { text: 'On-site setup and training', included: true },
            ],
            cta: 'Contact Sales',
        },
    ];

    const PricingSection = () => (
        <div className="section bg-white">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-3xl sm:text-4xl font-bold text-center" style={{ color: '#1f2937', marginBottom: '1rem' }}>
                    Simple, Transparent Pricing
                </h2>
                <p className="text-xl text-center" style={{ color: '#6b7280', marginBottom: '3rem' }}>
                    Plans built to scale with your business, from a single lot to a global portfolio.
                </p>
                <div className="pricing-grid">
                    {pricingPlans.map((plan) => (
                        <PricingCard key={plan.name} plan={plan} />
                    ))}
                </div>
            </div>
        </div>
    );

    const PricingCard = ({ plan }) => (
        <div className={`pricing-card ${plan.isPopular ? 'popular' : ''}`}>
            {plan.isPopular && (
                <div className="text-center" style={{ marginBottom: '1rem' }}>
                    <span style={{ display: 'inline-block', padding: '0.25rem 0.75rem', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', backgroundColor: '#facc15', color: '#1f2937', borderRadius: '9999px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                        Most Popular
                    </span>
                </div>
            )}
            <h3 className="text-2xl font-bold" style={{ marginBottom: '0.5rem', color: plan.isPopular ? 'white' : '#4f46e5' }}>{plan.name}</h3>
            <p className="text-sm" style={{ marginBottom: '1.5rem', color: plan.isPopular ? '#c7d2fe' : '#6b7280' }}>{plan.description}</p>
            <div style={{ marginBottom: '2rem' }}>
                <span className="price-lg text-amber-500">{plan.price}</span>
                {plan.price !== 'Custom' && <span className="price-sm" style={{ color: plan.isPopular ? '#c7d2fe' : '#6b7280' }}>/month</span>}
                <p className="mt-2 font-semibold" style={{ color: plan.isPopular ? '#c7d2fe' : '#4b5563' }}>{plan.spots}</p>
            </div>
            <PrimaryButton className={`w-full ${plan.isPopular ? 'bg-white text-indigo-600 hover:bg-gray-200' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}>
                {plan.cta}
            </PrimaryButton>
            <ul style={{ marginTop: '2rem', listStyle: 'none', padding: 10, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {plan.features.map((feature, index) => (
                    <li key={index} style={{ display: 'flex', alignItems: 'center' }}>
                        {feature.included ? (
                            <Lucide.CheckCircle style={{ width: '1.25rem', height: '1.25rem', flexShrink: 0, color: plan.isPopular ? '#facc15' : '#10b981' }} />
                        ) : (
                            <Lucide.MinusCircle style={{ width: '1.25rem', height: '1.25rem', flexShrink: 0, color: plan.isPopular ? '#9fa6e5' : '#ef4444' }} />
                        )}
                        <span style={{ marginLeft: '0.75rem', fontSize: '0.875rem', color: plan.isPopular ? 'white' : '#374151' }}>
                            {feature.text}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );

    // 5. CTA/Contact Form Section
    const ContactFormSection = () => (
        <div className="section bg-gray-50" id="contact" >
            <div className="max-w-4xl mx-auto contact-form-container">
                <h2 className="text-3xl font-bold text-center" style={{ color: '#1f2937', marginBottom: '0.75rem' }}>
                    Have Questions? Let’s Talk.
                </h2>
                <p className="text-lg text-center" style={{ color: '#6b7280', marginBottom: '2rem' }}>
                    Fill out the form below and a parking expert will reach out within 24 hours.
                </p>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <InputField
                        label="Your Full Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        required
                    />
                    <InputField
                        label="Work Email Address"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john.doe@lotcorp.com"
                        required
                    />

                    <div className="form-group">
                        <label htmlFor="businessType" className="form-label">Business Type</label>
                        <select
                            id="businessType"
                            name="businessType"
                            value={formData.businessType}
                            onChange={handleChange}
                            className="form-select"
                        >
                            <option value="">Select your organization type</option>
                            <option value="Private Lot">Private Lot Operator</option>
                            <option value="Municipal">Municipal/City Parking Authority</option>
                            <option value="Airport/Hospital">Airport/Hospital/University</option>
                            <option value="Event Venue">Large Event Venue/Stadium</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="message" className="form-label">Your Message or Query</label>
                        <textarea
                            id="message"
                            name="message"
                            rows="4"
                            value={formData.message}
                            onChange={handleChange}
                            placeholder="I'm interested in the Professional plan and manage 8 locations in Texas."
                            className="form-textarea"
                        ></textarea>
                    </div>

                    <PrimaryButton className="w-full" type="submit">
                        {formStatus === 'loading' ? (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Lucide.Send style={{ width: '1.25rem', height: '1.25rem', animation: 'spin 1s linear infinite', marginRight: '0.5rem' }} />
                                Sending...
                            </div>
                        ) : (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Lucide.Send style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem' }} />
                                Send Inquiry
                            </div>
                        )}
                    </PrimaryButton>
                    {/* Add keyframes for spin animation */}
                    <style>
                        {`
                            @keyframes spin {
                                from { transform: rotate(0deg); }
                                to { transform: rotate(360deg); }
                            }
                        `}
                    </style>

                    {formStatus === 'success' && (
                        <div className="success-box">
                            <Lucide.CheckCircle style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem' }} />
                            Success! Your query has been sent. We will contact you shortly.
                        </div>
                    )}
                    {formStatus === 'error' && (
                        <div className="error-box">
                            <Lucide.MinusCircle style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem' }} />
                            Error: Please fill in all required fields (Name and Email).
                        </div>
                    )}
                </form>
            </div>
        </div>
    );

    // 6. Final CTA Section
    const FinalCtaSection = () => (
        <div className="final-cta-section">
            <h2 className="final-cta-title">
                Ready to eliminate the parking headache?
            </h2>
            <p className="final-cta-subtitle">
                Join over 2,000+ lots worldwide using ParkEase to streamline operations and boost revenue.
            </p>
            <div style={{ marginTop: '2rem' }}>
                <PrimaryButton className="final-cta-btn">
                    Start Your 14-Day Free Trial
                </PrimaryButton>
                <p className="text-sm" style={{ marginTop: '0.75rem', color: '#a5b4fc' }}>
                    No credit card required. Setup in under 10 minutes.
                </p>
            </div>
        </div>
    );

  return (
    <>
      <div className="app-container ">

            {/* Main content sections */}
            <Navbar/>
            <HeroSection />
            <img src="https://www.kindpng.com/picc/m/707-7070584_vector-roads-city-road-with-cars-clipart-hd.png" alt="Vector Roads City - Road With Cars Clipart, HD Png Download@kindpng.com" className='block lg:hidden' ></img>
            <HowItWorks/>
            <FeaturesSection />
            <WhyUsSection />
            <PricingSection />
            <ContactFormSection />
            <FinalCtaSection />
            <Footer/>
        </div>
    </>
  );
}

export default Home;
