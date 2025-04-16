import './contactsStyle.css'
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from 'react-icons/fa'
import { Helmet } from 'react-helmet'

const Contacts = () => {
  return (
    <>
      <Helmet>
        {/* Title & meta description */}
        <title>Kontakt | Digitalizuj Se</title>
        <meta
          name="description"
          content="Kontaktirajte nas i zakažite besplatnu prezentaciju digitalnih reklama nove generacije za Vaš biznis."
        />
        <meta
          name="keywords"
          content="digital ads, digitalne reklame, ekrani ispred lokala, reklama za biznis, digitalizacija, kontakt, Digitalizuj Se"
        />
        <link rel="canonical" href="https://digitalizujse.rs/kontakt" />

        {/* Open Graph za društvene mreže */}
        <meta property="og:title" content="Kontakt | Digitalizuj Se" />
        <meta
          property="og:description"
          content="Zakažite prezentaciju i saznajte kako možemo unaprediti vidljivost vašeg biznisa pomoću digitalnih ekrana."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://digitalizujse.rs/kontakt" />
        <meta
          property="og:image"
          content="/images/homepage-images/logo-levo.png"
        />

        {/* Twitter card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Kontakt | Digitalizuj Se" />
        <meta
          name="twitter:description"
          content="Saznajte kako da unapredite svoj biznis digitalnim reklamama. Kontaktirajte nas danas!"
        />
        <meta
          name="twitter:image"
          content="/images/homepage-images/logo-levo.png"
        />
      </Helmet>

      <div className="contacts-container">
        <h1 className="contacts-title">Kontaktirajte nas</h1>
        <p className="contacts-description">
          Mi smo firma specijalizovana za{' '}
          <b>**digitalne reklame nove generacije**</b>. Nudimo rešenja za male i
          srednje biznise u vidu <b>**ekrana ispred lokala**</b> koje lično Vi
          ažurirate putem naše moderne platforme. Zaboravite na statične
          svetleće reklame - budite medju prvima u Srbiji u trendu i privucite
          pažnju!
        </p>

        <div className="contact-boxes">
          <a href="mailto:pepy9a0a@gmail.com" className="contact-box-link">
            <div className="contact-box">
              <FaEnvelope className="contact-icon" />
              <h3>Email</h3>
              <p>pepy9a0a@gmail.com</p>
            </div>
          </a>

          <a href="tel:+381607053042" className="contact-box-link">
            <div className="contact-box">
              <FaPhoneAlt className="contact-icon" />
              <h3>Telefon</h3>
              <p>+381 60 70 53 042</p>
            </div>
          </a>

          <div className="contact-box">
            <FaMapMarkerAlt className="contact-icon" />
            <h3>Lokacija</h3>
            <p>Beograd, Srbija</p>
          </div>
        </div>

        <div className="cta-box">
          <h2>Zainteresovani ste?</h2>
          <p>
            Pišite nam i zakažite sastanak za besplatnu prezentaciju našeg
            sistema!
          </p>
          <a href="mailto:pepy9a0a@gmail.com" className="cta-button">
            Pošalji email
          </a>
        </div>
      </div>
    </>
  )
}

export default Contacts
