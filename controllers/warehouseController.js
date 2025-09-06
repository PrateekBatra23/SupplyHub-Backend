import { readData, writeData } from "../utils/fileHelper.js";

export const fetchWarehouses = (req, res) => {
  const data = readData();
  res.json(data.warehouses);
};

export const addWarehouse = (req, res) => {
  const data = readData();
  const { name, location, capacity } = req.body;
  const id = data.warehouses.length + 1;

  const newWarehouse = { warehouse_id: id, name, location, capacity };
  data.warehouses.push(newWarehouse);
  writeData(data);

  res.status(201).json(newWarehouse);
};
export const deleteWarehouseById = (req, res) => {
  const { id } = req.params;
  const warehouses = readWarehouse();

  const warehouseIndex = warehouses.findIndex(
    (w) => w.warehouse_id === Number(id)
  );

  if (warehouseIndex === -1) {
    return res.status(404).json({ error: "Warehouse not found" });
  }

  const [deletedWarehouse] = warehouses.splice(warehouseIndex, 1);

  writeWarehouse(warehouses);

  res.status(200).json({
    message: "Warehouse deleted successfully",
    deletedWarehouse,
  });
};
export const updateWarehouseById = (req, res) => {
  const { id } = req.params;
  const warehouses = readWarehouse();
  const warehouse = warehouses.find((w) => w.warehouse_id === Number(id));

  if (!warehouse) {
    return res.status(404).json({ error: "Warehouse not found" });
  }

  Object.assign(warehouse, req.body, { last_updated: new Date() });
  writeWarehouse(warehouses);

  res.status(200).json({ message: "Warehouse updated successfully", warehouse });
};
