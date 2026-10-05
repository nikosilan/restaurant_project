import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

const useMenu = (locationId = 1) => {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMenu = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${API_URL}/api/menu?locationId=${locationId}`,
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch menu (${response.status})`);
        }

        const data = await response.json();
        setMenu(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, [locationId]);

  return { menu, loading, error };
};

export { useMenu };
