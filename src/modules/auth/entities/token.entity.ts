import { EntityAbstract } from '@common/base/base.entity';
import { User } from '../../users/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AuthTokenEnum } from '../constants/auth-token.constant';
import { IToken } from '../interfaces/token.interface';

@Entity('tokens')
export class Token extends EntityAbstract implements IToken {
  @Column({
    type: 'enum',
    nullable: true,
    enum: AuthTokenEnum,
  })
  type: AuthTokenEnum;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  expiredAt: Date;

  @Column({
    nullable: true,
  })
  userId: number;

  @ManyToOne(() => User, (user) => user.tokens, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;
}
