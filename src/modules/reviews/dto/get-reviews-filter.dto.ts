import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { PaginateDto } from 'src/common/request/paginate.dto';

export class GetReviewsFilterDto extends PaginateDto {
  @IsOptional()
  @ApiProperty({ required: false, type: 'number' })
  car_id: number;
}
