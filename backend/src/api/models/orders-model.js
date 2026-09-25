import pool from "../../utils/database.js";

// TODO (auth): userId currently trusted from request body — must be replaced
// with the authenticated users id once auth middleware exists.
const createOrder = async (userId, locationId, items) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const itemIds = items.map((item) => Number(item.menuItemId));
    const placeholders = itemIds.map(() => "?").join(", ");
    const [menuRows] = await connection.execute(
      `SELECT menu_items.id, menu_item_locations.price
       FROM menu_items
       JOIN menu_item_locations
         ON menu_item_locations.menu_item_id = menu_items.id
       WHERE menu_item_locations.location_id = ?
         AND menu_item_locations.active = TRUE
         AND menu_items.id IN (${placeholders})`,
      [locationId, ...itemIds],
    );
    const prices = new Map(
      menuRows.map((item) => [item.id, Number(item.price)]),
    );

    if (menuRows.length !== new Set(itemIds).size) {
      await connection.rollback();
      return false;
    }

    const normalizedItems = items.map((item) => ({
      menuItemId: Number(item.menuItemId),
      quantity: Number(item.quantity),
      unitPrice: prices.get(Number(item.menuItemId)),
    }));
    const total = normalizedItems.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0,
    );

    const [orderResult] = await connection.execute(
      `INSERT INTO orders (user_id, location_id, total_price)
       VALUES (?, ?, ?)`,
      [userId, locationId, total.toFixed(2)],
    );

    for (const item of normalizedItems) {
      await connection.execute(
        `INSERT INTO order_items (order_id, menu_item_id, quantity, price_at_order)
         VALUES (?, ?, ?, ?)`,
        [orderResult.insertId, item.menuItemId, item.quantity, item.unitPrice],
      );
    }

    await connection.commit();
    return { orderId: orderResult.insertId, total: total.toFixed(2) };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

export { createOrder };
