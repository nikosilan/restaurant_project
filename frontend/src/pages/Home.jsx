import { useState } from "react";
import { Link } from "react-router-dom";

import { useLanguage } from "../i18n";
import { useMenu } from "../hooks/useMenu";

const dayNames = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const getText = (value, language) =>
  value?.[language] ?? value?.en ?? value ?? "";

const formatPrice = (value) =>
  Number(value).toFixed(2).replace(".", ",") + " €";

const pizzaImages = [
  {
    src: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1600&q=85",
    alt: {
      fi: "Tuore pizza juustolla ja basilikalla",
      en: "Fresh pizza with cheese and basil",
    },
    title: {
      fi: "Aitoa italialaista makua",
      en: "Authentic Italian flavor",
    },
  },
  {
    src: "https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=1600&q=85",
    alt: {
      fi: "Pizza paistuu kuumassa uunissa",
      en: "Pizza baking in a hot oven",
    },
    title: {
      fi: "Suoraan uunista pöytään",
      en: "Straight from the oven to the table",
    },
  },
  {
    src: "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?auto=format&fit=crop&w=1600&q=85",
    alt: {
      fi: "Herkullinen pizza runsailla täytteillä",
      en: "Delicious pizza with rich toppings",
    },
    title: {
      fi: "Löydä uusi suosikkisi",
      en: "Find your new favorite",
    },
  },
];

function translatedDay(day, translations) {
  const dayKey = day.toLowerCase();
  return translations.home.days[dayKey] || day;
}

