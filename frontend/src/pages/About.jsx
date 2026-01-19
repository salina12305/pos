import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  const navLinkStyle = {
    margin: '0 15px',
    color: '#2c2b2b',
    textDecoration: 'none',
    fontSize: '16px',
    fontWeight: 'bold'
  };

  const registerButtonStyle = {
    ...navLinkStyle,
    padding: '10px 20px',
    background: '#1a1a3b',
    color: 'white',
    borderRadius: '8px'
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', color: '#333', lineHeight: '1.6' }}>
      
      {/* Header */}
      <header style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px 60px',
        position: 'fixed',
        top: 0,
        background: '#fff',
        zIndex: 10,
        boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '26px', fontWeight: 700 }}>
          <img src="logo.png" alt="Postify Logo" style={{ height: '60px' }} />
          <span>Postify</span>
        </div>
        <nav>
          <Link to="/" style={{ ...navLinkStyle, color: '#2D7DBF' }}>Home</Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section style={{
        padding: '160px 20px 80px',
        textAlign: 'center',
        backgroundImage:
          'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url("https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'white'
      }}>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '10px' }}>
          Connecting Ideas. Amplifying Voices.
        </h1>
        <p style={{ fontSize: '1.2rem', maxWidth: '700px', margin: '0 auto' }}>
          Postify is a modern social platform designed to help people share thoughts, stories, and moments that matter.
        </p>
      </section>

      {/* About Content */}
      <section style={{ maxWidth: '1000px', margin: '60px auto', padding: '0 20px' }}>
        <h2 style={{ color: '#2D7DBF', fontSize: '2rem', textAlign: 'center' }}>
          Who We Are
        </h2>
        <p style={{ textAlign: 'center', fontSize: '1.1rem', color: '#555' }}>
          Founded in 2025, <strong>Postify</strong> was created with a simple goal: 
          to provide a clean, secure, and engaging space where users can express themselves freely.
          Whether it’s sharing updates, ideas, or meaningful conversations, Postify brings people closer together.
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginTop: '40px' }}>
          
          <div style={{
            flex: '1',
            minWidth: '300px',
            padding: '30px',
            backgroundColor: '#f9f9f9',
            borderRadius: '12px',
            borderLeft: '5px solid #2D7DBF'
          }}>
            <h3 style={{ color: '#2D7DBF' }}>Our Mission</h3>
            <p>
              To empower individuals and communities by making online communication
              simple, meaningful, and accessible for everyone.
            </p>
          </div>

          <div style={{
            flex: '1',
            minWidth: '300px',
            padding: '30px',
            backgroundColor: '#f9f9f9',
            borderRadius: '12px',
            borderLeft: '5px solid #1a1a3b'
          }}>
            <h3 style={{ color: '#1a1a3b' }}>Our Values</h3>
            <p>
              We believe in authenticity, respect, privacy, and building positive
              digital communities through responsible technology.
            </p>
          </div>
        </div>
      </section>

      {/* Footer / CTA */}
      <footer style={{
        textAlign: 'center',
        padding: '60px 20px',
        backgroundColor: '#1a1a3b',
        color: 'white'
      }}>
        <h2>Be part of the Postify community</h2>
        <p style={{ marginBottom: '25px' }}>
          Share your voice, connect with others, and start posting today.
        </p>
      </footer>
    </div>
  );
};

export default About;
