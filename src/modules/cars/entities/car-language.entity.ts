import { EntityAbstract } from '@common/base/base.entity';
import { Language } from '../../languages/entities/language.entity';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { CarSteeringEnum } from '../constants/car-steering.enum';
import { Car } from './car.entity';

@Index(['languageCode', 'carId'])
@Entity('car_languages')
export class CarLanguage extends EntityAbstract {
  @Column({
    nullable: true,
  })
  languageCode: string;

  @ManyToOne(() => Language, (language) => language.carLanguages, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'language_code', referencedColumnName: 'code' })
  language: Language;

  @Column({
    nullable: true,
  })
  carId: number;

  @ManyToOne(() => Car, (car) => car.languages, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'car_id', referencedColumnName: 'id' })
  car: Car;

  @Index({ fulltext: true })
  @Column({
    nullable: true,
  })
  name: string;

  @Column({
    nullable: true,
  })
  description: string;

  @Column({
    type: 'enum',
    enum: CarSteeringEnum,
    nullable: true,
  })
  steering: CarSteeringEnum;
}
