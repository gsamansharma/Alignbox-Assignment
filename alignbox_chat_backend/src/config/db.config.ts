import dotenv from "dotenv";


dotenv.config();

let sslConfig: any = undefined;

const dbConfig = {
  HOST: process.env.DB_HOST || "localhost",
  USER: process.env.DB_USER || "root",
  PASSWORD: process.env.DB_PASSWORD || "",
  DB: process.env.DB_NAME || "alignbox_chat",
  PORT: Number(process.env.DB_PORT || 3306),
  dialect: "mysql" as const,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  dialectOptions: {
    ssl: sslConfig,
  },
};

export default dbConfig;
