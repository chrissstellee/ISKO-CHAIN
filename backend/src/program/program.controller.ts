/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable prettier/prettier */
// src/program/program.controller.ts
import { Controller, Get } from '@nestjs/common';
import { ProgramService } from './program.service';

@Controller('programs')
export class ProgramController {
  constructor(private readonly programService: ProgramService) {}

  @Get()
  async getAll() {
    return this.programService.getAllPrograms();
  }
}
