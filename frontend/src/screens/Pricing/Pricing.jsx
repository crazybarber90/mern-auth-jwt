import './pricingStyle.css'
import { FaEuroSign, FaTools, FaSyncAlt, FaTags } from 'react-icons/fa'

const Pricing = () => {
  return (
    <div className="pricing-container">
      <h1 className="pricing-title">Naše Cene</h1>
      <p className="pricing-subtitle">
        Transparentno. Bez skrivenih troškova. Sve što vam je potrebno za
        modernu digitalnu reklamu.
      </p>

      <div className="pricing-grid">
        <div className="pricing-card">
          <FaEuroSign className="pricing-icon" />
          <h2>Ekran + oprema</h2>
          <p className="price">400€</p>
          <p>
            Uključuje ekran, nosač po meri (za plafon, iznad vrata, bočno...),
            kablove i sve što je potrebno.
          </p>
          {/* <div className="sketch-placeholder">[Skica 1]</div> */}
        </div>

        <div className="pricing-card">
          <FaTools className="pricing-icon" />
          <h2>Montaža</h2>
          <p className="price">100€</p>
          <p>
            Profesionalna ugradnja ekrana na željeno mesto – brzo, sigurno i
            precizno.
          </p>
          {/* <div className="sketch-placeholder">[Skica 2]</div> */}
        </div>

        <div className="pricing-card">
          <FaSyncAlt className="pricing-icon" />
          <h2>Mesečna pretplata</h2>
          <p className="price">10€/reklami</p>
          <p>
            Pristup platformi za ažuriranje sadržaja u realnom vremenu, uvek
            ažurno i fleksibilno.
          </p>
        </div>

        <div className="pricing-card">
          <FaTags className="pricing-icon" />
          <h2>Popusti</h2>
          <p className="price">Dogovor</p>
          <p>
            Imate više lokala? Nudimo korekciju cene i pretplate za svaku
            sledeću reklamu.
          </p>
        </div>
      </div>

      <div className="pricing-footer">
        <p>
          Kontaktirajte nas za preciznu ponudu i prezentaciju u vašem prostoru.
        </p>
        <a href="mailto:pepy9a0a@gmail.com" className="cta-button">
          Zakaži konsultaciju
        </a>
      </div>
    </div>
  )
}

export default Pricing
