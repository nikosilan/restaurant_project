function MenuCard({ day, food, price, dietary, isToday }) {
  return (
    <article className={isToday ? "menu-card today" : "menu-card"}>
      {isToday && <span>Today</span>}

      <h3>{day}</h3>

      <p>{food}</p>

      <p>{price} €</p>

      <p>Dietary: {dietary.join(", ")}</p>
    </article>
  );
}

export default MenuCard;