import { EntityAbstract } from '@common/base/base.entity';
import { Car } from '../../cars/entities/car.entity';
import { User } from '../../users/entities/user.entity';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { IFavourite } from '../interfaces/favourite.interface';

@Index(['userId', 'carId'])
@Entity('favourites')
export class Favourite extends EntityAbstract implements IFavourite {
  @Column({
    nullable: true,
  })
  userId: number;

  @ManyToOne(() => User, (user) => user.favourites, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;

  @Column({
    nullable: true,
  })
  carId: number;

  @ManyToOne(() => Car, (car) => car.favourites, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'car_id', referencedColumnName: 'id' })
  car: Car;

  @Column({
    nullable: true,
  })
  status: boolean;
}
