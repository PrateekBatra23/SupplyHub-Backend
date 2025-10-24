
import prisma from "../prismaClient.js";


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
    const defaultWarehouse = await prisma.warehouse.findFirst();
    if (defaultWarehouse) {
      await prisma.inventory.create({
        data: {
          productId: product.id,
          warehouseId: defaultWarehouse.id,
          qtyOnHand: 0,
          reservedQty: 0,
        },
      });
}
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
    await prisma.inventory.deleteMany({ where: { productId: id } });
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
    
    const { name, description, price, sku, category, reorderPoint, vendorId } = req.body;
    if (!name || price === undefined || price === null) {
      return res.status(400).json({ error: "Name and price are required" });
    }

    const parsedPrice = parseFloat(price);
    const parsedReorderPoint = reorderPoint ? parseInt(reorderPoint) : 0;

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        price: parsedPrice,
        sku,
        category,
        reorderPoint: parsedReorderPoint,
        vendorId: vendorId || null,
      },
    });

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(500).json({ error: "Failed to update product",error });
  }
};

// GET /api/products/low-stock
export const getLowStockProducts = async (req, res) => {
  try {
    const { search = "", category = "", severity = "" } = req.query;

    // Dynamic where-clause
    const whereClause = {
      AND: [
        search
          ? { name: { contains: search, mode: "insensitive" } }
          : undefined,
        category ? { category: { equals: category } } : undefined,
        severity === "critical"
          ? { reorderPoint: { gt: 0 }, inventories: { some: { qtyOnHand: { lte: 5 } } } }
          : severity === "high"
          ? { reorderPoint: { gt: 0 }, inventories: { some: { qtyOnHand: { lte: 10 } } } }
          : undefined,
      ].filter(Boolean),
    };

    const products = await prisma.product.findMany({
      where: whereClause,
      include: {
        vendor: { select: { name: true, id: true } },
        inventories: { select: { qtyOnHand: true, reservedQty: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    // Transform with computed metrics
    const transformed = products.map((p) => {
      const stock = p.inventories.reduce((sum, i) => sum + i.qtyOnHand, 0);
      const reorderPoint = p.reorderPoint || 0;
      const stockLevel =
        stock === 0
          ? "critical"
          : stock <= reorderPoint * 0.5
          ? "critical"
          : stock <= reorderPoint
          ? "low"
          : "ok";

      return {
        id: p.id,
        sku: p.sku,
        name: p.name,
        category: p.category || "General",
        price: p.price,
        reorderPoint,
        vendor: p.vendor?.name || "N/A",
        vendorId: p.vendor?.id,
        stock,
        stockLevel,
        lastOrdered: p.createdAt,
        averageLeadTime: 7 + Math.floor(Math.random() * 7), // mock value
        monthlySales: Math.floor(Math.random() * 100) + 10,
        stockoutRisk:
          stockLevel === "critical"
            ? "critical"
            : stockLevel === "low"
            ? "high"
            : "medium",
      };
    });

    // Summary & recommendations
    const totalLowStock = transformed.filter(
      (p) => p.stockLevel !== "ok"
    ).length;
    const criticalItems = transformed.filter(
      (p) => p.stockLevel === "critical"
    ).length;

    const summary = {
      totalLowStock,
      criticalItems,
      lowStockItems: totalLowStock - criticalItems,
      estimatedReorderValue: transformed
        .filter((p) => p.stockLevel !== "ok")
        .reduce((sum, p) => sum + p.price * (p.reorderPoint - p.stock), 0),
      categoriesAffected: [
        ...new Set(transformed.map((p) => p.category)),
      ],
    };

    const recommendations = transformed
      .filter((p) => p.stockLevel !== "ok")
      .slice(0, 5)
      .map((p) => ({
        sku: p.sku,
        action:
          p.stockLevel === "critical" ? "immediate_reorder" : "reorder_soon",
        reason:
          p.stockLevel === "critical"
            ? "Out of stock or below 50 % threshold"
            : "Below reorder point",
        urgency:
          p.stockLevel === "critical"
            ? "critical"
            : p.stockLevel === "low"
            ? "high"
            : "medium",
        recommendedQuantity: Math.max(p.reorderPoint * 2, 50),
      }));

    res.status(200).json({
      products: transformed,
      summary,
      categories: [...new Set(transformed.map((p) => p.category))],
      recommendations,
    });
  } catch (error) {
    console.error("Low Stock API Error →", error);
    res.status(500).json({ error: "Failed to fetch low-stock data" });
  }
};
