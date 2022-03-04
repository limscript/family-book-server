import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { CommonFieldEntity } from '../core/entity/common.entity';
import { ClassifyMode, ClassifyType } from '../config/enum.config';

@Entity("classify")
export class ClassifyEntity extends CommonFieldEntity {
    @PrimaryGeneratedColumn('increment')
    id: number; // 标记为主列，值自动生成

    @Column({ length: 50, default: '' })
    name: string;

    @Column({ length: 20, default: '' })
    icon: string;

    @Column({ length: 20, default: '' })
    group: string;

    @Column({
        type: "enum",
        enum: ClassifyMode,
        default: ClassifyMode.EXPEND
    })
    mode: ClassifyMode

    @Column({
        type: "enum",
        enum: ClassifyType,
        default: ClassifyType.SYSTEM
    })
    type: ClassifyType
}
