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
export const deleteProductById = (req, res) => {
  const { id } = req.params;
  const products = readData();

  const productIndex = products.findIndex(
    (p) => p.product_id === Number(id)
  );

  if (productIndex === -1) {
    return res.status(404).json({ error: "Product not found" });
  }

  const [deletedProduct] = products.splice(productIndex, 1);

  writeData(products);

  res.status(200).json({
    message: "Product deleted successfully",
    deletedProduct,
  });
};
export const updateProductById = (req, res) => {
  const { id } = req.params;
  const products = readData();
  const product = products.find((p) => p.product_id === Number(id));

  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  Object.assign(product, req.body, { last_updated: new Date() });
  writeData(products);

  res.status(200).json({ message: "Product updated successfully", product });
};
