import { readData, writeData } from "../utils/fileHelper.js";

export const fetchInventory = (req, res) => {
  const data = readData();
  res.json(data.inventory);
};

export const modifyInventory = (req, res) => {
  const data = readData();
  const { product_id, warehouse_id, quantity } = req.body;

  // Check if record exists
  const existing = data.inventory.find(
    (item) => item.product_id === product_id && item.warehouse_id === warehouse_id
  );

  if (existing) {
    existing.quantity += quantity;
    existing.last_updated = new Date();
  } else {
    data.inventory.push({
      inventory_id: data.inventory.length + 1,
      product_id,
      warehouse_id,
      quantity,
      last_updated: new Date(),
    });
  }

  writeData(data);
  res.json(data.inventory);
};
