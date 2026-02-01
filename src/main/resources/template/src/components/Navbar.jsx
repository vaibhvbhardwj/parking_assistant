import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import "../styles/navfoot.css";
import { useState, useEffect } from "react";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [isIntroAnimating, setIsIntroAnimating] = useState(true);

  useEffect(() => {
    // Stop the animation after exactly 3 seconds
    const timer = setTimeout(() => {
      setIsIntroAnimating(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const scrollToSection = (id) => {
  const section = document.getElementById(id);
  if (section) {
    section.scrollIntoView({ behavior: "smooth" });
  }
};


  return (
    <header className="main-header" >
      <div className="logo">
        <Link to="/">
          <img 
            src="/logo.png" 
            className={`logo-icon ${isIntroAnimating ? "pulse-animation" : ""}`} 
            alt="ParkEase Logo"></img>
        </Link>
      </div>

      {/* Hamburger Menu Button (Mobile Only) */}
      <button 
        className="hamburger-btn" 
        onClick={toggleMobileMenu}
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Desktop Navigation */}
      <nav className="main-nav">
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><button onClick={() => scrollToSection("howitworks")}>How It Works</button></li>
          <li><button onClick={() => scrollToSection("features")}>Features</button></li>
          <li><button onClick={() => scrollToSection("why-us")}>Why Us</button></li>
          <li><button onClick={() => scrollToSection("pricing")}>Pricing</button></li>
          <li><button onClick={() => scrollToSection("contact")}>Contact</button></li>


          {/* Logged-in user links */}
          {token && role === "user" && (
            <li><Link to="/user">Dashboard</Link></li>
          )}

          {token && role === "admin" && (
            <li><Link to="/admin">Admin</Link></li>
          )}
        </ul>
      </nav>

      {/* Desktop Auth Buttons */}
      <div className="auth-buttons">
        {/* Show login/register ONLY when NOT logged in */}
        {!token && (
          <>
            <Link to="/login" className="btn btn-login">Login</Link>
            <Link to="/register" className="btn btn-register">Register</Link>
          </>
        )}

        {/* Show logout ONLY when logged in */}
        {token && (
          <button onClick={logout} className="btn btn-logout">
            Logout
          </button>
        )}
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`mobile-menu-overlay ${isMobileMenuOpen ? 'active' : ''}`}>
        <nav className="mobile-menu">
          <ul>
            <li><Link to="/" onClick={closeMobileMenu}>Home</Link></li>
            <li><a href="#why-us" onClick={closeMobileMenu}>How It Works</a></li>
            <li><a href="#features" onClick={closeMobileMenu}>Features</a></li>
            <li><a href="#why-us" onClick={closeMobileMenu}>Why Us</a></li>
            <li><a href="#pricing" onClick={closeMobileMenu}>Pricing</a></li>
            <li><a href="#contact" onClick={closeMobileMenu}>Contact</a></li>

            {/* Logged-in user links */}
            {token && role === "user" && (
              <li><Link to="/user" onClick={closeMobileMenu}>Dashboard</Link></li>
            )}

            {token && role === "admin" && (
              <li><Link to="/admin" onClick={closeMobileMenu}>Admin</Link></li>
            )}

            {/* Mobile Auth Buttons */}
            <li className="mobile-auth-buttons">
              {!token && (
                <>
                  <Link to="/login" className="btn btn-login" onClick={closeMobileMenu}>Login</Link>
                  <Link to="/register" className="btn btn-register" onClick={closeMobileMenu}>Register</Link>
                </>
              )}

              {token && (
                <button onClick={() => { logout(); closeMobileMenu(); }} className="btn btn-logout">
                  Logout
                </button>
              )}
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
