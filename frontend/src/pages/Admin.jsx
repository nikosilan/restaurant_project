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

      {valittu && (
        <>
          <h2>Muokkaa: {valittu.nimi}</h2>

          <div className="admin-form">
            <label htmlFor="nimi">Ruoan nimi</label>
            <input id="nimi" type="text" />

            <label htmlFor="kuvaus">Kuvaus</label>
            <textarea id="kuvaus" />

            <label htmlFor="hinta">Hinta</label>
            <input id="hinta" type="text" />

            <label htmlFor="ruokavalio">Ruokavaliomerkinnät</label>
            <select id="ruokavalio">
              <option>G — Gluteeniton</option>
              <option>VEG — Kasvisruoka</option>
              <option>M — Maidoton</option>
              <option>L — Laktoositon</option>
            </select>

            <button className="btn">Tallenna muutokset</button>
          </div>
        </>
      )}
    </div>
  );
}

export default Admin;