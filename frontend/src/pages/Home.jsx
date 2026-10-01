import { useState } from "react";
import { Link } from "react-router-dom";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import { useLanguage } from "../i18n";

const getText = (value, language) => value?.[language] ?? value?.en ?? "";
const formatPrice = (value) => `${value.toFixed(2).replace(".", ",")} €`;

const pizzaImages = [
  {
    src: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1600&q=85",
    alt: {
      fi: "Tuore pizza juustolla ja basilikalla",
      en: "Fresh pizza with cheese and basil",
    },
    title: {
      fi: "Aitoa italialaista makua",
      en: "Authentic Italian flavor",
    },
  },
  {
    src: "https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=1600&q=85",
    alt: {
      fi: "Pizza paistuu kuumassa uunissa",
      en: "Pizza baking in a hot oven",
    },
    title: {
      fi: "Suoraan uunista pöytään",
      en: "Straight from the oven to the table",
    },
  },
  {
    src: "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?auto=format&fit=crop&w=1600&q=85",
    alt: {
      fi: "Herkullinen pizza runsailla täytteillä",
      en: "Delicious pizza with rich toppings",
    },
    title: {
      fi: "Löydä uusi suosikkisi",
      en: "Find your new favorite",
    },
  },
];

const menu = [
  {
    day: { fi: "Maanantai", en: "Monday" },
    name: { fi: "Pepperonipizza", en: "Pepperoni pizza" },
    description: {
      fi: "Tomaattikastike, mozzarella ja pepperoni",
      en: "Tomato sauce, mozzarella and pepperoni",
    },
    price: 12.9,
  },
  {
    day: { fi: "Tiistai", en: "Tuesday" },
    name: { fi: "Kinkkupizza", en: "Ham pizza" },
    description: {
      fi: "Tomaattikastike, mozzarella ja kinkku",
      en: "Tomato sauce, mozzarella and ham",
    },
    price: 12.9,
  },
  {
    day: { fi: "Keskiviikko", en: "Wednesday" },
    name: { fi: "Kebabpizza", en: "Kebab pizza" },
    description: {
      fi: "Tomaattikastike, mozzarella, kebab ja sipuli",
      en: "Tomato sauce, mozzarella, kebab and onion",
    },
    price: 13.9,
  },
  {
    day: { fi: "Torstai", en: "Thursday" },
    name: {
      fi: "Kanapizza ananaksella",
      en: "Chicken pizza with pineapple",
    },
    description: {
      fi: "Tomaattikastike, mozzarella, kana ja ananas",
      en: "Tomato sauce, mozzarella, chicken and pineapple",
    },
    price: 13.9,
  },
  {
    day: { fi: "Perjantai", en: "Friday" },
    name: { fi: "Opera-pizza", en: "Opera pizza" },
    description: {
      fi: "Tomaattikastike, mozzarella, kinkku ja tonnikala",
      en: "Tomato sauce, mozzarella, ham and tuna",
    },
    price: 13.9,
  },
  {
    day: { fi: "Lauantai", en: "Saturday" },
    name: { fi: "Neljän juuston pizza", en: "Four cheese pizza" },
    description: {
      fi: "Mozzarella, gorgonzola, parmesaani ja emmental",
      en: "Mozzarella, gorgonzola, parmesan and emmental",
    },
    price: 14.9,
  },
  {
    day: { fi: "Sunnuntai", en: "Sunday" },
    name: { fi: "Margherita-pizza", en: "Margherita pizza" },
    description: {
      fi: "Tomaattikastike, mozzarella ja basilika",
      en: "Tomato sauce, mozzarella and basil",
    },
    price: 11.9,
  },
];

