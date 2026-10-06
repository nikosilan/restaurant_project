import { useState } from "react";
import { Link } from "react-router-dom";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import { useLanguage } from "../i18n";
import { useMenu } from "../hooks/useMenu";

const getText = (value, language) => value?.[language] ?? value?.en ?? value ?? "";

const formatPrice = (value) =>
  Number(value).toFixed(2).replace(".", ",") + " €";

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

const dayNames = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

function Home() {
  const { language, t } = useLanguage();

  const today = new Date().getDay();
  const todayIndex = today === 0 ? 6 : today - 1;

  const [activeImage, setActiveImage] = useState(0);
  const [selectedDay, setSelectedDay] = useState(todayIndex);
  const [addedPizza, setAddedPizza] = useState(null);

  const {
    menu: fullMenu,
    loading: isFullMenuLoading,
    error: fullMenuError,
  } = useMenu();

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
      current === 0 ? dayNames.length - 1 : current - 1,
    );
  };

  const nextDay = () => {
    setSelectedDay((current) =>
      current === dayNames.length - 1 ? 0 : current + 1,
    );
  };

  const dailyItem = fullMenu.find(
    (item) => item.day_name === dayNames[selectedDay],
  );

  const currentMenu = dailyItem
    ? {
        name: dailyItem.name_fi ?? dailyItem.name,
        description: dailyItem.description_fi ?? dailyItem.description,
        price: Number(dailyItem.price),
        day: dailyItem.day_name,
      }
    : null;

  const addToCart = () => {
    if (!currentMenu) {
      return;
    }

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
        <section
          className="pizza-carousel"
          aria-label={t.home.galleryLabel}
        >
          {pizzaImages.map((image, index) => (
            <div
              className={`pizza-slide${
                index === activeImage ? " active" : ""
              }`}
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
                aria-current={
                  index === activeImage ? "true" : undefined
                }
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
                selectedDay === todayIndex
                  ? "day-name today"
                  : "day-name"
              }
            >
              {language === "fi"
                ? [
                    "Maanantai",
                    "Tiistai",
                    "Keskiviikko",
                    "Torstai",
                    "Perjantai",
                    "Lauantai",
                    "Sunnuntai",
                  ][selectedDay]
                : dayNames[selectedDay]}
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
            {currentMenu ? (
              <>
                <h3>{getText(currentMenu.name, language)}</h3>

                <p>
                  {getText(currentMenu.description, language)}
                </p>

                <strong>{formatPrice(currentMenu.price)}</strong>

                <button
                  type="button"
                  className="btn"
                  onClick={addToCart}
                >
                  {t.home.addToCart}
                </button>
              </>
            ) : (
              <p>Ei lounasta tänä päivänä.</p>
            )}
          </div>
        </section>
      </main>

      {addedPizza && (
        <div
          className="cart-confirmation-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setAddedPizza(null);
            }
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

            <h2 id="cart-confirmation-title">
              {t.home.cartAdded}
            </h2>

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

      <section className="full-menu-section">
        <h2>
          {language === "fi"
            ? "Viikon ruokalista"
            : "Full menu"}
        </h2>

        {isFullMenuLoading && <p>Loading menu...</p>}

        {fullMenuError && (
          <p role="status">{fullMenuError}</p>
        )}

        <div className="menu-grid">
          {fullMenu.map((item) => {
            const dietaryNames = item.dietary.map(
              (tag) => tag.name_en || tag.code || tag,
            );

            const isItemToday =
              item.day_name === dayNames[todayIndex] ||
              item.day_name === "Every day";

            return (
              <article
                className={
                  isItemToday
                    ? "menu-card today"
                    : "menu-card"
                }
                key={item.id || item.day_name}
              >
                {isItemToday && (
                  <span>
                    {language === "fi" ? "Tänään" : "Today"}
                  </span>
                )}

                <h3>{item.day_name}</h3>
                <p>{item.name}</p>
                <p>{formatPrice(item.price)}</p>
                <p>
                  {t.menu.dietary} {dietaryNames.join(", ")}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="location-section">
        <h2>{t.home.location}</h2>

        {/* TODO: Load the restaurant name and address from the locations API. */}
        <p>Pizzeria Napoli</p>
        <p>Lippajärventie 29, 02940 Espoo</p>

        <MapContainer
          className="location-map"
          center={[60.231, 24.716]}
          zoom={15}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>-tekijät'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <Marker position={[60.23053, 24.71624]}>
            <Popup>Pizzeria Napoli</Popup>
          </Marker>
        </MapContainer>
      </section>
    </>
  );
}

export default Home;
