import { readShipment, writeShipment } from "../utils/fileHelper.js"

export const fetchShipment=(req,res)=>{
    const data=readShipment();
    res.json(data);
};

export const createShipment=(req,res)=>{
    const data=readShipment();
    const newShipment = {
    shipmentId: `SHIP-${Date.now()}`,
    ...req.body
  };

  data.push(newShipment);
  writeShipment(data);

  res.status(201).json(newShipment);
}