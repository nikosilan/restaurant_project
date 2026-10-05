import {
  archiveMenuItem,
  createMenuItem,
  listMenuForAdmin,
  updateMenuItem,
  updateMenuItemLocation,
} from "../models/admin-menu-model.js";

const VALID_WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const getAdminMenu = async (request, response, next) => {
  const locationId = Number(request.query.locationId);
  if (!Number.isInteger(locationId) || locationId <= 0) {
    response
      .status(400)
      .json({ error: "A valid locationId query parameter is required." });
    return;
  }

  try {
    const { items, categoryRows, tagRows } = await listMenuForAdmin(locationId);
    const menu = new Map(
      items.map((item) => [
        item.id,
        {
          id: item.id,
          nameEn: item.name_en,
          nameFi: item.name_fi,
          descriptionEn: item.description_en,
          descriptionFi: item.description_fi,
          imageUrl: item.image_url,
          price: item.price,
          active: Boolean(item.active),
          dayOfWeek: item.day_of_week,
          updatedAt: item.updated_at,
          categoryIds: [],
          dietaryTagIds: [],
        },
      ]),
    );

    for (const row of categoryRows) {
      menu.get(row.menu_item_id)?.categoryIds.push(row.category_id);
    }
    for (const row of tagRows) {
      menu.get(row.menu_item_id)?.dietaryTagIds.push(row.dietary_tag_id);
    }

    response.json([...menu.values()]);
  } catch (error) {
    next(error);
  }
};

const validateDayOfWeek = (dayOfWeek) => {
  if (dayOfWeek === undefined || dayOfWeek === null || dayOfWeek === "") {
    return null;
  }

  const days = String(dayOfWeek)
    .split(",")
    .map((day) => day.trim());

  return days.every((day) => VALID_WEEKDAYS.includes(day))
    ? null
    : `dayOfWeek must contain only: ${VALID_WEEKDAYS.join(", ")}.`;
};

const validateMenuItemInput = (body = {}) => {
  if (!body.nameEn || !body.nameFi) {
    return "nameEn and nameFi are required.";
  }
  if (
    !Number.isInteger(Number(body.locationId)) ||
    Number(body.locationId) <= 0
  ) {
    return "A valid locationId is required.";
  }
  if (Number.isNaN(Number(body.price)) || Number(body.price) <= 0) {
    return "A valid, positive price is required.";
  }
  return validateDayOfWeek(body.dayOfWeek);
};

const postMenuItem = async (request, response, next) => {
  const validationError = validateMenuItemInput(request.body);
  if (validationError) {
    response.status(400).json({ error: validationError });
    return;
  }

  try {
    const id = await createMenuItem(request.body);
    response.status(201).json({ id });
  } catch (error) {
    next(error);
  }
};

const putMenuItem = async (request, response, next) => {
  const menuItemId = Number(request.params.id);
  if (!Number.isInteger(menuItemId) || menuItemId <= 0) {
    response.status(400).json({ error: "Invalid menu item id." });
    return;
  }

  const validationError = validateMenuItemInput(request.body);
  if (validationError) {
    response.status(400).json({ error: validationError });
    return;
  }

  try {
    const updated = await updateMenuItem(menuItemId, request.body);
    if (!updated) {
      response.status(404).json({ error: "Menu item not found." });
      return;
    }
    response.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

const patchMenuItemLocation = async (request, response, next) => {
  const menuItemId = Number(request.params.id);
  const { locationId, active, price, dayOfWeek } = request.body;

  if (!Number.isInteger(menuItemId) || menuItemId <= 0) {
    response.status(400).json({ error: "Invalid menu item id." });
    return;
  }
  if (!Number.isInteger(Number(locationId)) || Number(locationId) <= 0) {
    response.status(400).json({ error: "A valid locationId is required." });
    return;
  }
  if (active !== undefined && typeof active !== "boolean") {
    response.status(400).json({ error: "active must be true or false." });
    return;
  }
  const dayError = validateDayOfWeek(dayOfWeek);
  if (dayError) {
    response.status(400).json({ error: dayError });
    return;
  }
  if (active === undefined && price === undefined && dayOfWeek === undefined) {
    response.status(400).json({
      error: "Provide at least one of active, price, or dayOfWeek to update.",
    });
    return;
  }

  try {
    const updated = await updateMenuItemLocation(
      menuItemId,
      Number(locationId),
      { active, price, dayOfWeek },
    );
    if (!updated) {
      response
        .status(404)
        .json({ error: "That item is not listed at that location." });
      return;
    }
    response.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

const archiveMenuItemHandler = async (request, response, next) => {
  const menuItemId = Number(request.params.id);
  const locationId = Number(request.body.locationId);

  if (!Number.isInteger(menuItemId) || menuItemId <= 0) {
    response.status(400).json({ error: "Invalid menu item id." });
    return;
  }
  if (!Number.isInteger(locationId) || locationId <= 0) {
    response.status(400).json({ error: "A valid locationId is required." });
    return;
  }

  try {
    const archived = await archiveMenuItem(menuItemId, locationId);
    if (!archived) {
      response
        .status(404)
        .json({ error: "That item is not listed at that location." });
      return;
    }
    response.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

export {
  getAdminMenu,
  postMenuItem,
  putMenuItem,
  patchMenuItemLocation,
  archiveMenuItemHandler,
};
