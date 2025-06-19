export interface CredentialActivity {
    tokenId: string;
    credentialCode?: string;
    credentialType?: string;
    credentialDetails?: string;
    issuer?: string;
    firstName?: string;
    lastName?: string;
    owner?: string;
    status?: string;
    revocationReason?: string;
    replacedByTokenId?: string;
    createdAt?: string;
    updatedAt?: string;
    studentId?: string;
    program?: string;
    middleName?: string;
    yearLevel?: number;
    additionalInfo?: string;
    dateTime?: string;
    user?: string;
    details?: string;
    issueDate?: string;
}

export interface RecentActivityProps {
    refreshCount?: number;
    onAnyAction?: () => void;
}
