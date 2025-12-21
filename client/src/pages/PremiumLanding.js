import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import CustomCursor from '../components/CustomCursor';
import SidebarMenu from '../components/SidebarMenu';
import ThreeScene from '../components/ThreeScene';
import { FiArrowRight, FiStar, FiBook, FiShoppingBag, FiUsers, FiZap } from 'react-icons/fi';
import './PremiumLanding.css';

gsap.registerPlugin(ScrollTrigger);

const PremiumLanding = () => {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    // GSAP animations
    gsap.from('.hero-title', {
      y: 100,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
    });

    gsap.from('.hero-subtitle', {
      y: 50,
      opacity: 0,
      duration: 1,
      delay: 0.3,
      ease: 'power3.out',
    });

    gsap.from('.hero-cta', {
      y: 30,
      opacity: 0,
      duration: 0.8,
      delay: 0.6,
      ease: 'power3.out',
    });

    // Parallax effects
    gsap.to('.parallax-slow', {
      yPercent: -50,
      ease: 'none',
      scrollTrigger: {
        trigger: '.parallax-slow',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });

    // Feature cards animation
    gsap.utils.toArray('.feature-card').forEach((card, i) => {
      gsap.from(card, {
        y: 100,
        opacity: 0,
        duration: 0.8,
        delay: i * 0.2,
        scrollTrigger: {
          trigger: card,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      });
    });
  }, []);

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

  const features = [
    {
      icon: FiBook,
      title: 'Vast Collection',
      description: 'Access thousands of books from every genre imaginable',
      color: '#facc15',
    },
    {
      icon: FiZap,
      title: 'Lightning Fast',
      description: 'Instant access to your favorite books with zero loading time',
      color: '#facc15',
    },
    {
      icon: FiShoppingBag,
      title: 'Easy Purchase',
      description: 'Seamless checkout process with secure payment options',
      color: '#facc15',
    },
    {
      icon: FiUsers,
      title: 'Community',
      description: 'Join millions of readers sharing their favorite stories',
      color: '#facc15',
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Book Lover',
      text: 'The best bookstore experience I\'ve ever had. The UI is stunning!',
      rating: 5,
    },
    {
      name: 'Michael Chen',
      role: 'Student',
      text: 'Found all my textbooks here. The free library section is amazing!',
      rating: 5,
    },
    {
      name: 'Emily Davis',
      role: 'Writer',
      text: 'Beautiful design and smooth animations. A joy to use every day.',
      rating: 5,
    },
  ];

  const pricingPlans = [
    {
      name: 'Free',
      price: '$0',
      features: ['Access to free library', 'Basic search', 'Community access'],
      popular: false,
    },
    {
      name: 'Premium',
      price: '$9.99',
      features: ['All free features', 'Unlimited downloads', 'Early access', 'Priority support'],
      popular: true,
    },
    {
      name: 'Pro',
      price: '$19.99',
      features: ['All premium features', 'Audiobooks', 'Offline reading', 'Exclusive content'],
      popular: false,
    },
  ];

  return (
    <div className="premium-landing">
      <CustomCursor />
      <SidebarMenu />
      
      {/* Navbar */}
      <motion.nav
        className="premium-navbar"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="nav-container">
          <motion.div
            className="nav-logo"
            whileHover={{ scale: 1.1 }}
            data-cursor-text="Home"
          >
            PageX
          </motion.div>
          <div className="nav-links">
            <a href="#features" data-cursor-text="Features">Features</a>
            <a href="#products" data-cursor-text="Products">Products</a>
            <a href="#testimonials" data-cursor-text="Reviews">Reviews</a>
            <a href="#pricing" data-cursor-text="Pricing">Pricing</a>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section ref={heroRef} className="hero-section">
        <motion.div
          className="hero-content"
          style={{ opacity, scale }}
        >
          <motion.h1
            className="hero-title"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Discover Your Next
            <span className="gradient-text"> Adventure</span>
          </motion.h1>
          <motion.p
            className="hero-subtitle"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Explore thousands of books in our premium digital library.
            Experience reading like never before.
          </motion.p>
          <motion.div
            className="hero-cta"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <button className="btn-primary cursor-magnetic" data-cursor-text="Get Started">
              Get Started <FiArrowRight />
            </button>
            <button className="btn-secondary cursor-magnetic" data-cursor-text="Learn More">
              Learn More
            </button>
          </motion.div>
        </motion.div>
        <div className="hero-3d">
          <ThreeScene shape="cube" />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2>Why Choose Us</h2>
          <p>Experience the future of digital reading</p>
        </motion.div>
        <div className="features-grid">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                className="feature-card parallax-slow"
                whileHover={{ y: -10, scale: 1.05 }}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="feature-icon" style={{ color: feature.color }}>
                  <Icon />
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="products-section">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2>Featured Collections</h2>
          <p>Curated selections for every reader</p>
        </motion.div>
        <div className="products-grid">
          {[
            '1543002588-bfa74002ed7e',
            '1481627834876-b7833e8f5570',
            '1507003211169-0a1dd7228f2d',
            '1512820790803-83ca363da85f',
            '1516979187457-637abb4f9353',
            '1495446815908-a10a7a7e8b3c'
          ].map((photoId, index) => (
            <motion.div
              key={index}
              className="product-card"
              whileHover={{ scale: 1.05, rotateY: 5 }}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="product-image">
                <img
                  src={`https://images.unsplash.com/photo-${photoId}?w=400&h=600&fit=crop`}
                  alt={`Product ${index + 1}`}
                />
              </div>
              <div className="product-overlay">
                <h3>Collection {index + 1}</h3>
                <button className="product-btn" data-cursor-text="Explore">
                  Explore <FiArrowRight />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="testimonials-section">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2>What Readers Say</h2>
          <p>Join thousands of satisfied customers</p>
        </motion.div>
        <div className="testimonials-slider">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="testimonial-card"
              initial={{ opacity: 0, x: 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <div className="testimonial-stars">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <FiStar key={i} fill="#facc15" color="#facc15" />
                ))}
              </div>
              <p className="testimonial-text">"{testimonial.text}"</p>
              <div className="testimonial-author">
                <div className="author-avatar">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <h4>{testimonial.name}</h4>
                  <p>{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="pricing-section">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2>Choose Your Plan</h2>
          <p>Flexible pricing for every reader</p>
        </motion.div>
        <div className="pricing-grid">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={index}
              className={`pricing-card ${plan.popular ? 'popular' : ''}`}
              whileHover={{ scale: 1.05, y: -10 }}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              {plan.popular && (
                <div className="popular-badge">Most Popular</div>
              )}
              <h3>{plan.name}</h3>
              <div className="pricing-price">
                <span className="price-amount">{plan.price}</span>
                <span className="price-period">/month</span>
              </div>
              <ul className="pricing-features">
                {plan.features.map((feature, i) => (
                  <li key={i}>
                    <FiArrowRight /> {feature}
                  </li>
                ))}
              </ul>
              <button
                className={`pricing-btn ${plan.popular ? 'btn-primary' : 'btn-secondary'}`}
                data-cursor-text="Get Started"
              >
                Get Started
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <motion.div
          className="cta-content"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2>Ready to Start Reading?</h2>
          <p>Join thousands of readers today and discover your next favorite book</p>
          <button className="btn-primary large cursor-magnetic" data-cursor-text="Join Now">
            Join Now <FiArrowRight />
          </button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="premium-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>PageX</h3>
            <p>Your gateway to endless stories</p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#features">Features</a></li>
              <li><a href="#products">Products</a></li>
              <li><a href="#testimonials">Testimonials</a></li>
              <li><a href="#pricing">Pricing</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Legal</h4>
            <ul>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
              <li><a href="#">Cookie Policy</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Connect</h4>
            <div className="social-links">
              <a href="#" data-cursor-text="Twitter">Twitter</a>
              <a href="#" data-cursor-text="Facebook">Facebook</a>
              <a href="#" data-cursor-text="Instagram">Instagram</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 PageX. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default PremiumLanding;

