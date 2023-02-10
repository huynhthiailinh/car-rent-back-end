import { EntityAbstract } from '@common/base/base.entity';
import { Language } from '../../languages/entities/language.entity';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { CarType } from './car-type.entity';

@Index(['languageCode', 'carTypeId'])
@Entity('car_type_languages')
export class CarTypeLanguage extends EntityAbstract {
  @Column({
    nullable: true,
  })
  languageCode: string;

  @ManyToOne(() => Language, (language) => language.carTypeLanguages, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'language_code', referencedColumnName: 'code' })
  language: Language;

  @Column({
    nullable: true,
  })
  carTypeId: number;

  @ManyToOne(() => CarType, (carType) => carType.languages, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'car_type_id', referencedColumnName: 'id' })
  carType: CarType;

  @Column({
    nullable: true,
  })
  name: string;
}
