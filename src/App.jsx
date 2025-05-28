import { PrimeReactProvider } from 'primereact/api';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard.jsx';
import About from './pages/About';
import Navbar from './components/Navbar';
import LoginPage from './pages/loginPage';
import Footer from  "./components/footer.jsx";


function App() {
  return (
    <PrimeReactProvider value={{ unstyled: false, ripple: true }}>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/home" element={<Home />} />
          {/* Add more routes as needed */}
        </Routes>
        <Footer/>
      </Router>
    </PrimeReactProvider>
  );
}

export default App;
