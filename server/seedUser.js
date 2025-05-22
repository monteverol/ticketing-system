import bcrypt from "bcrypt";
import db from "./db/index.js";

const seed = async () => {
  const hashedPassword = await bcrypt.hash("1234", 10);

  await db.query(
    "INSERT INTO users (username, password, role, department) VALUES ($1, $2, $3, $4)",
    ["IT-M", hashedPassword, "manager", "IT"]
  );

  console.log("User seeded");
  process.exit();
};

seed();