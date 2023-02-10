import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsOptional, IsStrongPassword } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'user.USE-0001' })
  @Transform(({ value }) => value.toLowerCase().trim())
  @ApiProperty({ example: 'info@akpol.ac.id' })
  email: string;

  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    {
      message: 'user.USE-0002',
    },
  )
  @ApiProperty({ example: 'Tengah@123' })
  password: string;

  @IsOptional()
  @ApiProperty({ example: 'Alex Stanton', required: false })
  full_name: string;

  @IsOptional()
  @ApiProperty({ example: '024841168090', required: false })
  phone_number: string;

  @IsOptional()
  @ApiProperty({
    example: 'Jl. Sultan Agung No 131 Candi Baru Semarang',
    required: false,
  })
  address: string;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @ApiProperty({ example: 3, required: false })
  city_id: number;

  @IsOptional()
  @ApiProperty({ example: 'CEO at Bukalapak', required: false })
  occupation: string;
}
