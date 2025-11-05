import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateNivelAcademicoDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'El campo nombre es obligatorio' })
  @IsString({ message: 'El campo nombre debe ser de tipo cadena' })
  @MaxLength(20, { message: 'El campo nombre no debe ser mayor a 20 caracteres' })
  @IsIn(['Diplomado', 'Especialidad', 'Maestría', 'Doctorado'], { message: 'El campo nombre debe ser uno de los valores permitidos: Diplomado, Especialidad, Maestría, Doctorado' })
  readonly nombre: string;

  @ApiProperty()
  @IsOptional()
  @IsString({ message: 'El campo descripcion debe ser de tipo cadena' })
  @MaxLength(500, { message: 'El campo descripcion no debe ser mayor a 500 caracteres' })
  readonly descripcion?: string;
}
