import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdateFavouriteStatusDto {
  @IsNotEmpty()
  @ApiProperty({ example: true })
  status: boolean;

  @IsNotEmpty()
  @ApiProperty({ example: 1 })
  car_id: number;
}
