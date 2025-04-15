import './productsStyle.css'
import { FaHandPointLeft } from 'react-icons/fa'

const Products = () => {
  return (
    <div className="products-container">
      <div className="products-header">
        <h1>Digitalne Reklame za Vaš Biznis</h1>
        <p>
          Zaboravite statične svetleće reklame. <br />
          Inovativno rešenje za modernu promociju vašeg biznisa – LED ekran sa
          digitalnim sadržajem koji ažurirate jednostavno putem naše online
          platforme.
        </p>
      </div>

      <div className="products-content">
        <div className="products-image">
          <img
            src="/images/homepage-images/kacenje-reklama.png"
            alt="Načini kačenja reklama"
          />
        </div>
        <div className="products-description">
          <h2>Šta nudimo</h2>
          <ul>
            <li>
              LED ekran 32 incha – idealna veličina za isticanje promocije /
              poruke / slike / videa
            </li>
            <li>Potpuno otporan mini bilbord na sve vremenske uslove</li>
            <li>Kvalitetna unutrašnja izolacija za dug vek trajanja</li>
            <li>
              Platforma za ažuriranje reklama urađena u savremenim tehnologijama
            </li>
            <li>
              Lak pristup za korisnike – individualna ili grupna kontrola
              reklama
            </li>
            <li>
              Formati podržani: slike, galerije (slajder), video do 15 sekundi
            </li>
            <div
              style={{
                width: '80%',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                marginTop: '4rem',
                justifyContent: 'center',
              }}
            >
              <FaHandPointLeft className="leftArrow-icon" />
              <p>
                Na prikazanoj slici može se videti tri načina kačenja bilborda
              </p>
            </div>
          </ul>
        </div>
      </div>

      <div className="products-contact">
        <h3>Zainteresovani za saradnju?</h3>
        <p>
          Ukoliko imate bilo koju kreativnu ideju koja bi mogla da unapredi vaš
          biznis u saradnji sa nama, kontaktirajte nas da se dogovaramo, i
          saznajte kako vaša reklama može izgledati već danas.
        </p>
        {/* Ovde možeš ubaciti kontakt formu po želji */}
      </div>
    </div>
  )
}

export default Products
