import MenuCard from "../components/MenuCard";
import { useLanguage } from "../frontend/src/i18n";

const menu = [
  {
    day: { fi: "Maanantai", en: "Monday" },
    food: { fi: "Margherita", en: "Margherita" },
    price: 10,
    dietary: ["L"],
  },
  {
    day: { fi: "Tiistai", en: "Tuesday" },
    food: { fi: "Pepperoni", en: "Pepperoni" },
    price: 12,
    dietary: ["L"],
  },
  {
    day: { fi: "Keskiviikko", en: "Wednesday" },
    food: { fi: "Americana", en: "Americana" },
    price: 13,
    dietary: ["L"],
  },
  {
    day: { fi: "Torstai", en: "Thursday" },
    food: { fi: "Kebab", en: "Kebab" },
    price: 13,
    dietary: ["L"],
  },
  {
    day: { fi: "Perjantai", en: "Friday" },
    food: { fi: "Salami", en: "Salami" },
    price: 12,
    dietary: ["L"],
  },
];

function Menu() {
  const { language, t } = useLanguage();
  const today = new Date().getDay();

  return (
    <main className="home">
      <h2>{t.menu.title}</h2>
      <div className="menu-grid">
        {menu.map((item, index) => (
          <MenuCard
            key={item.day[language]}
            day={item.day[language]}
            food={item.food[language]}
            price={item.price}
            dietary={item.dietary}
            isToday={today === index + 1}
          />
        ))}
      </div>
    </main>
  );
}

export default Menu;
