import { EntityAbstract } from '@common/base/base.entity';
import { CarTypeLanguage } from '../../car-types/entities/car-type-language.entity';
import { CarLanguage } from '../../cars/entities/car-language.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity('languages')
export class Language extends EntityAbstract {
  @Column({
    nullable: true,
  })
  code: string;

  @OneToMany(() => CarLanguage, (carLanguage) => carLanguage.language, {
    createForeignKeyConstraints: false,
  })
  carLanguages: CarLanguage[];

  @OneToMany(
    () => CarTypeLanguage,
    (carTypeLanguage) => carTypeLanguage.language,
    {
      createForeignKeyConstraints: false,
    },
  )
  carTypeLanguages: CarTypeLanguage[];
}
