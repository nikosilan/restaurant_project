import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../i18n";

const LOCATION_ID = 1;
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

const emptyForm = {
  nameEn: "",
  nameFi: "",
  descriptionEn: "",
  descriptionFi: "",
  imageUrl: "",
  price: "",
  active: true,
  dayOfWeek: "",
  categoryIds: "",
  dietaryTagIds: "",
};

const toForm = (item) => ({
  nameEn: item.nameEn || "",
  nameFi: item.nameFi || "",
  descriptionEn: item.descriptionEn || "",
  descriptionFi: item.descriptionFi || "",
  imageUrl: item.imageUrl || "",
  price: item.price ?? "",
  active: item.active,
  dayOfWeek: item.dayOfWeek || "",
  categoryIds: item.categoryIds.join(", "),
  dietaryTagIds: item.dietaryTagIds.join(", "),
});

const parseIds = (value) =>
  value
    .split(",")
    .map((id) => Number(id.trim()))
    .filter((id) => Number.isInteger(id) && id > 0);

const loadMenuItems = async (token) => {
  const response = await fetch(
    `${API_URL}/api/admin/menu?locationId=${LOCATION_ID}`,
    { headers: { Authorization: `Bearer ${token}` } },
  );

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || "The menu could not be loaded.");
  }

  return response.json();
};

const getDayLabel = (day, translations) => {
  const dayKeys = {
    Monday: "monday",
    Tuesday: "tuesday",
    Wednesday: "wednesday",
    Thursday: "thursday",
    Friday: "friday",
  };

  return dayKeys[day] ? translations.home.days[dayKeys[day]] : day;
};

function Admin() {
  const { token } = useAuth();
  const { language, t } = useLanguage();
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  useEffect(() => {
    if (!token) {
      return;
    }

    const loadItems = async () => {
      setLoading(true);
      setError("");

      try {
        setItems(await loadMenuItems(token));
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setLoading(false);
      }
    };

    loadItems();
  }, [token]);

  const selectItem = (item) => {
    setSelectedItem(item);
    setForm(toForm(item));
    setIsEditorOpen(true);
    setMessage("");
    setError("");
  };

  const startNewItem = () => {
    setSelectedItem(null);
    setForm(emptyForm);
    setIsEditorOpen(true);
    setMessage("");
    setError("");
  };

  const closeEditor = () => {
    setSelectedItem(null);
    setForm(emptyForm);
    setIsEditorOpen(false);
  };

  const updateField = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const saveItem = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    const payload = {
      ...form,
      locationId: LOCATION_ID,
      price: Number(form.price),
      categoryIds: parseIds(form.categoryIds),
      dietaryTagIds: parseIds(form.dietaryTagIds),
    };

    try {
      const path = selectedItem
        ? `/api/admin/menu/${selectedItem.id}`
        : "/api/admin/menu";
      const method = selectedItem ? "PUT" : "POST";
      const response = await fetch(`${API_URL}${path}`, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "The menu item could not be saved.");
      }

      setItems(await loadMenuItems(token));
      setMessage(
        selectedItem ? t.admin.menuUpdated : t.admin.menuCreated,
      );
      closeEditor();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  };

  const archiveItem = async (item) => {
    if (!window.confirm(`${t.admin.archiveConfirm} ${item.nameEn}?`)) {
      return;
    }

    setMessage("");
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/api/admin/menu/${item.id}/archive`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ locationId: LOCATION_ID }),
        },
      );

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "The menu item could not be archived.");
      }

      setItems(await loadMenuItems(token));
      if (selectedItem?.id === item.id) {
        closeEditor();
      }
      setMessage(t.admin.menuArchived);
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  return (
    <main className="admin-page">
      <h2>{t.admin.managementTitle}</h2>
      <p>{t.admin.managementSubtitle}</p>

      {loading && <p>{t.admin.loading}</p>}
      {error && <p role="alert">{error}</p>}
      {message && <p role="status">{message}</p>}

      {!loading && (
        <div className="admin-list">
          {items.map((item) => (
            <div className="admin-row" key={item.id}>
              <div>
                <strong>{language === "fi" ? item.nameFi : item.nameEn}</strong>
                <div className="admin-meta">
                  {item.dayOfWeek
                    ? getDayLabel(item.dayOfWeek, t)
                    : t.admin.everyDay}{" "}
                  · {item.price} € ·{" "}
                  {item.active ? t.admin.active : t.admin.archived}
                </div>
              </div>
              <div>
                <button
                  className="btn-secondary"
                  type="button"
                  onClick={() => selectItem(item)}
                >
                  {t.admin.edit}
                </button>{" "}
                {item.active && (
                  <button
                    className="btn-secondary"
                    type="button"
                    onClick={() => archiveItem(item)}
                  >
                    {t.admin.archive}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <button className="btn" type="button" onClick={startNewItem}>
        {t.admin.addItem}
      </button>

      {isEditorOpen && (
        <div
          className="admin-modal-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeEditor();
            }
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
                {selectedItem ? t.admin.editItem : t.admin.addItem}
              </h2>
              <button
                className="btn-secondary"
                type="button"
                onClick={closeEditor}
              >
                {t.admin.close}
              </button>
            </div>

            <form className="admin-form" onSubmit={saveItem}>
              <label htmlFor="nameEn">{t.admin.nameEn}</label>
              <input
                id="nameEn"
                name="nameEn"
                value={form.nameEn}
                onChange={updateField}
                required
              />

              <label htmlFor="nameFi">{t.admin.nameFi}</label>
              <input
                id="nameFi"
                name="nameFi"
                value={form.nameFi}
                onChange={updateField}
                required
              />

              <label htmlFor="descriptionEn">{t.admin.descriptionEn}</label>
              <textarea
                id="descriptionEn"
                name="descriptionEn"
                value={form.descriptionEn}
                onChange={updateField}
              />

              <label htmlFor="descriptionFi">{t.admin.descriptionFi}</label>
              <textarea
                id="descriptionFi"
                name="descriptionFi"
                value={form.descriptionFi}
                onChange={updateField}
              />

              <label htmlFor="imageUrl">{t.admin.imageUrl}</label>
              <input
                id="imageUrl"
                name="imageUrl"
                value={form.imageUrl}
                onChange={updateField}
              />

              <label htmlFor="price">{t.admin.price}</label>
              <input
                id="price"
                name="price"
                type="number"
                min="0.01"
                step="0.01"
                value={form.price}
                onChange={updateField}
                required
              />

              <label htmlFor="dayOfWeek">{t.admin.days}</label>
              <input
                id="dayOfWeek"
                name="dayOfWeek"
                value={form.dayOfWeek}
                onChange={updateField}
                placeholder="Monday, Wednesday, Friday"
              />

              <label htmlFor="categoryIds">{t.admin.categoryIds}</label>
              <input
                id="categoryIds"
                name="categoryIds"
                value={form.categoryIds}
                onChange={updateField}
                placeholder="1, 2"
              />

              <label htmlFor="dietaryTagIds">{t.admin.dietaryTagIds}</label>
              <input
                id="dietaryTagIds"
                name="dietaryTagIds"
                value={form.dietaryTagIds}
                onChange={updateField}
                placeholder="1, 3"
              />

              <label>
                <input
                  name="active"
                  type="checkbox"
                  checked={form.active}
                  onChange={updateField}
                />{" "}
                {t.admin.active}
              </label>

              <button className="btn" type="submit" disabled={saving}>
                {saving ? t.admin.saving : t.admin.save}
              </button>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}

export default Admin;
