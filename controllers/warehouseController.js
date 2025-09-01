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
