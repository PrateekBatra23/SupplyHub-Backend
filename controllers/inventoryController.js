import { readInventory, writeInventory } from "../utils/fileHelper.js";

export const fetchInventory = (req, res) => {
  const inventory = readInventory();
  res.json(inventory);
};

export const modifyInventory = (req, res) => {
  const inventory = readInventory();
  const { product_id, warehouse_id, quantity } = req.body;

  
  const existing = inventory.find(
    (item) => item.product_id === product_id && item.warehouse_id === warehouse_id
  );

  if (existing) {
    existing.quantity += quantity;
    existing.last_updated = new Date().toISOString();
  } else {
    inventory.push({
      inventory_id: inventory.length + 1,
      product_id,
      warehouse_id,
      quantity,
      last_updated: new Date().toISOString(),
    });
  }

  writeInventory(inventory);  
  res.status(200).json(inventory);
};
