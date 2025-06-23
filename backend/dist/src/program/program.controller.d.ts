import { ProgramService } from './program.service';
export declare class ProgramController {
    private readonly programService;
    constructor(programService: ProgramService);
    getAll(): Promise<{
        id: number;
        name: string;
        abbreviation: string;
        createdAt: Date;
    }[]>;
}
