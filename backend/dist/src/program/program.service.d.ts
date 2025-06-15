import { PrismaService } from 'prisma/prisma.service';
export declare class ProgramService {
    private prisma;
    constructor(prisma: PrismaService);
    getAllPrograms(): Promise<{
        id: number;
        name: string;
        abbreviation: string;
        createdAt: Date;
    }[]>;
}
