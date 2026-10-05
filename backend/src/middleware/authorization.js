const requireAdmin = (request, response, next) => {
  if (response.locals.user?.role !== "admin") {
    response.status(403).json({ error: "Admin access required." });
    return;
  }

  next();
};

export { requireAdmin };
