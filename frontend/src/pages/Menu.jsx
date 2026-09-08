import MenuCard from "../components/MenuCard";

const menu = [
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
  const today = new Date().getDay();

  return (
    <section>
      <h2>Weekly Menu</h2>

      <div className="menu-grid">
        {menu.map((item, index) => {
          const menuDay = index + 1;

          return (
            <MenuCard
              key={item.day}
              day={item.day}
              food={item.food}
              price={item.price}
              dietary={item.dietary}
              isToday={today === menuDay}
            />
          );
        })}
      </div>
    </section>
  );
}

export default Menu;