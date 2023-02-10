import { Order } from '../../orders/entities/order.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Token } from '../../auth/entities/token.entity';
import { City } from '../../cities/entities/city.entity';
import { EntityAbstract } from '@common/base/base.entity';
import { Image } from '../../images/entities/image.entity';
import { Favourite } from '../../favourites/entities/favourite.entity';
import { IUser } from '../interfaces/user.interface';

@Entity('users')
export class User extends EntityAbstract implements IUser {
  @Column({
    nullable: true,
  })
  email: string;

  @Column({
    nullable: true,
  })
  hashedPassword: string;

  @Column({
    nullable: true,
  })
  fullName: string;

  @Column({
    nullable: true,
  })
  phoneNumber: string;

  @Column({
    nullable: true,
  })
  address: string;

  @Column({
    nullable: true,
  })
  cityId: number;

  @ManyToOne(() => City, (city) => city.users, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'city_id', referencedColumnName: 'id' })
  city: City;

  @Column({
    nullable: true,
  })
  occupation: string;

  @Column({
    type: 'timestamp',
    nullable: true,
    default: null,
  })
  verifiedAt: Date;

  @OneToMany(() => Token, (token) => token.user, {
    createForeignKeyConstraints: false,
  })
  tokens: Token[];

  @OneToMany(() => Order, (order) => order.user, {
    createForeignKeyConstraints: false,
  })
  orders: Order[];

  @OneToMany(() => Image, (image) => image.user, {
    createForeignKeyConstraints: false,
  })
  images: Image[];

  @OneToMany(() => Favourite, (favourite) => favourite.user, {
    createForeignKeyConstraints: false,
  })
  favourites: Favourite[];
}
