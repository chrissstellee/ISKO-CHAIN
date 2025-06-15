/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ethers, ZeroAddress, JsonRpcProvider } from "ethers";
import IskoChainCredentialABI from "@/lib/IskoChainCredential.json";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_DEPLOYED_CONTRACT_ADDRESS!;

// Helper to get all logs in small (10,000-block) chunks
async function getAllTransferEventsInChunks(
  contract: ethers.Contract,
  startBlock: number,
  endBlock: number,
  chunkSize = 9000 // stay below 10k for safety
) {
  const filter = contract.filters.Transfer(null, null);
  let allEvents: any[] = [];
  for (let from = startBlock; from <= endBlock; from += chunkSize) {
    const to = Math.min(from + chunkSize - 1, endBlock);
    const events = await contract.queryFilter(filter, from, to);
    allEvents = allEvents.concat(events);
  }
  return allEvents;
}

export async function getTokenIdsForOwner(wallet: string, provider: ethers.JsonRpcProvider) {
  const contract = new ethers.Contract(CONTRACT_ADDRESS, IskoChainCredentialABI, provider);

  const endBlock = await provider.getBlockNumber();
  const startBlock = 26904257; // Or your deployment block

  const events = await getAllTransferEventsInChunks(contract, startBlock, endBlock);

  const ownership: Record<string, string> = {};
  for (const e of events) {
    const from = (e as any).args?.from;
    const to = (e as any).args?.to;
    const tokenId = (e as any).args?.tokenId?.toString();
    if (to && tokenId) ownership[tokenId] = to;
  }

  return Object.entries(ownership)
    .filter(([_, owner]) => owner.toLowerCase() === wallet.toLowerCase())
    .map(([tokenId]) => Number(tokenId));
}

// Fetch metadata for one credential
export async function fetchCredentialMetadata(tokenId: number, provider: JsonRpcProvider) {
    const contract = new ethers.Contract(CONTRACT_ADDRESS, IskoChainCredentialABI, provider);
    const tokenURI = await contract.tokenURI(tokenId);

    // Support both ipfs:// and https:// URIs
    const metadataUrl = tokenURI.startsWith("ipfs://")
        ? tokenURI.replace("ipfs://", "https://gateway.pinata.cloud/ipfs/")
        : tokenURI;

    const res = await fetch(metadataUrl);
    if (!res.ok) throw new Error("Failed to fetch credential metadata");
    return await res.json();
}
