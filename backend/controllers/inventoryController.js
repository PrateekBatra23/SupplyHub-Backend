
import prisma from "../prismaClient.js";

export const getInventory = async (req, res) =>{
  try {
    const inventory = await prisma.inventory.findMany({
      include: { warehouse: true, product: true },
      orderBy: { lastUpdated: "desc" },
    });
    res.status(200).json(inventory);

  } catch (error) {
    console.error("Error fetching inventory:", error);
    res.status(500).json({ error: "Failed to fetch inventory" });
  }
};


export const addInventory = async (req, res) => {
  try {
    const { warehouseId, productId, qtyOnHand = 0, reservedQty = 0 } = req.body;

    const entry = await prisma.inventory.create({
      data: { warehouseId, productId, qtyOnHand, reservedQty },
    });
    res.status(201).json({ message: "Inventory record created", entry });

  } catch (error) {
    console.error("Error creating inventory:", error);
    res.status(500).json({ error: "Failed to create inventory record" });
  }
};

export const updateInventory = async (req, res) => {
  try {
    const { id } = req.params;
    const { qtyOnHand, reservedQty } = req.body;
    const inventory = await prisma.inventory.update({
      where: { id },
      data: { qtyOnHand, reservedQty },
    });

    res.status(200).json({ message: "Inventory updated successfully", inventory });


  } catch (error) {
    console.error("Error updating inventory:", error);
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Inventory record not found" });
    }
    res.status(500).json({ error: "Failed to update inventory" });
  }
};

export const deleteInventory = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.inventory.delete({ where: { id } });
    res.status(200).json({ message: "Inventory record deleted" });
    
  } catch (error) {
    console.error("Error deleting inventory:", error);
    res.status(500).json({ error: "Failed to delete inventory record" });
  }
};
