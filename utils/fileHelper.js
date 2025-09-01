import fs from "fs";
import path from "path";

const filePath = path.join("data", "gb.json");

// Read JSON file
export const readData = () => {
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw);
};

// Write JSON file
export const writeData = (data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};
