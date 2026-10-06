import { createContext, useContext } from "react";

export const languages = [
  { code: "fi", label: "FI" },
  { code: "en", label: "EN" },
];

export const translations = {
  fi: {
    nav: {
      home: "Etusivu",
      menu: "Menu",
      admin: "Ylläpito",
      cart: "Ostoskori",
    },
    home: {
      galleryLabel: "Pizzakuvagalleria",
      previousImage: "Edellinen kuva",
      nextImage: "Seuraava kuva",
      showImage: "Näytä kuva",
      addToCart: "Lisää ostoskoriin",
      cartAdded: "Lisätty ostoskoriin!",
      continueShopping: "Jatka ostoksia",
      goToCart: "Siirry ostoskoriin",
      location: "Sijainti",
      days: {
        monday: "Maanantai",
        tuesday: "Tiistai",
        wednesday: "Keskiviikko",
        thursday: "Torstai",
        friday: "Perjantai",
        saturday: "Lauantai",
        sunday: "Sunnuntai",
      },
      today: "Tänään",
    },
    menu: {
      title: "Viikon ruokalista",
      today: "Tänään",
      dietary: "Ravintosisältö:",
    },
    cart: {
      title: "Ostoskori",
      empty: "Ostoskorisi on tyhjä.",
      remove: "Poista",
      total: "Yhteensä",
    },
    admin: {
      loginTitle: "Kirjaudu ylläpitoon",
      loginSubtitle: "Vain henkilökunnalle.",
      username: "Käyttäjätunnus",
      password: "Salasana",
      loginButton: "Kirjaudu sisään",
      managementTitle: "Ruokalistan muokkaus",
      managementSubtitle: "Valitse päivä ja muokkaa sen ruokia.",
      edit: "Muokkaa",
      close: "Sulje",
      save: "Tallenna muutokset",
      editFood: "Ruoan nimi",
      editDescription: "Kuvaus",
      editPrice: "Hinta",
      editDietary: "Ruokavaliomerkinnät",
    },
    common: {
      selectLanguage: "Valitse kieli",
    },
  },
  en: {
    nav: {
      home: "Home",
      menu: "Menu",
      admin: "Admin",
      cart: "Cart",
    },
    home: {
      galleryLabel: "Pizza gallery",
      previousImage: "Previous image",
      nextImage: "Next image",
      showImage: "Show image",
      addToCart: "Add to cart",
      cartAdded: "Added to cart!",
      continueShopping: "Continue shopping",
      goToCart: "Go to cart",
      location: "Location",
      days: {
        monday: "Monday",
        tuesday: "Tuesday",
        wednesday: "Wednesday",
        thursday: "Thursday",
        friday: "Friday",
        saturday: "Saturday",
        sunday: "Sunday",
      },
      today: "Today",
    },
    menu: {
      title: "This week's menu",
      today: "Today",
      dietary: "Dietary:",
    },
    cart: {
      title: "Shopping Cart",
      empty: "Your cart is empty.",
      remove: "Remove",
      total: "Total",
    },
    admin: {
      loginTitle: "Admin login",
      loginSubtitle: "For staff only.",
      username: "Username",
      password: "Password",
      loginButton: "Sign in",
      managementTitle: "Menu management",
      managementSubtitle: "Choose a day and edit its dishes.",
      edit: "Edit",
      close: "Close",
      save: "Save changes",
      editFood: "Dish name",
      editDescription: "Description",
      editPrice: "Price",
      editDietary: "Dietary labels",
    },
    common: {
      selectLanguage: "Select language",
    },
  },
};

export const LanguageContext = createContext(null);

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used within a LanguageContext provider");
  }

  return context;
}
