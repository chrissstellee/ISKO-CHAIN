// pages/api/issue-credential.ts

import type { NextApiRequest, NextApiResponse } from "next";
import PinataClient from "@pinata/sdk";

const pinata = new PinataClient({
  pinataApiKey: process.env.PINATA_API_KEY!,
  pinataSecretApiKey: process.env.PINATA_API_SECRET!,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end("Method not allowed");

  try {
    // Get fields as sent from the frontend
    const {
      credentialType,
      studentId,
      credentialDetails,
      issueDate,
      metadata, // Optional extra info (string)
    } = req.body;

    // You can parse or structure additional metadata here if needed
    const credentialMetadata = {
      credentialType,
      studentId,
      credentialDetails,
      issueDate,
      metadata,
      // Optionally, add timestamp, admin info, etc.
    };

    // Upload to IPFS via Pinata
    const pinRes = await pinata.pinJSONToIPFS(credentialMetadata, {
      pinataMetadata: { name: `Credential-${studentId}-${Date.now()}` },
    });

    const tokenURI = `https://gateway.pinata.cloud/ipfs/${pinRes.IpfsHash}`;
    res.status(200).json({ tokenURI });
  } catch (err) {
    console.error("[Pinata error]", err);
    res.status(500).json({ error: "Failed to upload to Pinata" });
  }
}
