import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const fetchOrder = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: { include: { product: true } },
        shipments: true,
      },
      orderBy: { orderDate: "desc" },
    });
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

export const createOrder = async (req, res) => {
  try {
    const { customerName, items, expectedDelivery } = req.body;

    const totalAmount = items.reduce(
      (sum, i) => sum + i.quantity * i.unitPrice,
      0
    );

    const order = await prisma.order.create({
      data: {
        customerName,
        totalAmount,
        expectedDelivery: expectedDelivery
          ? new Date(expectedDelivery)
          : null,
        items: {
          create: items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
            unitPrice: i.unitPrice,
          })),
        },
      },
      include: { items: { include: { product: true } } },
    });

    res.status(201).json(order);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
};

export const fetchOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: { include: { product: true } },
        shipments: true,
      },
    });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("Error fetching order by ID:", error);
    res.status(500).json({ error: "Failed to fetch order details" });
  }
};

export const updateOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await prisma.order.update({
      where: { id },
      data: req.body, 
    });

    res.status(200).json(order);
  } catch (error) {
    console.error("Error updating order:", error);
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Order not found" });
    }
    res.status(500).json({ error: "Failed to update order" });
  }
};

export const deleteOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.orderItem.deleteMany({ where: { orderId: id } });
    await prisma.order.delete({ where: { id } });

    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("Error deleting order:", error);
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Order not found" });
    }
    res.status(500).json({ error: "Failed to delete order" });
  }
};
