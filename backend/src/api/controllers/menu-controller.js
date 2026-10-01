import { listMenuByLocation } from "../models/menu-model.js";

const combineMenu = (items, tagRows, categoryRows) => {
  const menu = new Map();

  for (const item of items) {
    menu.set(item.id, {
      id: item.id,
      day_name: item.day_of_week || "Every day",
      name: item.name_en,
      name_fi: item.name_fi,
      description: item.description_en,
      description_fi: item.description_fi,
      price: item.price,
      image_url: item.image_url,
      location_id: item.location_id,
      dietary: [],
      categories: [],
    });
  }

  for (const row of tagRows) {
    menu.get(row.menu_item_id)?.dietary.push({
      code: row.code,
      name_en: row.name_en,
      name_fi: row.name_fi,
    });
  }

  for (const row of categoryRows) {
    menu.get(row.menu_item_id)?.categories.push({
      id: row.category_id,
      name_en: row.category_name_en,
      name_fi: row.category_name_fi,
    });
  }

  return [...menu.values()];
};

const getMenu = async (request, response, next) => {
  try {
    // TODO: Use a configured or user-selected location instead of defaulting to 1.
    // TODO: Add error handling for invalid location IDs.
    const locationId = Number(request.query.locationId || 1);
    const { items, tagRows, categoryRows } =
      await listMenuByLocation(locationId);

    response.json(combineMenu(items, tagRows, categoryRows));
  } catch (error) {
    next(error);
  }
};

export { getMenu };
