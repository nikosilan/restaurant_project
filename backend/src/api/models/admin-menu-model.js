import pool from "../../utils/database.js";

const listMenuForAdmin = async (locationId) => {
  const [items] = await pool.execute(
    `SELECT menu_items.id, menu_items.name_en, menu_items.name_fi,
            menu_items.description_en, menu_items.description_fi,
            menu_items.image_url, menu_items.updated_at,
            menu_item_locations.price, menu_item_locations.active,
            menu_item_locations.day_of_week
     FROM menu_items
     JOIN menu_item_locations
       ON menu_item_locations.menu_item_id = menu_items.id
     WHERE menu_item_locations.location_id = ?
     ORDER BY menu_items.id`,
    [locationId],
  );

  if (items.length === 0) {
    return { items: [], categoryRows: [], tagRows: [] };
  }

  const itemIds = items.map((item) => item.id);
  // MySQL cannot bind an array to one question mark. Create one placeholder
  // for each ID while still passing every ID as a prepared-statement value.
  const placeholders = itemIds.map(() => "?").join(", ");
  const [categoryRows] = await pool.execute(
    `SELECT menu_item_id, category_id
     FROM menu_item_categories
     WHERE menu_item_id IN (${placeholders})`,
    itemIds,
  );
  const [tagRows] = await pool.execute(
    `SELECT menu_item_id, dietary_tag_id
     FROM menu_item_dietary_tags
     WHERE menu_item_id IN (${placeholders})`,
    itemIds,
  );

  return { items, categoryRows, tagRows };
};

const createMenuItem = async (data) => {
  const connection = await pool.getConnection();

  try {
    // A menu item is stored across several tables. Keep the inserts together
    // so a failure cannot leave an item without its location or tags.
    await connection.beginTransaction();
    const [itemResult] = await connection.execute(
      `INSERT INTO menu_items
        (name_en, name_fi, description_en, description_fi, image_url)
       VALUES (?, ?, ?, ?, ?)`,
      [
        data.nameEn,
        data.nameFi,
        data.descriptionEn || null,
        data.descriptionFi || null,
        data.imageUrl || null,
      ],
    );
    const menuItemId = itemResult.insertId;

    await connection.execute(
      `INSERT INTO menu_item_locations
        (menu_item_id, location_id, price, active, day_of_week)
       VALUES (?, ?, ?, ?, ?)`,
      [
        menuItemId,
        data.locationId,
        data.price,
        data.active ?? true,
        data.dayOfWeek || null,
      ],
    );

    for (const categoryId of data.categoryIds || []) {
      await connection.execute(
        `INSERT INTO menu_item_categories (menu_item_id, category_id)
         VALUES (?, ?)`,
        [menuItemId, categoryId],
      );
    }
    for (const dietaryTagId of data.dietaryTagIds || []) {
      await connection.execute(
        `INSERT INTO menu_item_dietary_tags (menu_item_id, dietary_tag_id)
         VALUES (?, ?)`,
        [menuItemId, dietaryTagId],
      );
    }

    await connection.commit();
    return menuItemId;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

const updateMenuItem = async (menuItemId, data) => {
  const connection = await pool.getConnection();

  try {
    // Updating the item and replacing its relationships must succeed as one operation.
    await connection.beginTransaction();
    const [itemResult] = await connection.execute(
      `UPDATE menu_items
       SET name_en = ?, name_fi = ?, description_en = ?, description_fi = ?,
           image_url = ?
       WHERE id = ?`,
      [
        data.nameEn,
        data.nameFi,
        data.descriptionEn || null,
        data.descriptionFi || null,
        data.imageUrl || null,
        menuItemId,
      ],
    );

    if (itemResult.affectedRows === 0) {
      await connection.rollback();
      return false;
    }

    await connection.execute(
      `INSERT INTO menu_item_locations
        (menu_item_id, location_id, price, active, day_of_week)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         price = VALUES(price),
         active = VALUES(active),
         day_of_week = VALUES(day_of_week)`,
      [
        menuItemId,
        data.locationId,
        data.price,
        data.active ?? true,
        data.dayOfWeek || null,
      ],
    );

    await connection.execute(
      "DELETE FROM menu_item_categories WHERE menu_item_id = ?",
      [menuItemId],
    );
    // The form sends the complete list, so replace the old category links
    // instead of trying to calculate which individual links changed.
    for (const categoryId of data.categoryIds || []) {
      await connection.execute(
        `INSERT INTO menu_item_categories (menu_item_id, category_id)
         VALUES (?, ?)`,
        [menuItemId, categoryId],
      );
    }

    await connection.execute(
      "DELETE FROM menu_item_dietary_tags WHERE menu_item_id = ?",
      [menuItemId],
    );
    for (const dietaryTagId of data.dietaryTagIds || []) {
      await connection.execute(
        `INSERT INTO menu_item_dietary_tags (menu_item_id, dietary_tag_id)
         VALUES (?, ?)`,
        [menuItemId, dietaryTagId],
      );
    }

    await connection.commit();
    return true;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

const updateMenuItemLocation = async (menuItemId, locationId, changes) => {
  const fields = [];
  const values = [];

  // PATCH may change only one location-specific field. The column names are
  // selected from this fixed list; the actual values remain parameterized.
  if (changes.price !== undefined) {
    fields.push("price = ?");
    values.push(changes.price);
  }
  if (changes.active !== undefined) {
    fields.push("active = ?");
    values.push(changes.active);
  }
  if (changes.dayOfWeek !== undefined) {
    fields.push("day_of_week = ?");
    values.push(changes.dayOfWeek);
  }

  if (fields.length === 0) {
    return false;
  }

  values.push(menuItemId, locationId);
  const [result] = await pool.execute(
    `UPDATE menu_item_locations
     SET ${fields.join(", ")}
     WHERE menu_item_id = ? AND location_id = ?`,
    values,
  );
  return result.affectedRows > 0;
};

const archiveMenuItem = async (menuItemId, locationId) => {
  const [result] = await pool.execute(
    `UPDATE menu_item_locations
     SET active = FALSE
     WHERE menu_item_id = ? AND location_id = ?`,
    [menuItemId, locationId],
  );
  return result.affectedRows > 0;
};

export {
  listMenuForAdmin,
  createMenuItem,
  updateMenuItem,
  updateMenuItemLocation,
  archiveMenuItem,
};
