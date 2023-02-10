import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { PaymentMethodCodeEnum } from '@modules/payment-methods/constants/payment-method-code.enum';

export class CreateOrderDto {
  @IsNotEmpty({ message: 'system.CUS-0001' })
  @ApiProperty({ nullable: false, example: 1 })
  car_id: number;

  @IsNotEmpty({ message: 'system.CUS-0001' })
  @ApiProperty({ nullable: false, example: 'Alex Stanton' })
  billing_name: string;

  @IsNotEmpty({ message: 'system.CUS-0001' })
  @ApiProperty({ nullable: false, example: '024841168090' })
  billing_phone_number: string;

  @IsNotEmpty({ message: 'system.CUS-0001' })
  @ApiProperty({
    nullable: false,
    example: 'Jl. Sultan Agung No 131 Candi Baru Semarang',
  })
  billing_address: string;

  @IsNotEmpty({ message: 'system.CUS-0001' })
  @ApiProperty({ nullable: false, example: 'Semarang' })
  billing_city: string;

  @IsNotEmpty({ message: 'system.CUS-0001' })
  @ApiProperty({ nullable: false, example: 1 })
  pick_up_city_id: number;

  @IsNotEmpty({ message: 'system.CUS-0001' })
  @ApiProperty({ nullable: false, example: '2021-01-01T00:00:00.000Z' })
  pick_up_at: Date;

  @IsNotEmpty({ message: 'system.CUS-0001' })
  @ApiProperty({ nullable: false, example: 2 })
  drop_off_city_id: number;

  @IsNotEmpty({ message: 'system.CUS-0001' })
  @ApiProperty({ nullable: false, example: '2021-01-01T00:00:00.000Z' })
  drop_off_at: Date;

  @IsNotEmpty({ message: 'system.CUS-0001' })
  @ApiProperty({
    type: 'enum',
    nullable: false,
    enum: PaymentMethodCodeEnum,
  })
  payment_method_code: PaymentMethodCodeEnum;

  @IsOptional()
  @ApiProperty({
    default: 'EKPT0940KN5',
  })
  promo_code: string;
}
