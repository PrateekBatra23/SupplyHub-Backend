import { readShipment, writeShipment } from "../utils/fileHelper.js"

export const fetchShipment=(req,res)=>{
    const data=readShipment();
    res.json(data);
};

export const createShipment = (req, res) => {
  const data = readShipment();

  if (!req.body.orderId || !req.body.origin || !req.body.destination) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const newShipment = {
    shipmentId: `SHIP-${Date.now()}`,
    ...req.body
  };

  data.push(newShipment);
  writeShipment(data);

  res.status(201).json(newShipment);
};

export const deleteShipmentById = (req, res) => {
  const { id } = req.params;
  const shipments = readShipment();

  const shipmentIndex = shipments.findIndex(
    (s) => s.shipment_id === Number(id)
  );

  if (shipmentIndex === -1) {
    return res.status(404).json({ error: "Shipment not found" });
  }

  const [deletedShipment] = shipments.splice(shipmentIndex, 1);

  writeShipment(shipments);

  res.status(200).json({
    message: "Shipment deleted successfully",
    deletedShipment,
  });
};
export const updateShipmentById = (req, res) => {
  const { id } = req.params;
  const shipments = readShipment();
  const shipment = shipments.find((s) => s.shipment_id === Number(id));

  if (!shipment) {
    return res.status(404).json({ error: "Shipment not found" });
  }

  Object.assign(shipment, req.body, { last_updated: new Date() });
  writeShipment(shipments);

  res.status(200).json({ message: "Shipment updated successfully", shipment });
};
