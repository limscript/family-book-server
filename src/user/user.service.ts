import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';

// export interface UserModel {
//   info: UserEntity{};
// }

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) { }

  // 创建用户
  async create(newUser: Partial<UserEntity>): Promise<UserEntity> {
    const { nickName, openId } = newUser;
    if (!nickName) {
      throw new HttpException('nickName必填', 401);
    }
    if (!openId) {
      throw new HttpException('open_id必填', 401);
    }

    const existUser = await this.userRepository.findOne({ where: { openId } });
    if (existUser) {
      throw new HttpException('用户已存在', 401);
    }
    return await this.userRepository.save(newUser);
  }

  // 获取指定用户by - id
  async findById(id): Promise<UserEntity> {
    return await this.userRepository.findOne(id);
  }

  // 获取指定用户
  async findByField(field: any): Promise<UserEntity> {
    delete field.createBy
    const userInfo = await this.userRepository.findOne(field);
    if (!userInfo) {
      throw new HttpException('用户不存在', 401);
    }
    return userInfo
  }

  // 更新用户信息
  async updateById(user): Promise<UserEntity> {
    if (!user.id) {
      throw new HttpException(`user_id必填`, 401);
    }
    const existUser = await this.userRepository.findOne(user.id);
    if (!existUser) {
      throw new HttpException(`id为${user.id}的用户不存在`, 401);
    }

    // if (+existUser.mobile === +user.mobile) {
    //   throw new HttpException(`该手机号已存在`, 501);
    // }
    const updateUser = this.userRepository.merge(existUser, user);
    return this.userRepository.save(updateUser);
  }

  // 刪除用户
  async remove(id) {

    const existUser = await this.userRepository.findOne(id);

    if (!existUser) {
      throw new HttpException(`id为${id}的用户不存在`, 401);
    }
    // 逻辑删除
    const updateUser = this.userRepository.merge(existUser, { isDeleted: 1 });
    return this.userRepository.save(updateUser);
    // return await this.userRepository.remove(existUser);
  }

  // 更新用户业务信息
  async updateUserBusiness(userData) {
    const currentUser = await this.userRepository.findOne(userData.userId);
    // 连续打卡日期，若果传的是-1，说明打卡间断，重置为1
    const clockDays = userData.clockDays === -1 ? 1 : (Number(currentUser.clockDays) + Number(userData.clockDays))
    const businessData = {
      id: userData.userId,
      clockDays: clockDays,
      recordDays: Number(currentUser.recordDays) + userData.recordDays,
      recordNum: Number(currentUser.recordNum) + userData.recordNum,
    }

    return await this.updateById(businessData)

  }

}
