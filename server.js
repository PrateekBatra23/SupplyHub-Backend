
import productRoutes from "./routes/productRoutes.js";
import warehouseRoutes from "./routes/warehouseRoutes.js";
import inventoryRoutes from "./routes/inventoryRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import shipmentRoutes from "./routes/shipmentRoutes.js";
import express from "express";

const app = express();
app.use(express.json());

app.use("/api/products", productRoutes);
app.use("/api/warehouses", warehouseRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/orders",orderRoutes);
app.use("/api/shipments",shipmentRoutes
);
const PORT=5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
