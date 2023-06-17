import { ethers } from "ethers";
import {
  batchSize,
  bscScanAPIKey,
  contractAddress,
  requiredConfirmations,
  rpcEndpoint,
} from "./config";
import axios from "axios";
import { Transaction } from "./interfaces/Transaction";

function processTransaction(rawTransaction: Transaction) {
  const transaction = { ...rawTransaction };
  if (rawTransaction.input && rawTransaction.functionName) {
    const iface = new ethers.Interface([
      `function ${rawTransaction.functionName}`,
    ]);
    const t = iface.parseTransaction({
      data: rawTransaction.input,
      value: rawTransaction.value,
    });
    transaction.decodedInput = t;
  }
  return transaction;
}

const provider = new ethers.WebSocketProvider(rpcEndpoint);

provider.on("block", async (blockNumber) => {
  // divide the blocks in batches to reduce the load on the api
  if (blockNumber % batchSize !== 0) return;
  const startBlock = blockNumber - requiredConfirmations - batchSize + 1;
  const endBlock = blockNumber - requiredConfirmations;

  // get all the transactions from the start block to end block using the bscscan api
  console.log(`Checking blocks from ${startBlock} to ${endBlock}`);
  const { data: transactions } = await axios.get(
    `https://api.bscscan.com/api?module=account&action=txlist&address=${contractAddress}&startblock=${startBlock}&endblock=${endBlock}&page=1&offset=10&sort=asc&apikey=${bscScanAPIKey}`
  );

  // process the transactions
  for (const rawTransaction of transactions.result) {
    const transaction = processTransaction(rawTransaction);
    console.log(transaction);
  }
});
