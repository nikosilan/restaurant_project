import { useLanguage } from "../frontend/src/i18n";

function MenuCard({ day, food, price, dietary, isToday }) {
  const { t } = useLanguage();

  return (
    <article className={isToday ? "menu-card today" : "menu-card"}>
      {isToday && <span>{t.menu.today}</span>}

      <h3>{day}</h3>

      <p>{food}</p>

      <p>{price} €</p>

      <p>
        {t.menu.dietary} {dietary.join(", ")}
      </p>
    </article>
  );
}

export default MenuCard;