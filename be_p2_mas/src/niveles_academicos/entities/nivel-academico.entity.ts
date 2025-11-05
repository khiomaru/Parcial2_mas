import { Programa } from 'src/programas/entities/programa.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('niveles_academicos')
export class NivelAcademico {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column({ length: 20 })
  nombre: string;

  @Column({ length: 500, nullable: true })
  descripcion: string;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_modificacion' })
  fechaModificacion: Date;

  @DeleteDateColumn({ name: 'fecha_eliminacion' })
  fechaEliminacion: Date;

  @OneToMany(() => Programa, programa => programa.nivelAcademico)
  programas: Programa[];
}
