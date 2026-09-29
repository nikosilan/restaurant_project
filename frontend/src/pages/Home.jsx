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
  const [selectedDay, setSelectedDay] = useState(0);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveImage((current) => (current + 1) % pizzaImages.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, []);

  const changeImage = (direction) => {
    setActiveImage(
      (current) =>
        (current + direction + pizzaImages.length) % pizzaImages.length,
    );
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
          <div className="day-selector">
            <button className="day-arrow" type="button" aria-label="Edellinen päivä" onClick={previousDay}>
              ←
            </button>

            <h2>{currentMenu.day}</h2>

            <button className="day-arrow" type="button" aria-label="Seuraava päivä" onClick={nextDay}>
              →
            </button>
          </div>

          <div className="day-menu">
            <h3>{currentMenu.name}</h3>

            <p>{currentMenu.description}</p>

            <strong>{currentMenu.price.toFixed(2).replace(".", ",")} €</strong>

            <button className="btn" onClick={addToCart}>
              Lisää ostoskoriin
            </button>
          </div>
        </section>
      </main>

      <section className="location-section">
        <h2>Sijainti</h2>

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
