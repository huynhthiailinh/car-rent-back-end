import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { PaginateDto } from 'src/common/request/paginate.dto';
import { RentalActionEnum } from '@modules/cars/constants/rental-action.enum';

export class GetCitiesFilterDto extends PaginateDto {
  @IsOptional()
  @ApiProperty({ required: false })
  car_id: number;

  @IsOptional()
  @ApiProperty({
    required: false,
    type: 'enum',
    enum: RentalActionEnum,
  })
  action: string;
}
