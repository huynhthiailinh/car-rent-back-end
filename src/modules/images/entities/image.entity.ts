import { EntityAbstract } from '@common/base/base.entity';
import { Car } from '../../cars/entities/car.entity';
import { User } from '../../users/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { ImageTypeEnum } from '../constants/image-type.enum';
import { IImage } from '../interfaces/image.interface';

@Entity('images')
export class Image extends EntityAbstract implements IImage {
  @Column({
    nullable: true,
  })
  objectId: number;

  @ManyToOne(() => Car, (car) => car.images, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'object_id', referencedColumnName: 'id' })
  car: Car;

  @ManyToOne(() => User, (user) => user.images, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'object_id', referencedColumnName: 'id' })
  user: User;

  @Column({
    nullable: true,
    type: 'enum',
    enum: ImageTypeEnum,
  })
  objectType: ImageTypeEnum;

  @Column({
    nullable: true,
  })
  url: string;
}
