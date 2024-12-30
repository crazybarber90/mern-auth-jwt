// Footer.js

import { Link } from 'react-router-dom'
import './footerStyle.css'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h4>Kontakt</h4>
          <p>Email: info@digitalads.com</p>
          <p>Telefon: +381 60 70 53 042</p>
        </div>
        {/* LINKS  */}
        <div className="footer-section">
          <h4>Korisni Linkovi</h4>
          <div className="footer-links">
            <div className="left-footer-links">
              <p>
                <Link to="/profile" className="footer-link">
                  Naši proizvodi
                </Link>
              </p>
              <p>
                <Link to="/client-adds" className="footer-link">
                  Naše usluge
                </Link>
              </p>
            </div>
            <div className="right-footer-links">
              <p>
                <Link to="/client-adds" className="footer-link">
                  Cenovnik
                </Link>
              </p>
              <p>
                <Link to="/client-adds" className="footer-link">
                  Kontakt
                </Link>
              </p>
            </div>
          </div>
        </div>
        <div className="footer-section">
          <h4>Informacije</h4>
          <p>
            Naša misija je da pružimo najbolje digitalne reklame za vaše
            poslovanje.
          </p>
          <p>Adresa: Ulica Primjera 1, Beograd, Srbija</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2024 Digital Ads Petrovic. Sva prava zadržana.</p>
      </div>
    </footer>
  )
}

export default Footer