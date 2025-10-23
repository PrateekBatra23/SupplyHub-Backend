
export function registerPrismaMiddlewares(prisma) {
  if (!prisma || typeof prisma.$use !== "function") {
    console.error("Invalid Prisma instance passed to middleware");
    return;
  }

  prisma.$use(async (params, next) => {
    // Handle Order status transitions
    if (params.model === "Order" && params.action === "update") {
      const existing = await prisma.order.findUnique({
        where: { id: params.args.where.id },
      });

      if (existing) {
        const newStatus = params.args.data.status;
        if (newStatus && !isValidOrderTransition(existing.status, newStatus)) {
          const message = `Invalid Order status transition: ${existing.status} -> ${newStatus}`;
          const error = new Error(message);
          error.code = "P4001";
          error.model = "Order";
          throw error;
        }
      }
    }

    // Handle Shipment status transitions
    if (params.model === "Shipment" && params.action === "update") {
      const existing = await prisma.shipment.findUnique({
        where: { id: params.args.where.id },
      });

      if (existing) {
        const newStatus = params.args.data.status;
        if (newStatus && !isValidShipmentTransition(existing.status, newStatus)) {
          const message = `Invalid Shipment status transition: ${existing.status} -> ${newStatus}`;
          const error = new Error(message);
          error.code = "P4002";
          error.model = "Shipment";
          throw error;
        }
      }
    }

    return next(params);
  });
}

// Order transition rules
function isValidOrderTransition(current, next) {
  const allowed = {
    Processing: ["InTransit", "Cancelled"],
    InTransit: ["Completed", "Cancelled"],
    Completed: [], // final
    Cancelled: [], // final
  };
  return allowed[current]?.includes(next) || current === next;
}

// Shipment transition rules
function isValidShipmentTransition(current, next) {
  const allowed = {
    Pending: ["Dispatched", "Cancelled"],
    Dispatched: ["Delivered", "Cancelled"],
    Delivered: [], // final
    Cancelled: [], // final
  };
  return allowed[current]?.includes(next) || current === next;
}
