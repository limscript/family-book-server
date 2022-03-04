import { Controller, Get, Post, Body, Query, HttpException } from '@nestjs/common';
import { ClassifyBusinessService } from './classify-business.service';
import { ClassifyService } from '../classify/classify.service';
import { BillBusinessService } from '../bill-business/bill-business.service';


@Controller('classify-business')
export class ClassifyBusinessController {
  constructor(
    private readonly classifyBusinessService: ClassifyBusinessService,
    private readonly classifyService: ClassifyService,
    private readonly billBusinessService: BillBusinessService,
  ) { }

  /**
   * 创建分类
   * @param classify
   */
  @Post('create')
  async create(@Body() classify) {
    return await this.classifyBusinessService.create(classify)
  }

  /**
   * 获取指定用户分类列表
   * @param userId
   */
  @Get('list')
  async findClassifyList(@Query() user) {
    return await this.classifyBusinessService.findClassifyList(user)
  }

  /**
   * 更新分类
   * @param classify
   */
  @Post("update")
  async update(@Body() classify) {
    return await this.classifyBusinessService.updateById(classify)
  }

  /**
   * 删除分类
   * @param id
   */
  @Post('delete')
  async remove(@Body("id") id) {
    const hasRecord = await this.billBusinessService.queryClassifyHasBusinessData(id);
    if (hasRecord) {
      throw new HttpException(`该分类下已录入数据，不能删除`, 401);
    }
    return await this.classifyBusinessService.remove(id)
  }

  /**
 * 初始化用户分类
 * @param classifyList
 * @param userId
 */
  @Post('init')
  async initUserClassify(@Body("userId") userId) {
    let list: any = await this.classifyService.getAllSystemList()
    list = list.map(item => {
      return {
        name: item.name,
        icon: item.icon,
        mode: item.mode,
        group: item.group,
        sort: item.id,
        type: 2,
        userId
      }
    })
    return await this.classifyBusinessService.initUserClassify(list)
  }
}
