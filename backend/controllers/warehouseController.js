import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getWarehouses = async (req, res) => {
  try {
    const warehouses = await prisma.warehouse.findMany({
      include: { inventories: true, shipments: true },
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json(warehouses);
  } catch (error) {
    console.error("Error fetching warehouses:", error);
    res.status(500).json({ error: "Failed to fetch warehouses" });
  }
};

export const createWarehouse = async (req, res) => {
  try {
    const { name, location, capacity } = req.body;

    const warehouse = await prisma.warehouse.create({
      data: { name, location, capacity },
    });

    res.status(201).json({ message: "Warehouse created successfully", warehouse });
  } catch (error) {
    console.error("Error creating warehouse:", error);
    res.status(500).json({ error: "Failed to create warehouse" });
  }
};

export const updateWarehouse = async (req, res) => {
  try {
    const { id } = req.params;
    const warehouse = await prisma.warehouse.update({
      where: { id },
      data: req.body,
    });

    res.status(200).json({ message: "Warehouse updated successfully", warehouse });
  } catch (error) {
    console.error("Error updating warehouse:", error);
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Warehouse not found" });
    }
    res.status(500).json({ error: "Failed to update warehouse" });
  }
};

export const deleteWarehouse = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.inventory.deleteMany({ where: { warehouseId: id } });
    await prisma.shipment.deleteMany({ where: { warehouseId: id } });

    await prisma.warehouse.delete({ where: { id } });

    res.status(200).json({ message: "Warehouse deleted successfully" });
  } catch (error) {
    console.error("Error deleting warehouse:", error);
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Warehouse not found" });
    }
    res.status(500).json({ error: "Failed to delete warehouse" });
  }
};
