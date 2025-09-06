import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const dataPath = path.join(__dirname, "../data");
const gbPath = path.join(dataPath, "gb.json");
const orderPath = path.join(dataPath, "order.json");
const shipmentPath = path.join(dataPath, "shipment.json");
const inventoryPath = path.join(dataPath, "inventory.json");


const safeRead = (file) => {
  try {
    if (!fs.existsSync(file)) return [];
    const raw = fs.readFileSync(file, "utf-8");
    return JSON.parse(raw || "[]");
  } catch (err) {
    console.error(`Error reading ${file}:`, err);
    return [];
  }
};


const safeWrite = (file, data) => {
  try {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error(`Error writing ${file}:`, err);
  }
};


export const readData = () => safeRead(gbPath);
export const writeData = (data) => safeWrite(gbPath, data);

export const readOrder = () => safeRead(orderPath);
export const writeOrder = (data) => safeWrite(orderPath, data);

export const readShipment = () => safeRead(shipmentPath);
export const writeShipment = (data) => safeWrite(shipmentPath, data);

export const readInventory = () => safeRead(inventoryPath);
export const writeInventory = (data) => safeWrite(inventoryPath, data);

