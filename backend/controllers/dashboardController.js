import prisma from "../prisma/client.js";

// GET /api/dashboard/kpis
export const getDashboardKPIs = async (req, res) => {
  try {
    const [
      totalVendors,
      totalProducts,
      lowStockItems,
      pendingShipments,
      recentOrders,
      monthlySales,
    ] = await Promise.all([
      prisma.vendor.count(),
      prisma.product.count(),
      prisma.product.count({
        where: { reorderPoint: { gt: 0, lte: 20 } },
      }),
      prisma.shipment.count({ where: { status: "Pending" } }),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          customerName: true,
          totalAmount: true,
          status: true,
          createdAt: true,
        },
      }),
      prisma.$queryRaw`
        SELECT 
          TO_CHAR(DATE_TRUNC('month', "createdAt"), 'Mon') AS month,
          SUM("totalAmount")::int AS sales
        FROM "Order"
        WHERE DATE_PART('year', "createdAt") = DATE_PART('year', CURRENT_DATE)
        GROUP BY DATE_TRUNC('month', "createdAt")
        ORDER BY DATE_TRUNC('month', "createdAt");
      `,
    ]);

    res.status(200).json({
      totalVendors,
      totalProducts,
      lowStockItems,
      pendingShipments,
      recentOrders,
      monthlySales,
    });
  } catch (error) {
    console.error("Dashboard KPI error:", error);
    res.status(500).json({ error: "Failed to fetch dashboard KPIs" });
  }
};
