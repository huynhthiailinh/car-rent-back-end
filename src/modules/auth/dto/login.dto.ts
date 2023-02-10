import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'user.USE-0001' })
  @Transform(({ value }) => value.toLowerCase().trim())
  @ApiProperty({ example: 'info@akpol.ac.id' })
  email: string;

  @IsNotEmpty({ message: 'system.CUS-0001' })
  @ApiProperty({ example: 'Tengah@123' })
  password: string;
}
