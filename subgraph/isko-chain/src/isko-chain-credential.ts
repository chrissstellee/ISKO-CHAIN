import { ipfs, json } from "@graphprotocol/graph-ts"
import {
  Approval as ApprovalEvent,
  ApprovalForAll as ApprovalForAllEvent,
  BatchMetadataUpdate as BatchMetadataUpdateEvent,
  IskoChainCredential,
  MetadataUpdate as MetadataUpdateEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  Transfer as TransferEvent
} from "../generated/IskoChainCredential/IskoChainCredential"
import {
  Approval,
  ApprovalForAll,
  BatchMetadataUpdate,
  MetadataUpdate,
  OwnershipTransferred,
  Transfer,
  Credential // <-- Add this
} from "../generated/schema"
import { JSONValueKind } from "@graphprotocol/graph-ts";

export function handleApproval(event: ApprovalEvent): void {
  let entity = new Approval(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.owner = event.params.owner
  entity.approved = event.params.approved
  entity.tokenId = event.params.tokenId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleApprovalForAll(event: ApprovalForAllEvent): void {
  let entity = new ApprovalForAll(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.owner = event.params.owner
  entity.operator = event.params.operator
  entity.approved = event.params.approved

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleBatchMetadataUpdate(
  event: BatchMetadataUpdateEvent
): void {
  let entity = new BatchMetadataUpdate(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity._fromTokenId = event.params._fromTokenId
  entity._toTokenId = event.params._toTokenId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleMetadataUpdate(event: MetadataUpdateEvent): void {
  let entity = new MetadataUpdate(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity._tokenId = event.params._tokenId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  let entity = new OwnershipTransferred(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.previousOwner = event.params.previousOwner
  entity.newOwner = event.params.newOwner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTransfer(event: TransferEvent): void {
  // Save the raw Transfer entity (keep your current code)
  let entity = new Transfer(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.from = event.params.from
  entity.to = event.params.to
  entity.tokenId = event.params.tokenId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()

  // ----------- ADDITIONAL LOGIC FOR METADATA INDEXING -----------
  // New: Index credential details in a separate entity
  let id = event.params.tokenId.toString()
  let credential = Credential.load(id)
  if (credential == null) {
    credential = new Credential(id)
    credential.tokenId = event.params.tokenId
    credential.createdAt = event.block.timestamp
  }
  credential.updatedAt = event.block.timestamp
  credential.owner = event.params.to

  // Fetch metadata from contract's tokenURI (try/catch for safety)
  let contract = IskoChainCredential.bind(event.address)
  let tokenUriResult = contract.try_tokenURI(event.params.tokenId)
  if (!tokenUriResult.reverted) {
    credential.tokenURI = tokenUriResult.value
    if (credential.tokenURI && credential.tokenURI.startsWith("https://gateway.pinata.cloud/ipfs/")) {
      let hash = credential.tokenURI.replace("https://gateway.pinata.cloud/ipfs/", "")
      let metadata = ipfs.cat(hash)
      if (metadata) {
        let data = json.fromBytes(metadata).toObject()
        if (data.isSet("credentialCode")) credential.credentialCode = data.get("credentialCode")!.toString();
        if (data.isSet("credentialType")) credential.credentialType = data.get("credentialType")!.toString();
        if (data.isSet("credentialDetails")) credential.credentialDetails = data.get("credentialDetails")!.toString();
        if (data.isSet("studentId")) credential.studentId = data.get("studentId")!.toString();
        if (data.isSet("issueDate")) credential.issueDate = data.get("issueDate")!.toString();
        if (data.isSet("issuer")) credential.issuer = data.get("issuer")!.toString();
        if (data.isSet("firstName")) credential.firstName = data.get("firstName")!.toString();
        if (data.isSet("middleName")) credential.middleName = data.get("middleName")!.toString();
        if (data.isSet("lastName")) credential.lastName = data.get("lastName")!.toString();
        if (data.isSet("yearLevel")) {
          let yearLevelValue = data.get("yearLevel");
          if (yearLevelValue && yearLevelValue.kind == JSONValueKind.NUMBER) {
            credential.yearLevel = yearLevelValue.toI64() as i32;
          }
        }
        if (data.isSet("program")) credential.program = data.get("program")!.toString();
        if (data.isSet("additionalInfo")) credential.additionalInfo = data.get("additionalInfo")!.toString();


      }
    }
  } else {
    credential.tokenURI = ""
  }
  credential.save()
}
