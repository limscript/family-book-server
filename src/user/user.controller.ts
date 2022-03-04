import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { AxiosService } from '../axios/axios.service';
import { MINI_PROGRAM_CONFIG } from '.././config/mini.config';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService, private readonly axiosService: AxiosService) { }

  /**
   * 创建用户
   * @param post
   */
  @Post('create')
  async create(@Body() user) {
    return await this.userService.create(user)
  }


  /**
   * 更新用户
   * @param id
   * @param user
   */
  @Post("update")
  async update(@Body() user) {
    return await this.userService.updateById(user)
  }

  /**
   * 删除用户
   * @param id
   */
  @Post('delete')
  async remove(@Body("id") id) {
    return await this.userService.remove(id)
  }

  /**
   * 获取指定用户
   * @param mobile
   */
  @Get('get')
  async getUser(@Query() field) {
    return await this.userService.findByField(field)
  }

  /**
   * 获取openId
   * @param code
   */
  @Get('openId')
  async getOpenId(@Query('code') code) {
    let url = `${MINI_PROGRAM_CONFIG.baseUrl}/sns/jscode2session`
    let data = {
      appid: MINI_PROGRAM_CONFIG.appid,
      secret: MINI_PROGRAM_CONFIG.secret,
      js_code: code,
      grant_type: 'authorization_code'
    }
    return await this.axiosService.get(url, data)
  }

}
