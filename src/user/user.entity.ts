import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { CommonFieldEntity } from '../core/entity/common.entity';
import { UserRole } from '../config/enum.config';

@Entity("user")
export class UserEntity extends CommonFieldEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string; // 标记为主列，值自动生成

  @Column({ name: 'name', length: 50, default: '' })
  nickName: string;

  @Column({ length: 20, default: '' })
  account: string;

  @Column({ name: 'open_id', length: 50 })
  openId: string;

  @Column({ name: 'avatar_url', default: '' })
  avatarUrl: string;

  @Column({ type: 'bigint', default: 0 })
  mobile: number

  @Column({ name: 'clock_days', type: 'bigint', default: 0 })
  clockDays: number

  @Column({ name: 'record_days', type: 'bigint', default: 0 })
  recordDays: number

  @Column({ name: 'record_num', type: 'bigint', default: 0 })
  recordNum: number

  @Column({ type: 'bigint', default: 0 })
  budget: number

  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.EDITOR
  })
  role: UserRole
}
