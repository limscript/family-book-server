import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getConnection } from 'typeorm';
import { groupBy } from 'lodash';
import { ClassifyEntity } from './classify.entity';

@Injectable()
export class ClassifyService {
  constructor(
    @InjectRepository(ClassifyEntity)
    private readonly classifyRepository: Repository<ClassifyEntity>,
  ) { }

  // 创建分类
  async create(newClassify: Partial<ClassifyEntity>): Promise<ClassifyEntity> {
    const { name } = newClassify;

    const existClassify = await this.classifyRepository.findOne({ where: { name } });
    if (existClassify) {
      throw new HttpException('分类已存在', 401);
    }
    return await this.classifyRepository.save(newClassify);
  }

  // 获取所有系统分类
  async getAllSystemList(): Promise<ClassifyEntity[]> {
    return await this.classifyRepository.find({ isDeleted: 0, type: 1 })
  }

  // 获取指定分类by - id
  async findById(id): Promise<ClassifyEntity> {
    return await this.classifyRepository.findOne(id);
  }

  // 更新分类信息
  async updateById(classify): Promise<ClassifyEntity> {
    if (!classify.id) {
      throw new HttpException(`classify_id必填`, 401);
    }
    const existClassify = await this.classifyRepository.findOne(classify.id);
    if (!existClassify) {
      throw new HttpException(`id为${classify.id}的分类不存在`, 401);
    }

    if (existClassify.name === classify.name) {
      throw new HttpException(`该分类已存在`, 501);
    }
    const updateClassify = this.classifyRepository.merge(existClassify, classify);
    return this.classifyRepository.save(updateClassify);
  }

  // 刪除分类
  async remove(id) {

    const existClassify = await this.classifyRepository.findOne(id);

    if (!existClassify) {
      throw new HttpException(`id为${id}的分类不存在`, 401);
    }
    // 逻辑删除
    const updateClassify = this.classifyRepository.merge(existClassify, { isDeleted: 1 });
    return this.classifyRepository.save(updateClassify);
    // return await this.classifyRepository.remove(existClassify);
  }

  // 初始化系统分类
  async initSystemClassify(classifyList) {
    const nameVerify = classifyList.some(item => !item.name);
    const iconVerify = classifyList.some(item => !item.icon);
    if (nameVerify || iconVerify) {
      throw new HttpException(`icon和name必填`, 401);
    }
    await getConnection()
      .createQueryBuilder()
      .insert()
      .into(ClassifyEntity)
      .values(classifyList)
      .execute();
  }

  // 获取系统分类组合
  async getSystemClassifyGroup(query: any) {
    const allList = await this.classifyRepository.find({ isDeleted: 0, type: 3 })
    // 按日group分组对象
    const groupObj = groupBy(allList, 'group')
    // 按日期分组数组
    const classifyList = Object.keys(groupObj).map(item => {
      let list = groupObj[item]

      return {
        group: item,
        list
      };
    })
    return classifyList
  }
}
