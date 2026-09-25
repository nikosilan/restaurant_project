import pool from "../../utils/database.js";

const listMenuByLocation = async (locationId) => {
  const [items] = await pool.execute(
    `SELECT menu_items.id, menu_item_locations.day_of_week,
            menu_items.name_en, menu_items.name_fi,
            menu_items.description_en, menu_items.description_fi,
            menu_items.image_url, menu_item_locations.price,
            menu_item_locations.location_id
     FROM menu_items
     JOIN menu_item_locations
       ON menu_item_locations.menu_item_id = menu_items.id
     WHERE menu_item_locations.location_id = ?
       AND menu_item_locations.active = TRUE
     ORDER BY FIELD(menu_item_locations.day_of_week,
       'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'),
       menu_items.id`,
    [locationId],
  );

  if (items.length === 0) {
    return { items: [], tagRows: [], categoryRows: [] };
  }

  const itemIds = items.map((item) => item.id);
  const placeholders = itemIds.map(() => "?").join(", ");

  const [tagRows] = await pool.execute(
    `SELECT menu_item_dietary_tags.menu_item_id, dietary_tags.code, dietary_tags.name_en, dietary_tags.name_fi
     FROM menu_item_dietary_tags
     JOIN dietary_tags
       ON dietary_tags.id = menu_item_dietary_tags.dietary_tag_id
     WHERE menu_item_dietary_tags.menu_item_id IN (${placeholders})`,
    itemIds,
  );

  const [categoryRows] = await pool.execute(
    `SELECT menu_item_categories.menu_item_id,
            categories.id AS category_id,
            categories.name_en AS category_name_en,
            categories.name_fi AS category_name_fi
     FROM menu_item_categories
     JOIN categories
       ON categories.id = menu_item_categories.category_id
     WHERE menu_item_categories.menu_item_id IN (${placeholders})`,
    itemIds,
  );

  return { items, tagRows, categoryRows };
};

export { listMenuByLocation };
