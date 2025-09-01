import { readData, writeData } from "../utils/fileHelper.js";

export const fetchProducts = (req, res) => {
  const data = readData();
  res.json(data.warehouses.products);
};

export const addProduct = (req, res) => {
  const data = readData();
  const { name, description, price } = req.body;
  const id = data.products.length + 1;

  const newProduct = { product_id: id, name, description, price };
  data.products.push(newProduct);
  writeData(data);

  res.status(201).json(newProduct);
};
