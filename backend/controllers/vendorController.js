import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getVendors = async (req, res) =>{
  try {
    const vendors = await prisma.vendor.findMany({
      include: { products: true },
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json(vendors);
  } catch (error) {
    console.error("Error fetching vendors:", error);
    res.status(500).json({ error: "Failed to fetch vendors" });
  }
};


export const createVendor = async(req, res) => {
  try {
    const { name, contact, email, rating = 0 } = req.body;
    const vendor = await prisma.vendor.create({
      data: { name, contact, email, rating },
    });
    res.status(201).json(vendor);
  } catch (error) {
    console.error("Error creating vendor:", error);
    if (error.code === "P2002") {
      return res.status(409).json({ error: "Duplicate email or constraint violation" });
    }
    res.status(500).json({error: "Failed to create vendor"});
  }
};

export const updateVendor = async(req, res) => {
  try {
    const { id } = req.params;
    const vendor = await prisma.vendor.update({
      where: { id },
      data: req.body,
    });
    res.status(200).json(vendor);
  } catch (error) {
    console.error("Error updating vendor :", error);
    if (error.code === "P2025") {
      return res.status(404).json({error: "Vendor not found"});
    }
    res.status(500).json({error: "Failed to update vendor"});
  }
};

export const deleteVendor = async(req, res) => {
  try {
    const { id } = req.params;
    await prisma.product.deleteMany({ where: { vendorId: id } });
    await prisma.vendor.delete({ where: { id } });
    res.status(200).json({ message: "Vendor deleted successfully" });
  } catch (error) {
    console.error("Error deleting vendor:", error);
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Vendor not found" });
    }
    res.status(500).json({ error: "Failed to delete vendor" });
  }
};