function Home() {
  const { language, t } = useLanguage();
  const today = new Date().getDay();
  const todayIndex = today === 0 ? 6 : today - 1;
  const [activeImage, setActiveImage] = useState(0);
  const [selectedDay, setSelectedDay] = useState(todayIndex);
  const [addedPizza, setAddedPizza] = useState(null);
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

  const selectedDayName = dayNames[selectedDay];
  const dailyItems = fullMenu.filter(
    (item) => item.day_name === selectedDayName,
  );

  const addToCart = (item) => {
    const menuItem = {
      name: {
        en: item.name,
        fi: item.name_fi,
      },
      description: {
        en: item.description,
        fi: item.description_fi,
      },
      price: Number(item.price),
      day: {
        en: item.day_name,
        fi: translatedDay(item.day_name, t),
      },
    };

    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const pizza = {
      name: getText(menuItem.name, language),
      description: getText(menuItem.description, language),
      price: menuItem.price,
      day: getText(menuItem.day, language),
    };

    cart.push(pizza);
    localStorage.setItem("cart", JSON.stringify(cart));
    setAddedPizza(pizza);
  };

  return (
    <>
      <main className="home">
        <section className="pizza-carousel" aria-label={t.home.galleryLabel}>
          {pizzaImages.map((image, index) => (
            <div
              className={`pizza-slide${index === activeImage ? " active" : ""}`}
              key={image.src}
              aria-hidden={index !== activeImage}
            >
              <img
                src={image.src}
                alt={getText(image.alt, language)}
                onError={(event) => {
                  event.currentTarget.onerror = null;
                  event.currentTarget.src = "/pizza.svg";
                }}
              />
              <h2>{getText(image.title, language)}</h2>
            </div>
          ))}

          <button
            className="pizza-carousel-arrow previous"
            type="button"
            aria-label={t.home.previousImage}
            onClick={() => changeImage(-1)}
          >
            ‹
          </button>
          <button
            className="pizza-carousel-arrow next"
            type="button"
            aria-label={t.home.nextImage}
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
                aria-label={`${t.home.showImage} ${index + 1}`}
                aria-current={index === activeImage ? "true" : undefined}
                onClick={() => setActiveImage(index)}
              />
            ))}
          </div>
        </section>

        <section className="menu-section">
          <div className="day-navigation">
            <button
              type="button"
              className="day-button"
              onClick={previousDay}
              aria-label={
                language === "fi" ? "Edellinen päivä" : "Previous day"
              }
            >
              ←
            </button>

            <div
              className={
                selectedDay === todayIndex ? "day-name today" : "day-name"
              }
            >
              {translatedDay(dayNames[selectedDay], t)}
            </div>

            <button
              type="button"
              className="day-button"
              onClick={nextDay}
              aria-label={language === "fi" ? "Seuraava päivä" : "Next day"}
            >
              →
            </button>
          </div>

          <div className="day-menu">
            {isFullMenuLoading && (
              <p>
                {language === "fi"
                  ? "Ladataan ruokalistaa..."
                  : "Loading menu..."}
              </p>
            )}
            {fullMenuError && <p role="alert">{fullMenuError}</p>}
            {!isFullMenuLoading && dailyItems.length > 0
              ? dailyItems.map((item) => (
                  <article key={item.id}>
                    <h3>{language === "fi" ? item.name_fi : item.name}</h3>
                    <p>
                      {language === "fi"
                        ? item.description_fi
                        : item.description}
                    </p>
                    <strong>{formatPrice(item.price)}</strong>
                    <button
                      type="button"
                      className="btn"
                      onClick={() => addToCart(item)}
                    >
                      {t.home.addToCart}
                    </button>
                  </article>
                ))
              : !isFullMenuLoading && (
                  <p>
                    {language === "fi"
                      ? "Ei ruokalistaa tälle päivälle."
                      : "No menu available for this day."}
                  </p>
                )}
          </div>
        </section>
      </main>

      {addedPizza && (
        <div
          className="cart-confirmation-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setAddedPizza(null);
            }
          }}
        >
          <section
            className="cart-confirmation-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-confirmation-title"
          >
            <button
              className="cart-confirmation-close"
              type="button"
              aria-label={language === "fi" ? "Sulje" : "Close"}
              onClick={() => setAddedPizza(null)}
            >
              ×
            </button>
            <h2 id="cart-confirmation-title">{t.home.cartAdded}</h2>
            <div className="cart-confirmation-item">
              <div>
                <strong>{addedPizza.name}</strong>
                <span>{formatPrice(addedPizza.price)}</span>
              </div>
            </div>
            <button
              className="cart-confirmation-continue"
              type="button"
              onClick={() => setAddedPizza(null)}
            >
              {t.home.continueShopping}
            </button>
            <Link
              className="cart-confirmation-link"
              to="/cart"
              onClick={() => setAddedPizza(null)}
            >
              {t.home.goToCart}
            </Link>
          </section>
        </div>
      )}

      <section className="full-menu-section">
        <h2>{t.menu.title}</h2>
        {isFullMenuLoading && (
          <p>
            {language === "fi" ? "Ladataan ruokalistaa..." : "Loading menu..."}
          </p>
        )}
        {fullMenuError && <p role="status">{fullMenuError}</p>}

        <div className="menu-grid">
          {fullMenu.map((item) => {
            const dietaryNames = item.dietary.map((tag) =>
              typeof tag === "string"
                ? tag
                : getText(
                    { fi: tag.name_fi, en: tag.name_en || tag.code },
                    language,
                  ),
            );
            const isToday =
              item.day_name === dayNames[todayIndex] ||
              item.day_name === "Every day";

            return (
              <article
                className={isToday ? "menu-card today" : "menu-card"}
                key={item.id || `${item.day_name}-${item.name}`}
              >
                {isToday && <span>{t.menu.today}</span>}
                <h3>
                  {item.day_name === "Every day"
                    ? language === "fi"
                      ? "Joka päivä"
                      : "Every day"
                    : translatedDay(item.day_name, t)}
                </h3>
                <p>{language === "fi" ? item.name_fi : item.name}</p>
                <p>
                  {language === "fi" ? item.description_fi : item.description}
                </p>
                <p>{formatPrice(item.price)}</p>
                <p>
                  {t.menu.dietary} {dietaryNames.join(", ")}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="location-section">
        <h2>{t.home.location}</h2>
        <p>Pizzeria Napoli</p>
        <p>Lippajärventie 29, 02940 Espoo</p>
        <iframe
          title="Pizzeria Napolin sijainti kartalla"
          src="https://www.openstreetmap.org/export/embed.html?bbox=24.643%2C60.178%2C24.673%2C60.188&layer=mapnik&marker=60.183%2C24.658"
        />
      </section>
    </>
  );
}

export default Home;
