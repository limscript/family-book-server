import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { CommonFieldEntity } from '../core/entity/common.entity';
import { ClassifyMode } from '../config/enum.config';

@Entity("bill_business")
export class BillBusinessEntity extends CommonFieldEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string; // 标记为主列，值自动生成

    @Column({ name: 'classify_id', length: 50, default: '' })
    classifyId: string;

    @Column({ name: 'record_date', type: 'timestamp', default: () => "CURRENT_TIMESTAMP" })
    recordDate: Date

    @Column({ length: 50, default: 'root' })
    amount: string;

    @Column({ length: 20, default: 'root' })
    remark: string;

    @Column({
        type: "enum",
        enum: ClassifyMode,
        default: ClassifyMode.EXPEND
    })
    mode: ClassifyMode
}
