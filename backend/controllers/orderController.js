import prisma from "../prismaClient.js";

export const fetchOrder = async (req, res) => {
  try {
    const includeCancelled = req.query.includeCancelled === "true";
    const where = includeCancelled ? {} : { status: { not: "Cancelled" } };

    const orders = await prisma.order.findMany({
      where,
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

    const result = await prisma.$transaction(async (tx) => {
      for (const it of items) {
        const inventory = await tx.inventory.findFirst({ where: { productId: it.productId } });
        if (!inventory || inventory.qtyOnHand < it.quantity) {
          throw new Error(`Insufficient stock for product ${it.productId}`);
        }
      }

      const totalAmount = items.reduce((s, i) => s + i.quantity * i.unitPrice, 0);
      const order = await tx.order.create({
        data: {
          customerName,
          totalAmount,
          expectedDelivery: expectedDelivery ? new Date(expectedDelivery) : null,
          status: "Processing",
          items: { create: items.map(i => ({ productId: i.productId, quantity: i.quantity, unitPrice: i.unitPrice })) }
        },
        include: { items: true }
      });

      for (const it of items) {
        await tx.inventory.updateMany({
          where: { productId: it.productId },
          data: { qtyOnHand: { decrement: it.quantity } },
        });
      }

      return order;
    });

    res.status(201).json(result);
  } catch (err) {
    console.error("Error creating order:", err);
    if (err.message && err.message.startsWith("Insufficient stock")) {
      return res.status(400).json({ error: err.message });
    }
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
    const { items: updatedItems, status } = req.body;
    const result = await prisma.$transaction(async (tx) => {
      const existingOrder = await tx.order.findUnique({
        where: { id },
        include: { items: true },
      });

      if (!existingOrder) {
        throw new Error("Order not found");
      }

      // Case 1: Only updating status (no item changes)
      if (!updatedItems) {
        const updatedOrder = await tx.order.update({
          where: { id },
          data: { status },
        });
        return { updatedOrder };
      }

      // Map current items for easy lookup
      const oldItemMap = {};
      existingOrder.items.forEach((item) => {
        oldItemMap[item.productId] = item.quantity;
      });

      // Update existing items / add new ones
      for (const newItem of updatedItems) {
        const oldQty = oldItemMap[newItem.productId] || 0;
        const newQty = newItem.quantity;
        const diff = newQty - oldQty;

        
        // Update inventory for each diff
        if (diff > 0) {
          const inventory = await tx.inventory.findFirst({ where: { productId: newItem.productId } });
          if (!inventory || inventory.qtyOnHand < diff) {
            throw new Error(`Insufficient stock for product ${newItem.productId}`);
          }
          await tx.inventory.updateMany({
            where: { productId: newItem.productId },
            data: { qtyOnHand: { decrement: diff } },
          });
        } else if (diff < 0) {
          await tx.inventory.updateMany({
            where: { productId: newItem.productId },
            data: { qtyOnHand: { increment: Math.abs(diff) } },
          });
        }

        const existingItem = existingOrder.items.find(
          (i) => i.productId === newItem.productId
        );

        if (existingItem) {
          await tx.orderItem.update({
            where: { id: existingItem.id },
            data: { quantity: newQty, unitPrice: newItem.unitPrice },
          });
        } else {
          await tx.orderItem.create({
            data: {
              orderId: id,
              productId: newItem.productId,
              quantity: newQty,
              unitPrice: newItem.unitPrice,
            },
          });
        }
      }

      // Handle removed items (no longer in updatedItems)
      const updatedProductIds = updatedItems.map((i) => i.productId);
      for (const oldItem of existingOrder.items) {
        if (!updatedProductIds.includes(oldItem.productId)) {
          await tx.inventory.updateMany({
            where: { productId: oldItem.productId },
            data: { qtyOnHand: { increment: oldItem.quantity } },
          });

          await tx.orderItem.delete({ where: { id: oldItem.id } });
        }
      }
      const orderItems = await tx.orderItem.findMany({
        where: { orderId: id },
      });
      const recalculatedTotal = orderItems.reduce((sum, i) => sum + i.quantity * i.unitPrice,0); 

      // Finally, update order 
      const updatedOrder = await tx.order.update({
        where: { id },
        data: { status: status || existingOrder.status ,
          totalAmount: recalculatedTotal,},
        include: { items: { include: { product: true } } },
      });

      return { updatedOrder };
    });

    res.status(200).json({
      message: "Order and inventory updated successfully (atomic)",
      order: result.updatedOrder,
    });
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ error: "Failed to update order" });
  }
};

export const deleteOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id },
        include: { items: true, shipments: true }
      });
      if (!order) throw new Error("Order not found");
      if (order.status === "Cancelled") {
        throw Object.assign(new Error("Order is already cancelled"), { code: "ALREADY_CANCELLED" });
      }
      for (const item of order.items) {
        await tx.inventory.updateMany({
          where: { productId: item.productId },
          data: { qtyOnHand: { increment: item.quantity } },
        });
      }
      if (order.shipments && order.shipments.length > 0) {
        await tx.shipment.updateMany({
          where: { orderId: id, NOT: { status: "Cancelled" } },
          data: {
            status: "Cancelled",
            cancelledAt: new Date(),
            cancelReason: req.body.cancelReason || "Cancelled due to order cancellation",
          },
        });
      }
      const cancelledOrder = await tx.order.update({
        where: { id },
        data: { 
          status: "Cancelled",
          cancelledAt: new Date(),
          cancelReason: req.body.cancelReason || "Cancelled by user" },
        include: { items: true },
      });

      return cancelledOrder;
    });


    res.status(200).json({ message: "Order deleted successfully" ,deletedOrder: result.cancelledOrder});
  } catch (error) {
    console.error("Error deleting order:", error);
    if (error.code === "ALREADY_CANCELLED") {
      return res.status(400).json({ error: "Order is already cancelled" });
    }
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Order not found" });
    }
    res.status(500).json({ error: "Failed to delete order" });
  }
};
