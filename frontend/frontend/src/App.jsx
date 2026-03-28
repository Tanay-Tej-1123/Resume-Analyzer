import React from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Admin from './pages/Admin';
import { Briefcase } from 'lucide-react';
import './index.css';

function NavLinks() {
  const location = useLocation();
  const linkStyle = (path) => ({
    color: location.pathname === path ? 'var(--text-main)' : 'var(--text-muted)',
    textDecoration: 'none',
    fontWeight: location.pathname === path ? '600' : '400',
    transition: '0.2s',
    borderBottom: location.pathname === path ? '2px solid var(--primary)' : '2px solid transparent',
    paddingBottom: '4px'
  });

  return (
    <div style={{ display: 'flex', gap: '30px' }}>
      <Link to="/" style={linkStyle('/')}>Analyzer</Link>
      <Link to="/admin" style={linkStyle('/admin')}>Admin</Link>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <nav style={{ 
        padding: '20px 60px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        borderBottom: '1px solid var(--panel-border)',
        background: 'rgba(11, 15, 25, 0.8)',
        backdropFilter: 'blur(10px)',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '22px', fontWeight: 'bold', letterSpacing: '-0.5px' }}>
          <div style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))', padding: '8px', borderRadius: '10px', display: 'flex' }}>
            <Briefcase color="white" size={20} />
          </div>
          ResumeAI
        </Link>
        <NavLinks />
      </nav>
      <main style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
