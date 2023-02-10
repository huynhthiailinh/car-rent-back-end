import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class GetRentedDatesQueryDto {
  @IsNotEmpty()
  @ApiProperty()
  start_at: Date;

  @IsNotEmpty()
  @ApiProperty()
  end_at: Date;
}
