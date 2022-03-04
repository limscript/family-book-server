import { Column } from "typeorm";
export abstract class CommonFieldEntity {
  @Column({ name: 'is_deleted', type: 'int', default: 0 })
  isDeleted: number

  @Column({ name: 'create_time', type: 'timestamp', default: () => "CURRENT_TIMESTAMP" })
  createTime: Date

  @Column({ name: 'create_by', length: 50, default: 'root' })
  createBy: string;

  @Column({ name: 'update_time', type: 'timestamp', default: () => "CURRENT_TIMESTAMP" })
  updateTime: Date

  @Column({ name: 'update_by', length: 50, default: 'root' })
  updateBy: string;
}
