import { useState } from "react";

function Admin() {
  const [paivat] = useState([
    { nimi: "Maanantai", ruoat: "[Ruoka 1] · [Ruoka 2]" },
    { nimi: "Tiistai", ruoat: "[Ruoka 1] · [Ruoka 2]" },
    { nimi: "Keskiviikko", ruoat: "[Ruoka 1] · [Ruoka 2]" },
    { nimi: "Torstai", ruoat: "[Ruoka 1] · [Ruoka 2]" },
    { nimi: "Perjantai", ruoat: "[Ruoka 1] · [Ruoka 2]" },
  ]);

  const [valittu, setValittu] = useState(null);

  return (
    <div className="home">
      <h2>Ruokalistan muokkaus</h2>
      <p>Valitse päivä ja muokkaa sen ruokia.</p>

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
              <h2 id="admin-editor-title">Muokkaa: {valittu.nimi}</h2>
              <button
                className="btn-secondary"
                type="button"
                onClick={() => setValittu(null)}
              >
                Sulje
              </button>
            </div>

            <div className="admin-form">
              <label htmlFor="nimi">Ruoan nimi</label>
              <input id="nimi" type="text" />

              <label htmlFor="kuvaus">Kuvaus</label>
              <textarea id="kuvaus" />

              <label htmlFor="hinta">Hinta</label>
              <input id="hinta" type="number" min="0" step="0.01" inputMode="decimal" />

              <label htmlFor="ruokavalio">Ruokavaliomerkinnät</label>
              <select id="ruokavalio">
                <option>G — Gluteeniton</option>
                <option>VEG — Kasvisruoka</option>
                <option>M — Maidoton</option>
                <option>L — Laktoositon</option>
              </select>

              <button className="btn" type="button">Tallenna muutokset</button>
            </div>
          </section>
        </div>
      )}

      <div className="admin-list">
        {paivat.map((paiva) => (
          <div className="admin-row" key={paiva.nimi}>
            <div>
              <strong>{paiva.nimi}</strong>
              <div className="admin-meta">{paiva.ruoat}</div>
            </div>
            <button className="btn-secondary" onClick={() => setValittu(paiva)}>
              Muokkaa
            </button>
          </div>
        ))}
      </div>

    </div>
  );
}

export default Admin;