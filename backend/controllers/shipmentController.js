import prisma from "../prismaClient.js";


export const fetchShipment= async (req,res)=>{
    try {
    const includeCancelled = req.query.includeCancelled === "true";
    const where = includeCancelled ? {} : { status: { not: "Cancelled" } };


    const shipments = await prisma.shipment.findMany({
      where,
      include: { order: true, warehouse: true },
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json(shipments);
  } catch (error) {
    console.error("Error fetching shipments:", error);
    res.status(500).json({ error: "Failed to fetch shipments" });
  }
};

export const createShipment = async (req, res) => {
  try {
    const { orderId, warehouseId, origin, destination, expectedDelivery } = req.body;
    const orderExists = await prisma.order.findUnique({ where: { id: orderId } });
    if (!orderExists) {
      return res.status(400).json({ error: "Invalid order ID" });
    }
    let selectedWarehouseId = warehouseId;

    if (!selectedWarehouseId) {
      const firstWarehouse = await prisma.warehouse.findFirst();
      if (!firstWarehouse) {
        return res.status(400).json({ error: "No warehouses available. Please create one first." });
      }
      selectedWarehouseId = firstWarehouse.id;
    }

    const shipment = await prisma.shipment.create({
      data: {
        orderId,
        warehouseId: selectedWarehouseId,
        origin,
        destination,
        expectedDelivery: expectedDelivery ? new Date(expectedDelivery) : null,
        status: "Pending",
      },
      include: { order: true, warehouse: true },
    });

    res.status(201).json({ message: "Shipment created successfully", shipment });
  } catch (error) {
    console.error("Error creating shipment:", error);
    res.status(500).json({ error: "Failed to create shipment" });
  }
};

export const deleteShipmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const shipment = await prisma.shipment.findUnique({ where: { id } });
    if (!shipment) {
      return res.status(404).json({ error: "Shipment not found" });
    }
    if (shipment.status === "Cancelled") {
      return res.status(400).json({ error: "Shipment is already cancelled" });
    }
    const cancelledShipment = await prisma.shipment.update({
      where: { id },
      data: { 
        status: "Cancelled",
        cancelledAt: new Date(),
        cancelReason: req.body.cancelReason || "Cancelled by user",
       },
      include: { order: true },
    });
    res.status(200).json({ message: "Shipment Cancelled successfully" ,shipment: cancelledShipment});
  } catch (error) {
    console.error("Error deleting shipment:", error);
    res.status(500).json({ error: "Failed to delete shipment" });
  }
};
export const updateShipmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const { status: shipmentStatus } = req.body;

    const result = await prisma.$transaction(async (tx) => {
      const shipment = await tx.shipment.findUnique({
        where: { id },
        include: { order: true },
      });

      if (!shipment) {
        throw new Error("Shipment not found");
      }

      const updatedShipment = await tx.shipment.update({
        where: { id },
        data: { status: shipmentStatus },
      });

      let newOrderStatus = null;

      switch (shipmentStatus) {
        case "Dispatched":
          newOrderStatus = "InTransit";
          break;
        case "Delivered":
          newOrderStatus = "Completed";
          break;
        case "Cancelled":
          newOrderStatus = null;
          break;
        default:
          newOrderStatus = null;
      }

      let updatedOrder = shipment.order;
      if (shipment.orderId && newOrderStatus) {
        updatedOrder = await tx.order.update({
          where: { id: shipment.orderId },
          data: { status: newOrderStatus },
        });
      }

      return { updatedShipment, updatedOrder };
    });

    res.status(200).json({
      message: "Shipment and related order updated successfully",
      shipment: result.updatedShipment,
      order: result.updatedOrder,
    });
  } catch (error) {
    console.error("Error updating shipment:", error);
    if (error.message === "Shipment not found") {
      return res.status(404).json({ error: "Shipment not found" });
    }
    res.status(500).json({ error: "Failed to update shipment" });
  }
};