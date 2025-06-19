/* eslint-disable prefer-const */
import { useEffect, useState } from "react";
import { createClient, gql } from "urql";
import { cacheExchange, fetchExchange } from "@urql/core";
import { CredentialActivity } from "./types";

const SUBGRAPH_URL = "https://api.studio.thegraph.com/query/113934/isko-chain/version/latest";
const client = createClient({
  url: SUBGRAPH_URL,
  exchanges: [cacheExchange, fetchExchange],
});
export const PAGE_SIZE = 10;

const PAGINATED_QUERY = gql`
  query GetCredentials($skip: Int!, $first: Int!) {
    credentials(orderBy: updatedAt, orderDirection: desc, skip: $skip, first: $first) {
      tokenId
      credentialCode
      credentialType
      credentialDetails
      issuer
      firstName
      lastName
      owner
      status
      revocationReason
      replacedByTokenId
      createdAt
      updatedAt
      studentId
      program
      middleName
      yearLevel
      additionalInfo
    }
  }
`;

const COUNT_QUERY = gql`
  query {
    credentials {
      id
    }
  }
`;

function formatDateTime(timestamp: string | number) {
  return new Date(Number(timestamp) * 1000).toLocaleString();
}

export function useRecentActivity(page: number, refreshCount = 0, refresh = 0) {
  const [rows, setRows] = useState<CredentialActivity[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  // Fetch paginated credentials
  useEffect(() => {
    setLoading(true);
    client.query(PAGINATED_QUERY, { skip: (page - 1) * PAGE_SIZE, first: PAGE_SIZE }, { requestPolicy: "network-only" })
      .toPromise()
      .then((result) => {
        if (!result.data) return;
        let activities: CredentialActivity[] = [];
        for (const cred of result.data.credentials) {
          let status = "Issued";
          let details = `${cred.credentialType}: ${cred.credentialDetails}`;
          if (cred.status === "revoked" && cred.revocationReason) {
            status = cred.replacedByTokenId ? "Reissued" : "Revoked";
            details += cred.revocationReason
              ? ` (Reason: ${cred.revocationReason})`
              : '';
            if (cred.replacedByTokenId) {
              details += ` (Replaced by Token: ${cred.replacedByTokenId})`;
            }
          }
          activities.push({
            ...cred,
            dateTime: formatDateTime(cred.updatedAt),
            user: cred.issuer,
            details,
            firstName: cred.firstName,
            lastName: cred.lastName,
            status,
          });
        }
        setRows(activities);
        setLoading(false);
      });
  }, [refreshCount, refresh, page]);

  // Fetch total count (on mount and every data change)
  useEffect(() => {
    client.query(COUNT_QUERY, {}, { requestPolicy: "network-only" })
      .toPromise()
      .then(result => {
        if (result.data && result.data.credentials) {
          setTotal(result.data.credentials.length);
        }
        });
    }, [refreshCount, refresh]);

    return { rows, total, loading, setRows, setLoading };
}
