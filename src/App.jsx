import { useState, useEffect } from 'react';
import { PrimeReactProvider } from 'primereact/api';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard.jsx';
import About from './pages/About';
import Navbar from './components/Navbar';
import LoginPage from './pages/loginPage';
import Footer from "./components/footer.jsx";

function App() {
  // Initialize darkMode state more safely
  const [darkMode, setDarkMode] = useState(() => {
    // Check localStorage only after component mounts (client-side)
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) return savedTheme === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false; // Default to light mode if SSR
  });

  // Apply theme changes
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark-theme');
      document.body.classList.remove('light-theme');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.add('light-theme');
      document.body.classList.remove('dark-theme');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // System preference listener
  useEffect(() => {
    if (typeof window === 'undefined') return; // Skip during SSR
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      if (!localStorage.getItem('theme')) {
        setDarkMode(e.matches);
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  return (
    <PrimeReactProvider value={{ unstyled: false, ripple: true }}>
      <Router>
        <div className={`min-h-screen flex flex-col ${
          darkMode ? 'dark bg-gray-100 text-gray-900' : 'bg-gray-100 text-gray-900'
        }`}>
          <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/home" element={<Home />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </PrimeReactProvider>
  );
}

export default App;