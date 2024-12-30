import './homepageStyle.css'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'

const Homepage = () => {
  const images = [
    '/images/homepage-images/image1.png',
    '/images/homepage-images/image2.jpg',
    '/images/homepage-images/image3.jpg',
    '/images/homepage-images/image4.jpg',
    '/images/homepage-images/image5.jpg',
  ]

  return (
    <div className="container">
      <div className="left">
        <h1 className="leftTexth1">Digital Ads Petrovic</h1>
        <p className="leftTextParagraph">
          Odlučite da se digitalizujete na najsavremeniji nacin. Naš tim ce vam
          pomoci u svemu. Sve što je potrebno je da nas kontaktirate i ostalo
          prepustite nama.
        </p>
      </div>
      <div className="right">
        <p className="rightText">
          Implementiramo digitalne reklame po definisanim standardnim
          dimenzijama. Naši klijenti dobijaju ekran koji mogu da okače iznad
          prodavnice, a preko naše online platforme mogu da ažuriraju reklamu
          kada god požele: slika, slider ili video u trajanju do 20 sekundi.
        </p>
        <div className="slider">
          <p className="sliderText">VAŠA REKLAMA MOŽE DA IZGLEDA OVAKO</p>
          <Swiper
            spaceBetween={10}
            slidesPerView={1}
            loop={true}
            autoplay={{
              delay: 5000, // 5 sekundi
              disableOnInteraction: false,
            }}
            navigation={true} // Strelice za navigaciju
            modules={[Navigation, Autoplay]}
          >
            {images.map((src, index) => (
              <SwiperSlide key={index}>
                <img src={src} alt={`Slide ${index + 1}`} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  )
}

export default Homepage
