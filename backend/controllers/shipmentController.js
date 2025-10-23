import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();



export const fetchShipment= async (req,res)=>{
    try {
    const shipments = await prisma.shipment.findMany({
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

    const shipment = await prisma.shipment.create({
      data: {
        orderId,
        warehouseId,
        origin,
        destination,
        expectedDelivery: expectedDelivery ? new Date(expectedDelivery) : null,
        status: "Pending",
      },
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
    await prisma.shipment.delete({ where: { id } });
    res.status(200).json({ message: "Shipment deleted successfully" });
  } catch (error) {
    console.error("Error deleting shipment:", error);
    res.status(500).json({ error: "Failed to delete shipment" });
  }
};
export const updateShipmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const shipment = await prisma.shipment.update({
      where: { id },
      data: { status },
    });

    res.status(200).json({ message: "Shipment status updated", shipment });
  } catch (error) {
    console.error("Error updating shipment:", error);
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Shipment not found" });
    }
    res.status(500).json({ error: "Failed to update shipment" });
  }
};
