import { UseGuards } from '@nestjs/common/decorators';
import { Controller } from '@nestjs/common/decorators/core/controller.decorator';
import { Put } from '@nestjs/common/decorators/http/request-mapping.decorator';
import { Body } from '@nestjs/common/decorators/http/route-params.decorator';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '@common/decorators/requests/current-user.decorator';
import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth.guard';
import { User } from '@modules/users/entities/user.entity';
import { UpdateFavouriteStatusDto } from '../dto/update-favourite-status.dto';
import { FavouritesService } from '../services/favourites.service';

@ApiBearerAuth('accessToken')
@ApiTags('Favourites')
@Controller({
  version: '1',
  path: 'favourites',
})
@UseGuards(JwtAuthGuard)
export class FavouritesController {
  constructor(private favouritesService: FavouritesService) {}

  @ApiBearerAuth('accessToken')
  @ApiOperation({ summary: 'Update favourite status' })
  @Put()
  updateFavouriteStatus(
    @Body() updateFavouriteStatusDto: UpdateFavouriteStatusDto,
    @CurrentUser() user: User,
  ) {
    this.favouritesService.updateFavouriteStatus(
      updateFavouriteStatusDto,
      user,
    );
  }
}
