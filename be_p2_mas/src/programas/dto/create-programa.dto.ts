import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsDefined,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
} from 'class-validator';
import { NivelAcademico } from 'src/niveles_academicos/entities/nivel-academico.entity';

export class CreateProgramaDto {
  @ApiProperty()
  @IsDefined({ message: 'El campo idNivelAcademico debe estar definido' })
  @IsInt({ message: 'El campo idNivelAcademico debe ser de tipo numérico' })
  readonly idNivelAcademico: NivelAcademico['id'];

  @ApiProperty()
  @IsNotEmpty({ message: 'El campo nombre es obligatorio' })
  @IsString({ message: 'El campo nombre debe ser de tipo cadena' })
  @MaxLength(100, { message: 'El campo nombre no debe ser mayor a 100 caracteres' })
  readonly nombre: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'El campo descripcion es obligatorio' })
  @IsString({ message: 'El campo descripcion debe ser de tipo cadena' })
  @MaxLength(2000, { message: 'El campo descripcion no debe ser mayor a 2000 caracteres' })
  readonly descripcion: string;

  @ApiProperty()
  @IsDefined({ message: 'El campo version debe estar definido' })
  @IsInt({ message: 'El campo version debe ser de tipo numérico' })
  readonly version: number;

  @ApiProperty()
  @IsDefined({ message: 'El campo duracionMeses debe estar definido' })
  @IsInt({ message: 'El campo duracionMeses debe ser de tipo numérico' })
  readonly duracionMeses: number;

  @ApiProperty()
  @IsDefined({ message: 'El campo costo debe estar definido' })
  @IsNumber({}, { message: 'El campo costo debe ser de tipo numérico' })
  readonly costo: number;

  @ApiProperty()
  @IsDefined({ message: 'El campo fechaInicio debe estar definido' })
  @IsDateString({}, { message: 'El campo fechaInicio debe ser tipo fecha' })
  readonly fechaInicio: Date;

  @ApiProperty()
  @IsNotEmpty({ message: 'El campo estado es obligatorio' })
  @IsString({ message: 'El campo estado debe ser de tipo cadena' })
  @MaxLength(20, { message: 'El campo estado no debe ser mayor a 20 caracteres' })
  @IsIn(['En Planificación', 'En curso', 'Finalizado'], {
    message:
      'El campo estado debe ser uno de los valores permitidos: En Planificación, En curso, Finalizado',
  })
  readonly estado: string;
}
