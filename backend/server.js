
import productRoutes from "./routes/productRoutes.js";
import warehouseRoutes from "./routes/warehouseRoutes.js";
import inventoryRoutes from "./routes/inventoryRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import shipmentRoutes from "./routes/shipmentRoutes.js";
import authRoutes from"./routes/authRoutes.js";
import express from "express";
import vendorRoutes from "./routes/vendorRoutes.js";
import prisma from "./prismaClient.js";
import { registerPrismaMiddlewares } from "./Middleware/prismaMiddleware.js"; // path as per your structure

registerPrismaMiddlewares(prisma);



const app = express();
app.use(express.json());

app.use("/api/products", productRoutes);
app.use("/api/warehouses", warehouseRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/orders",orderRoutes);
app.use("/api/shipments",shipmentRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/vendors", vendorRoutes);



// Global Error Handler for Prisma and custom errors
app.use((err, req, res, next) => {
  console.error("Error:", err);

  // Prisma-specific known errors
  if (err.code === "P2025") {
    return res.status(404).json({ error: "Record not found" });
  }

  if (err.code === "P4001" || err.code === "P4002") {
    // custom codes from middleware (invalid status transitions)
    return res.status(400).json({ error: err.message });
  }

  // generic catch-all
  return res.status(500).json({ error: err.message || "Internal server error" });
});


const PORT=5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
