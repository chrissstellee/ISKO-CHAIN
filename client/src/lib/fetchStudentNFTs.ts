import { ethers, ZeroAddress, JsonRpcProvider } from "ethers";
import IskoChainCredentialABI from "@/lib/IskoChainCredential.json";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_DEPLOYED_CONTRACT_ADDRESS!;

// Adjusted helper for ethers v6, filters only EventLogs
async function getAllEventsInChunks(
    contract: ethers.Contract,
    eventName: string,
    topics: (string | null)[],
    startBlock: number,
    endBlock: number,
    chunkSize = 9000
) {
    let allEvents: ethers.EventLog[] = [];
    for (let from = startBlock; from <= endBlock; from += chunkSize + 1) {
        const to = Math.min(from + chunkSize, endBlock);
        const eventFilter = contract.filters[eventName](...topics);
        const logs = await contract.queryFilter(eventFilter, from, to);
        // Only keep logs that have 'args'
        const eventLogs = logs.filter((log): log is ethers.EventLog => 'args' in log);
        allEvents = allEvents.concat(eventLogs);
    }
    return allEvents;
}

// Main function: find all tokenIds owned by `wallet`
export async function getTokenIdsForOwner(wallet: string, provider: JsonRpcProvider) {
    const contract = new ethers.Contract(CONTRACT_ADDRESS, IskoChainCredentialABI, provider);

    const endBlock = await provider.getBlockNumber();
    const startBlock = 26904257; // Or your contract deployment block

    // Use ZeroAddress for null address in ethers v6+
    const toEvents = await getAllEventsInChunks(contract, "Transfer", [ZeroAddress, wallet], startBlock, endBlock);
    const fromEvents = await getAllEventsInChunks(contract, "Transfer", [wallet, ZeroAddress], startBlock, endBlock);

    const owned = new Set<number>();
    toEvents.forEach((e) => owned.add(Number(e.args.tokenId)));
    fromEvents.forEach((e) => owned.delete(Number(e.args.tokenId)));
    return Array.from(owned);
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
