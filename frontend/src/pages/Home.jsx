import { useEffect, useState } from "react";

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

// TODO: Load the daily menu from the database instead of keeping a second menu here.
// Also the whole Home.jsx is a bit messy after the quick implementation I did, we should fix that before submission.
// Today is a plain number from 0 to 6, where 0 is Sunday and 6 is Saturday. The menu array uses 0 for Monday and 6 for Sunday, so we need to adjust the index accordingly.
// hardcoded menu includes lauantai and sunnuntai, but the database has five values only (Monday to Friday).
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

// Keep a small fallback so the homepage remains usable when the API is offline.
// Remove this before submission, as the menu should be loaded from the database instead.
const fallbackFullMenu = [
  {
    day: "Monday",
    food: "Margherita",
    price: 10,
    dietary: ["L"],
  },
  {
    day: "Tuesday",
    food: "Pepperoni",
    price: 12,
    dietary: ["L"],
  },
  {
    day: "Wednesday",
    food: "Americana",
    price: 13,
    dietary: ["L"],
  },
  {
    day: "Thursday",
    food: "Kebab",
    price: 13,
    dietary: ["L"],
  },
  {
    day: "Friday",
    food: "Salami",
    price: 12,
    dietary: ["L"],
  },
];

function Home() {
  const today = new Date().getDay();

  const [activeImage, setActiveImage] = useState(0);
  const [fullMenu, setFullMenu] = useState(fallbackFullMenu);
  const [isFullMenuLoading, setIsFullMenuLoading] = useState(true);
  const [fullMenuError, setFullMenuError] = useState("");

  const [selectedDay, setSelectedDay] = useState(today === 0 ? 6 : today - 1);

  useEffect(() => {
    fetch("/api/menu")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Menu could not be loaded.");
        }
        return response.json();
      })
      .then((items) => {
        setFullMenu(
          items.map((item) => ({
            id: item.id,
            day: item.day_name,
            food: item.name,
            price: Number(item.price),
            dietary: item.dietary || [],
          })),
        );
      })
      .catch(() =>
        setFullMenuError(
          "Showing the sample menu. Start the backend to load live data.",
        ),
      )
      .finally(() => setIsFullMenuLoading(false));
  }, []);

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
      current === 0 ? menu.length - 1 : current - 1,
    );
  };

  const nextDay = () => {
    setSelectedDay((current) =>
      current === menu.length - 1 ? 0 : current + 1,
    );
  };

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    cart.push(menu[selectedDay]);

    localStorage.setItem("cart", JSON.stringify(cart));

    alert("Tuote lisätty ostoskoriin!");
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
            <button type="button" className="day-button" onClick={previousDay}>
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

            <button type="button" className="day-button" onClick={nextDay}>
              →
            </button>
          </div>

          <div className="day-menu">
            <h3>{currentMenu.name}</h3>

            <p>{currentMenu.description}</p>

            <strong>{currentMenu.price.toFixed(2).replace(".", ",")} €</strong>

            <button type="button" className="btn" onClick={addToCart}>
              Add to cart
            </button>
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
                  item.day === today || item.day === "Every day"
                    ? "menu-card today"
                    : "menu-card"
                }
                key={item.id || item.day}
              >
                {(item.day === today || item.day === "Every day") && (
                  <span>Today</span>
                )}
                <h3>{item.day}</h3>
                <p>{item.food}</p>
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
