import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getConnection } from 'typeorm';
import { ClassifyBusinessEntity } from './classify-business.entity';

@Injectable()
export class ClassifyBusinessService {
  constructor(
    @InjectRepository(ClassifyBusinessEntity)
    private readonly classifyBusinessRepository: Repository<ClassifyBusinessEntity>,
  ) { }

  // 创建分类
  async create(newClassify: Partial<ClassifyBusinessEntity>): Promise<ClassifyBusinessEntity> {
    const { name, createBy, mode } = newClassify;


    const existClassify = await this.classifyBusinessRepository.findOne({ where: { name } });
    if (existClassify) {
      throw new HttpException('分类已存在', 401);
    }
    const maxData = await getConnection().query(`
      SELECT MAX(sort) FROM classify_business
      WHERE user_id = "${createBy}" AND mode = ${mode}
    `)

    if (!maxData || !maxData[0] || !maxData[0]['MAX(sort)']) {
      throw new HttpException('查询分类sort报错', 401);
    }
    // 添加sort、userId
    const classify = {
      ...newClassify,
      userId: createBy,
      sort: maxData[0]['MAX(sort)'] + 1,
    }
    return await this.classifyBusinessRepository.save(classify);
  }

  // 获取指定分类列表
  async findClassifyList(user: Partial<ClassifyBusinessEntity>): Promise<ClassifyBusinessEntity[]> {
    return await this.classifyBusinessRepository.find({
      where: { userId: user.id, isDeleted: 0 },
      order: {
        sort: "ASC"
      }
    });
  }

  // 更新分类信息
  async updateById(classify): Promise<ClassifyBusinessEntity> {
    if (!classify.id) {
      throw new HttpException(`classify_id必填`, 401);
    }
    const existClassify = await this.classifyBusinessRepository.findOne(classify.id);
    if (!existClassify) {
      throw new HttpException(`id为${classify.id}的分类不存在`, 401);
    }

    if (existClassify.name === classify.name) {
      throw new HttpException(`该分类已存在`, 501);
    }
    const updateClassify = this.classifyBusinessRepository.merge(existClassify, classify);
    return this.classifyBusinessRepository.save(updateClassify);
  }

  // 刪除分类
  async remove(id) {

    const existClassify = await this.classifyBusinessRepository.findOne(id);

    if (!existClassify) {
      throw new HttpException(`id为${id}的分类不存在`, 401);
    }
    // 逻辑删除
    const updateClassify = this.classifyBusinessRepository.merge(existClassify, { isDeleted: 1 });
    return this.classifyBusinessRepository.save(updateClassify);
    // return await this.classifyBusinessRepository.remove(existClassify);
  }

  // 初始化用户分类
  async initUserClassify(classifyList) {
    const nameVerify = classifyList.some(item => !item.name);
    const iconVerify = classifyList.some(item => !item.icon);
    if (nameVerify || iconVerify) {
      throw new HttpException(`icon和name必填`, 401);
    }
    await getConnection()
      .createQueryBuilder()
      .insert()
      .into(ClassifyBusinessEntity)
      .values(classifyList)
      .execute();
  }

}
