import { useState } from "react";
import { Link } from "react-router-dom";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const pizzaImages = [
  {
    src: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1600&q=85",
    alt: "Tuore pizza juustolla ja basilikalla",
    title: "Aitoa italialaista makua",
  },
  {
    src: "https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=1600&q=85",
    alt: "Pizza paistuu kuumassa uunissa",
    title: "Suoraan uunista pöytään",
  },
  {
    src: "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?auto=format&fit=crop&w=1600&q=85",
    alt: "Herkullinen pizza runsailla täytteillä",
    title: "Löydä uusi suosikkisi",
  },
];

const menu = [
  {
    day: "Maanantai",
    name: "Pepperonipizza",
    description: "Tomaattikastike, mozzarella ja pepperoni",
    price: 12.9,
  },
  {
    day: "Tiistai",
    name: "Kinkkupizza",
    description: "Tomaattikastike, mozzarella ja kinkku",
    price: 12.9,
  },
  {
    day: "Keskiviikko",
    name: "Kebabpizza",
    description: "Tomaattikastike, mozzarella, kebab ja sipuli",
    price: 13.9,
  },
  {
    day: "Torstai",
    name: "Kanapizza ananaksella",
    description: "Tomaattikastike, mozzarella, kana ja ananas",
    price: 13.9,
  },
  {
    day: "Perjantai",
    name: "Opera-pizza",
    description: "Tomaattikastike, mozzarella, kinkku ja tonnikala",
    price: 13.9,
  },
  {
    day: "Lauantai",
    name: "Neljän juuston pizza",
    description: "Mozzarella, gorgonzola, parmesaani ja emmental",
    price: 14.9,
  },
  {
    day: "Sunnuntai",
    name: "Margherita-pizza",
    description: "Tomaattikastike, mozzarella ja basilika",
    price: 11.9,
  },
];

function Home() {
  const today = new Date().getDay();

  const [activeImage, setActiveImage] = useState(0);

  const [selectedDay, setSelectedDay] = useState(
    today === 0 ? 6 : today - 1
  );
  const [addedPizza, setAddedPizza] = useState(null);

  const changeImage = (direction) => {
    setActiveImage((current) => {
      const next = current + direction;

      if (next < 0) {
        return pizzaImages.length - 1;
      }

      if (next >= pizzaImages.length) {
        return 0;
      }

      return next;
    });
  };

  const previousDay = () => {
    setSelectedDay((current) =>
      current === 0 ? menu.length - 1 : current - 1
    );
  };

  const nextDay = () => {
    setSelectedDay((current) =>
      current === menu.length - 1 ? 0 : current + 1
    );
  };

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const pizza = menu[selectedDay];

    cart.push(pizza);

    localStorage.setItem("cart", JSON.stringify(cart));
    setAddedPizza(pizza);
  };

  const currentMenu = menu[selectedDay];

  return (
    <>
      <main className="home">
        <section className="pizza-carousel" aria-label="Pizzakuvagalleria">
          {pizzaImages.map((image, index) => (
            <div
              className={`pizza-slide${index === activeImage ? " active" : ""}`}
              key={image.src}
              aria-hidden={index !== activeImage}
            >
              <img
                src={image.src}
                alt={image.alt}
                onError={(event) => {
                  event.currentTarget.onerror = null;
                  event.currentTarget.src = "/pizza.svg";
                }}
              />

              <h2>{image.title}</h2>
            </div>
          ))}

          <button
            className="pizza-carousel-arrow previous"
            type="button"
            aria-label="Edellinen kuva"
            onClick={() => changeImage(-1)}
          >
            ‹
          </button>

          <button
            className="pizza-carousel-arrow next"
            type="button"
            aria-label="Seuraava kuva"
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
                aria-label={`Näytä kuva ${index + 1}`}
                aria-current={index === activeImage ? "true" : undefined}
                onClick={() => setActiveImage(index)}
              />
            ))}
          </div>
        </section>

        <section className="menu-section">
          <div className="day-navigation">
            <button
              type="button"
              className="day-button"
              onClick={previousDay}
            >
              ←
            </button>

            <div
              className={
                selectedDay === (today === 0 ? 6 : today - 1)
                  ? "day-name today"
                  : "day-name"
              }
            >
              {currentMenu.day}
            </div>

            <button
              type="button"
              className="day-button"
              onClick={nextDay}
            >
              →
            </button>
          </div>

          <div className="day-menu">
            <h3>{currentMenu.name}</h3>

            <p>{currentMenu.description}</p>

            <strong>
              {currentMenu.price.toFixed(2).replace(".", ",")} €
            </strong>

            <button
              type="button"
              className="btn"
              onClick={addToCart}
            >
              Add to cart
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
                aria-label="Sulje"
                onClick={() => setAddedPizza(null)}
              >
                ×
              </button>
              <h2 id="cart-confirmation-title">Lisätty ostoskoriin!</h2>
              <div className="cart-confirmation-item">
                <div>
                  <strong>{addedPizza.name}</strong>
                  <span>{addedPizza.price.toFixed(2).replace(".", ",")} €</span>
                </div>
              </div>
              <button
                className="cart-confirmation-continue"
                type="button"
                onClick={() => setAddedPizza(null)}
              >
                Jatka ostoksia
              </button>
              <Link
                className="cart-confirmation-link"
                to="/cart"
                onClick={() => setAddedPizza(null)}
              >
                Siirry ostoskoriin
              </Link>
            </section>
          </div>
        )}

      <section className="location-section">
        <h2>Sijainti</h2>

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
