import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Programa } from './entities/programa.entity';
import { CreateProgramaDto } from './dto/create-programa.dto';
import { UpdateProgramaDto } from './dto/update-programa.dto';

@Injectable()
export class ProgramasService {
  constructor(
    @InjectRepository(Programa)
    private readonly programasRepository: Repository<Programa>,
  ) {}

  async create(createProgramaDto: CreateProgramaDto): Promise<Programa> {
    const existe = await this.programasRepository.findOneBy({
      idNivelAcademico: createProgramaDto.idNivelAcademico,
      nombre: createProgramaDto.nombre.trim(),
    });
    if (existe) throw new ConflictException('El programa ya existe');

    const programa = this.programasRepository.create(createProgramaDto);
    return this.programasRepository.save(programa);
  }

  async findAll(busqueda?: string): Promise<Programa[]> {
    const queryBuilder = this.programasRepository
      .createQueryBuilder('programa')
      .leftJoinAndSelect('programa.nivelAcademico', 'nivelAcademico')
      .orderBy('programa.idNivelAcademico', 'ASC');

    if (busqueda) {
      queryBuilder.where(
        'programa.nombre ILIKE :busqueda OR programa.descripcion ILIKE :busqueda OR programa.estado ILIKE :busqueda OR programa.modalidadClases ILIKE :busqueda OR nivelAcademico.nombre ILIKE :busqueda',
        { busqueda: `%${busqueda}%` },
      );
    }

    const programas = await queryBuilder.getMany();
    console.log('Programas encontrados:', programas);
    return programas;
  }

  async findOne(id: number): Promise<Programa> {
    const programa = await this.programasRepository.findOne({
      where: { id },
      relations: { nivelAcademico: true },
    });
    if (!programa) throw new NotFoundException('El programa no existe');
    return programa;
  }

  async update(id: number, updateProgramaDto: UpdateProgramaDto): Promise<Programa> {
    const programa = await this.findOne(id);
    Object.assign(programa, updateProgramaDto);
    return this.programasRepository.save(programa);
  }

  async remove(id: number) {
    const programa = await this.findOne(id);
    return this.programasRepository.softRemove(programa);
  }
}
