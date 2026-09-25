function MenuCard({ day, food, price, dietary, isToday, language = "en" }) {
  const dietaryNames = dietary.map(
    (tag) => tag[`name_${language}`] || tag.name_en || tag.code || tag,
  );

  return (
    <article className={isToday ? "menu-card today" : "menu-card"}>
      {isToday && <span>Today</span>}

      <h3>{day}</h3>

      <p>{food}</p>

      <p>{price} €</p>

      <p>Dietary: {dietaryNames.join(", ")}</p>
    </article>
  );
}

export default MenuCard;
