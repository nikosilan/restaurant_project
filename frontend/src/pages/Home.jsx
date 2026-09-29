import { useState } from "react";

const menu = [
  {
    day: "Maanantai",
    name: "Pepperoni Pizza",
    description: "Tomaattikastike, mozzarella ja pepperoni",
    price: 12.9,
  },
  {
    day: "Tiistai",
    name: "Kinkku Pizza",
    description: "Tomaattikastike, mozzarella ja kinkku",
    price: 12.9,
  },
  {
    day: "Keskiviikko",
    name: "Kebab Pizza",
    description: "Tomaattikastike, mozzarella, kebab ja sipuli",
    price: 13.9,
  },
  {
    day: "Torstai",
    name: "Kana Pizza",
    description: "Tomaattikastike, mozzarella, kana ja ananas",
    price: 13.9,
  },
  {
    day: "Perjantai",
    name: "Opera Pizza",
    description: "Tomaattikastike, mozzarella, kinkku ja tonnikala",
    price: 13.9,
  },
  {
    day: "Lauantai",
    name: "Quattro Formaggi",
    description: "Mozzarella, gorgonzola, parmesaani ja emmental",
    price: 14.9,
  },
  {
    day: "Sunnuntai",
    name: "Margherita Pizza",
    description: "Tomaattikastike, mozzarella ja basilika",
    price: 11.9,
  },
];

function Home() {
  const today = new Date().getDay();

  const [selectedDay, setSelectedDay] = useState(
    today === 0 ? 6 : today - 1
  );

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

    cart.push(menu[selectedDay]);

    localStorage.setItem("cart", JSON.stringify(cart));

    alert("Tuote lisätty ostoskoriin!");
  };

  const currentMenu = menu[selectedDay];

  return (
    <>
      <main className="home">
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

      <section className="location-section">
        <h2>Location</h2>

        <p>Pizzeria Napoli</p>
        <p>Kivenlahdentie 10, 02320 Espoo</p>

        <iframe
          title="Pizzeria Napoli location"
          src="https://www.openstreetmap.org/export/embed.html?bbox=24.643%2C60.178%2C24.673%2C60.188&layer=mapnik&marker=60.183%2C24.658"
        ></iframe>
      </section>
    </>
  );
}

export default Home;
