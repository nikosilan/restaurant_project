import { createOrder } from "../models/orders-model.js";

const postOrder = async (request, response, next) => {
  const { userId, locationId, items } = request.body;

  if (
    !Number.isInteger(Number(userId)) ||
    Number(userId) <= 0 ||
    !Number.isInteger(Number(locationId)) ||
    Number(locationId) <= 0 ||
    !Array.isArray(items) ||
    items.length === 0
  ) {
    response.status(400).json({
      error: "A valid user, location, and at least one item are required.",
    });
    return;
  }

  const itemIds = items.map((item) => Number(item.menuItemId));
  if (itemIds.some((id) => !Number.isInteger(id) || id <= 0)) {
    response
      .status(400)
      .json({ error: "Every order item must have a valid menuItemId." });
    return;
  }

  if (
    items.some(
      (item) =>
        !Number.isInteger(Number(item.quantity)) || Number(item.quantity) < 1,
    )
  ) {
    response
      .status(400)
      .json({ error: "Item quantities must be positive whole numbers." });
    return;
  }

  try {
    const result = await createOrder(Number(userId), Number(locationId), items);

    if (!result) {
      response.status(400).json({
        error: "One or more menu items do not exist at the selected location.",
      });
      return;
    }

    response.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export { postOrder };
