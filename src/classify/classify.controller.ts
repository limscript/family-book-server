import { Body, Controller, Post, Get, Query, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ClassifyService } from "./classify.service";
import { FileInterceptor } from '@nestjs/platform-express';
import xlsx from 'node-xlsx';

@Controller('classify')
export class ClassifyController {
  constructor(private readonly classifyService: ClassifyService) { }

  /**
   * 创建分类
   * @param classify
   */
  @Post('create')
  async create(@Body() classify) {
    return await this.classifyService.create(classify)
  }

  /**
   * 更新分类
   * @param classify
   */
  @Post("update")
  async update(@Body() classify) {
    return await this.classifyService.updateById(classify)
  }

  /**
   * 删除分类
   * @param id
   */
  @Post('delete')
  async remove(@Body("id") id) {
    return await this.classifyService.remove(id)
  }

  /**
   * 初始化系统分类
   * @param classifyList
   */
  @Post('init')
  async initSystemClassify(@Body() classifyList) {
    return await this.classifyService.initSystemClassify(classifyList)
  }

  /**
   * 获取系统分类组合
   * @param query
   */
  @Get('group')
  async getSystemClassifyGroup(@Query() query) {
    return await this.classifyService.getSystemClassifyGroup(query)
  }

  /**
   * 导入系统分类
   * @param body
   */
  @Post('import')
  @UseInterceptors(FileInterceptor('file'))
  async exportSystemClassify(@UploadedFile() file) {
    const data = xlsx.parse(file.buffer)
    const table = data[0].data || []
    // 去掉标题栏
    table.shift()
    const classifyList: any = table.map((item: any) => {
      const [group, name, icon, type, mode] = item
      return {
        name,
        icon,
        group,
        mode,
        type
      };
    });

    return await this.classifyService.initSystemClassify(classifyList)
  }
}
