import { useEffect, useState } from "react";

import MenuCard from "../components/MenuCard";

const fallbackMenu = [
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

function Menu() {
  const [menu, setMenu] = useState(fallbackMenu);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const weekdayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const today = weekdayNames[new Date().getDay()];

  useEffect(() => {
    fetch("/api/menu")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Menu could not be loaded.");
        }
        return response.json();
      })
      .then((items) => {
        setMenu(
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
        setError(
          "Showing the sample menu. Start the backend to load live data.",
        ),
      )
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <section>
      <h2>Weekly Menu</h2>

      {isLoading && <p>Loading menu...</p>}
      {error && <p role="status">{error}</p>}

      <div className="menu-grid">
        {menu.map((item) => {
          return (
            <MenuCard
              key={item.id || item.day}
              day={item.day}
              food={item.food}
              price={item.price}
              dietary={item.dietary}
              isToday={item.day === today || item.day === "Every day"}
            />
          );
        })}
      </div>
    </section>
  );
}

export default Menu;