function Home() {
  const { language, t } = useLanguage();
  const today = new Date().getDay();

  const [activeImage, setActiveImage] = useState(0);
  const [selectedDay, setSelectedDay] = useState(today === 0 ? 6 : today - 1);
  const [addedPizza, setAddedPizza] = useState(null);

  const currentMenu = menu[selectedDay];
  const selectedImage = pizzaImages[activeImage];
  const isToday = selectedDay === (today === 0 ? 6 : today - 1);

  const changeImage = (direction) => {
    setActiveImage((current) => {
      const next = current + direction;

      if (next < 0) return pizzaImages.length - 1;
      if (next >= pizzaImages.length) return 0;

      return next;
    });
  };

  const previousDay = () => {
    setSelectedDay((current) => (current === 0 ? menu.length - 1 : current - 1));
  };

  const nextDay = () => {
    setSelectedDay((current) => (current === menu.length - 1 ? 0 : current + 1));
  };

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const pizza = {
      ...currentMenu,
      name: getText(currentMenu.name, language),
      description: getText(currentMenu.description, language),
      day: getText(currentMenu.day, language),
    };

    cart.push(pizza);
    localStorage.setItem("cart", JSON.stringify(cart));
    setAddedPizza(pizza);
  };

  return (
    <>
      <main className="home">
        <section className="pizza-carousel" aria-label={t.home.galleryLabel}>
          {pizzaImages.map((image, index) => (
            <div
              className={`pizza-slide${index === activeImage ? " active" : ""}`}
              key={image.src}
              aria-hidden={index !== activeImage}
            >
              <img
                src={image.src}
                alt={getText(image.alt, language)}
                onError={(event) => {
                  event.currentTarget.onerror = null;
                  event.currentTarget.src = "/pizza.svg";
                }}
              />

              <h2>{getText(image.title, language)}</h2>
            </div>
          ))}

          <button
            className="pizza-carousel-arrow previous"
            type="button"
            aria-label={t.home.previousImage}
            onClick={() => changeImage(-1)}
          >
            ‹
          </button>

          <button
            className="pizza-carousel-arrow next"
            type="button"
            aria-label={t.home.nextImage}
            onClick={() => changeImage(1)}
          >
            ›
          </button>

          <div className="pizza-carousel-dots">
            {pizzaImages.map((image, index) => (
              <button
                className={index === activeImage ? "active" : ""}
                key={image.src}
                type="button"
                aria-label={`${t.home.showImage} ${index + 1}`}
                aria-current={index === activeImage ? "true" : undefined}
                onClick={() => setActiveImage(index)}
              />
            ))}
          </div>
        </section>

        <section className="menu-section">
          <div className="day-navigation">
            <button type="button" className="day-button" onClick={previousDay}>
              ←
            </button>

            <div className={isToday ? "day-name today" : "day-name"}>
              {getText(currentMenu.day, language)}
            </div>

            <button type="button" className="day-button" onClick={nextDay}>
              →
            </button>
          </div>

          <div className="day-menu">
            <h3>{getText(currentMenu.name, language)}</h3>
            <p>{getText(currentMenu.description, language)}</p>
            <strong>{formatPrice(currentMenu.price)}</strong>

            <button type="button" className="btn" onClick={addToCart}>
              {t.home.addToCart}
            </button>
          </div>
        </section>
      </main>

      {addedPizza && (
        <div
          className="cart-confirmation-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setAddedPizza(null);
          }}
        >
          <section
            className="cart-confirmation-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-confirmation-title"
          >
            <button
              className="cart-confirmation-close"
              type="button"
              aria-label="Close"
              onClick={() => setAddedPizza(null)}
            >
              ×
            </button>
            <h2 id="cart-confirmation-title">{t.home.cartAdded}</h2>
            <div className="cart-confirmation-item">
              <div>
                <strong>{addedPizza.name}</strong>
                <span>{formatPrice(addedPizza.price)}</span>
              </div>
            </div>
            <button
              className="cart-confirmation-continue"
              type="button"
              onClick={() => setAddedPizza(null)}
            >
              {t.home.continueShopping}
            </button>
            <Link
              className="cart-confirmation-link"
              to="/cart"
              onClick={() => setAddedPizza(null)}
            >
              {t.home.goToCart}
            </Link>
          </section>
        </div>
      )}

      <section className="location-section">
        <h2>{t.home.location}</h2>

        <p>Pizzeria Napoli</p>
        <p>Kivenlahdentie 10, 02320 Espoo</p>

        <MapContainer
          className="location-map"
          center={[60.183, 24.658]}
          zoom={15}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>-tekijät'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[60.183, 24.658]}>
            <Popup>Pizzeria Napoli</Popup>
          </Marker>
        </MapContainer>
      </section>
    </>
  );
}

export default Home;
