import { useState } from "react";

import { useLanguage } from "../frontend/src/i18n";

function Admin() {
  const { language, t } = useLanguage();

  const [paivat] = useState([
    { nimi: { fi: "Maanantai", en: "Monday" }, ruoat: "[Ruoka 1] · [Ruoka 2]" },
    { nimi: { fi: "Tiistai", en: "Tuesday" }, ruoat: "[Ruoka 1] · [Ruoka 2]" },
    { nimi: { fi: "Keskiviikko", en: "Wednesday" }, ruoat: "[Ruoka 1] · [Ruoka 2]" },
    { nimi: { fi: "Torstai", en: "Thursday" }, ruoat: "[Ruoka 1] · [Ruoka 2]" },
    { nimi: { fi: "Perjantai", en: "Friday" }, ruoat: "[Ruoka 1] · [Ruoka 2]" },
  ]);

  const [valittu, setValittu] = useState(null);

  return (
    <div className="home">
      <h2>{t.admin.managementTitle}</h2>
      <p>{t.admin.managementSubtitle}</p>

      {valittu && (
        <div
          className="admin-modal-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setValittu(null);
          }}
        >
          <section
            className="admin-editor-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-editor-title"
          >
            <div className="admin-editor-heading">
              <h2 id="admin-editor-title">
                {t.admin.edit}: {valittu.nimi[language]}
              </h2>
              <button
                className="btn-secondary"
                type="button"
                onClick={() => setValittu(null)}
              >
                {t.admin.close}
              </button>
            </div>

            <div className="admin-form">
              <label htmlFor="nimi">{t.admin.editFood}</label>
              <input id="nimi" type="text" />

              <label htmlFor="kuvaus">{t.admin.editDescription}</label>
              <textarea id="kuvaus" />

              <label htmlFor="hinta">{t.admin.editPrice}</label>
              <input id="hinta" type="number" min="0" step="0.01" inputMode="decimal" />

              <label htmlFor="ruokavalio">{t.admin.editDietary}</label>
              <select id="ruokavalio">
                <option>G — Gluteeniton</option>
                <option>VEG — Kasvisruoka</option>
                <option>M — Maidoton</option>
                <option>L — Laktoositon</option>
              </select>

              <button className="btn" type="button">
                {t.admin.save}
              </button>
            </div>
          </section>
        </div>
      )}

      <div className="admin-list">
        {paivat.map((paiva) => (
          <div className="admin-row" key={paiva.nimi[language]}>
            <div>
              <strong>{paiva.nimi[language]}</strong>
              <div className="admin-meta">{paiva.ruoat}</div>
            </div>
            <button className="btn-secondary" onClick={() => setValittu(paiva)}>
              {t.admin.edit}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Admin;