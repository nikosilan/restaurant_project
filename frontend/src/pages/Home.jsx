import { useState } from "react";

import { useMenu } from "../hooks/useMenu";

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

const dayNames = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
const dayNamesFi = [
  "Maanantai",
  "Tiistai",
  "Keskiviikko",
  "Torstai",
  "Perjantai",
  "Lauantai",
  "Sunnuntai",
];

function Home() {
  const today = new Date().getDay();
  const todayIndex = today === 0 ? 6 : today - 1;

  const [activeImage, setActiveImage] = useState(0);
  const [selectedDay, setSelectedDay] = useState(todayIndex);

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

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    cart.push(currentMenu);

    localStorage.setItem("cart", JSON.stringify(cart));

    alert("Tuote lisätty ostoskoriin!");
  };

  const dailyItem = fullMenu.find(
    (item) => item.day_name === dayNames[selectedDay],
  );

  const currentMenu = dailyItem
    ? {
        name: dailyItem.name_fi,
        description: dailyItem.description_fi,
        price: Number(dailyItem.price),
      }
    : null;

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
            <button type="button" className="day-button" onClick={previousDay}>
              ←
            </button>

            <div
              className={
                selectedDay === todayIndex ? "day-name today" : "day-name"
              }
            >
              {dayNamesFi[selectedDay]}
            </div>

            <button type="button" className="day-button" onClick={nextDay}>
              →
            </button>
          </div>

          <div className="day-menu">
            {currentMenu ? (
              <>
                <h3>{currentMenu.name}</h3>

                <p>{currentMenu.description}</p>

                <strong>
                  {currentMenu.price.toFixed(2).replace(".", ",")} €
                </strong>

                <button type="button" className="btn" onClick={addToCart}>
                  Add to cart
                </button>
              </>
            ) : (
              <p>Ei lounasta tänä päivänä.</p>
            )}
          </div>
        </section>
      </main>

      <section className="full-menu-section">
        <h2>Full menu</h2>

        {isFullMenuLoading && <p>Loading menu...</p>}
        {fullMenuError && <p role="status">{fullMenuError}</p>}

        <div className="menu-grid">
          {fullMenu.map((item) => {
            const dietaryNames = item.dietary.map(
              (tag) => tag.name_en || tag.code || tag,
            );

            return (
              <article
                className={
                  item.day_name === dayNames[todayIndex] ||
                  item.day_name === "Every day"
                    ? "menu-card today"
                    : "menu-card"
                }
                key={item.id || item.day_name}
              >
                {(item.day_name === dayNames[todayIndex] ||
                  item.day_name === "Every day") && <span>Today</span>}
                <h3>{item.day_name}</h3>
                <p>{item.name}</p>
                <p>{item.price} €</p>
                <p>Dietary: {dietaryNames.join(", ")}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="location-section">
        <h2>Sijainti</h2>

        {/* TODO: Load the restaurant name and address from the locations API. */}
        <p>Pizzeria Napoli</p>
        <p>Kivenlahdentie 10, 02320 Espoo</p>

        <iframe
          title="Pizzeria Napolin sijainti kartalla"
          src="https://www.openstreetmap.org/export/embed.html?bbox=24.643%2C60.178%2C24.673%2C60.188&layer=mapnik&marker=60.183%2C24.658"
        ></iframe>
      </section>
    </>
  );
}

export default Home;
