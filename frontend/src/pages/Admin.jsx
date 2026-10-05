import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const LOCATION_ID = 1;
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

// The form keeps these values as strings because they come directly from inputs.
// They are converted to numbers when the form is submitted.
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

// The API returns category and tag IDs as arrays, but comma-separated text is
// easier for a person to edit in a single input field.
const toForm = (item) => ({
  nameEn: item.nameEn,
  nameFi: item.nameFi,
  descriptionEn: item.descriptionEn || "",
  descriptionFi: item.descriptionFi || "",
  imageUrl: item.imageUrl || "",
  price: item.price,
  active: item.active,
  dayOfWeek: item.dayOfWeek || "",
  categoryIds: item.categoryIds.join(", "),
  dietaryTagIds: item.dietaryTagIds.join(", "),
});

// Ignore blank or invalid IDs so the backend receives an array of positive integers.
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

function Admin() {
  const { token } = useAuth();
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

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

    // Load the list only after AuthContext has supplied a token.
    loadItems();
  }, [token]);

  const selectItem = (item) => {
    setSelectedItem(item);
    setForm(toForm(item));
    setMessage("");
    setError("");
  };

  const startNewItem = () => {
    setSelectedItem(null);
    setForm(emptyForm);
    setMessage("");
    setError("");
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
      // Browser inputs are strings; the API expects a number and arrays of IDs.
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
      setMessage(selectedItem ? "Menu item updated." : "Menu item created.");
      if (!selectedItem) {
        setForm(emptyForm);
      }
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  };

  const archiveItem = async (item) => {
    if (!window.confirm(`Archive ${item.nameEn} at this location?`)) {
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
        startNewItem();
      }
      setMessage("Menu item archived.");
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  return (
    <main className="admin-page">
      <h2>Menu administration</h2>
      <p>Add, edit, assign, and archive menu items for this location.</p>

      {loading && <p>Loading menu...</p>}
      {error && <p role="alert">{error}</p>}
      {message && <p role="status">{message}</p>}

      {!loading && (
        <div className="admin-list">
          {items.map((item) => (
            <div className="admin-row" key={item.id}>
              <div>
                <strong>{item.nameEn}</strong>
                <div className="admin-meta">
                  {item.dayOfWeek || "Every day"} · {item.price} € ·{" "}
                  {item.active ? "Active" : "Archived"}
                </div>
              </div>
              <div>
                <button
                  className="btn-secondary"
                  type="button"
                  onClick={() => selectItem(item)}>
                  Edit
                </button>{" "}
                {item.active && (
                  <button
                    className="btn-secondary"
                    type="button"
                    onClick={() => archiveItem(item)}>
                    Archive
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <button className="btn" type="button" onClick={startNewItem}>
        Add menu item
      </button>

      <h2>{selectedItem ? "Edit menu item" : "Add menu item"}</h2>
      <form className="admin-form" onSubmit={saveItem}>
        <label htmlFor="nameEn">Name in English</label>
        <input
          id="nameEn"
          name="nameEn"
          value={form.nameEn}
          onChange={updateField}
          required
        />

        <label htmlFor="nameFi">Name in Finnish</label>
        <input
          id="nameFi"
          name="nameFi"
          value={form.nameFi}
          onChange={updateField}
          required
        />

        <label htmlFor="descriptionEn">Description in English</label>
        <textarea
          id="descriptionEn"
          name="descriptionEn"
          value={form.descriptionEn}
          onChange={updateField}
        />

        <label htmlFor="descriptionFi">Description in Finnish</label>
        <textarea
          id="descriptionFi"
          name="descriptionFi"
          value={form.descriptionFi}
          onChange={updateField}
        />

        <label htmlFor="imageUrl">Image URL</label>
        <input
          id="imageUrl"
          name="imageUrl"
          value={form.imageUrl}
          onChange={updateField}
        />

        <label htmlFor="price">Price</label>
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

        <label htmlFor="dayOfWeek">Lunch days</label>
        <input
          id="dayOfWeek"
          name="dayOfWeek"
          value={form.dayOfWeek}
          onChange={updateField}
          placeholder="Monday, Wednesday, Friday"
        />

        <label htmlFor="categoryIds">Category IDs</label>
        <input
          id="categoryIds"
          name="categoryIds"
          value={form.categoryIds}
          onChange={updateField}
          placeholder="1, 2"
        />

        <label htmlFor="dietaryTagIds">Dietary tag IDs</label>
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
          Active
        </label>

        <button className="btn" type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save changes"}
        </button>
      </form>
    </main>
  );
}

export default Admin;
