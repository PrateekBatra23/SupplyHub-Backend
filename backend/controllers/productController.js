import { readData, writeData } from "../utils/fileHelper.js";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();


export const fetchProducts = async(req, res)=>{
  try {
    const products = await prisma.product.findMany({
      include: { vendor: true },
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

export const addProduct = async(req, res) =>{
  try {
    const { name, description, price, sku, category, reorderPoint, vendorId } = req.body;
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        sku,
        category,
        reorderPoint,
        vendorId,
      },
    });
    res.status(201).json(product);
  } catch (error) {
    console.error("Error adding product:", error);
    if (error.code === "P2002") {
      return res.status(409).json({ error: "Duplicate SKU" });
    }
    res.status(500).json({ error: "Failed to add product" });
  }
};


export const deleteProductById = async (req, res) =>{
 try {
    const { id } = req.params;
    await prisma.product.delete({ where: { id } });
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(500).json({ error: "Failed to delete product" });
  }
};
export const updateProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: req.body,
    });
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(500).json({ error: "Failed to update product" });
  }
};

export const lowStock = async (req, res) => {
   try {
    const threshold = parseInt(req.query.threshold) || 5;
    const products = await prisma.product.findMany({
      where: { reorderPoint: { lte: threshold, gt: 0 } },
      orderBy: { reorderPoint: "asc" },
    });
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching low stock products:", error);
    res.status(500).json({ error: "Failed to fetch low stock products" });
  }
};