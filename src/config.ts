import dotenv from "dotenv";
dotenv.config();

export const contractAddress = process.env.CONTRACT_ADDRESS || "";
export const rpcEndpoint = process.env.RPC_ENDPOINT || "";
export const bscScanAPIKey = process.env.BSC_SCAN_API_KEY || "";
export const requiredConfirmations = 20;
export const batchSize = 3;
