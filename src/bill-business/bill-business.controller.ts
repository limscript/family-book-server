import { Body, Controller, Post, Get, Query } from '@nestjs/common';
import { BillBusinessService } from "./bill-business.service";
import { UserService } from '../user/user.service';
import { formatDate, dateSubtract } from '../utils';


@Controller('bill-business')
export class BillBusinessController {
  constructor(private readonly billBusinessService: BillBusinessService, private readonly userService: UserService) { }

  /**
   * 创建账单
   * @param bill
   */
  @Post('create')
  async create(@Body() bill) {
    const res = await this.billBusinessService.create(bill)
    // 当天业务数据数量, 等于1，说明是今日新增
    const businessCount: number = await this.billBusinessService.queryTodayBill({
      recordDate: bill.recordDate,
      createBy: bill.createBy
    });

    // 昨天有没有记录数据，没有就设为-1，有的话，当天业务数据为1设为1，当天业务数据大于1设为0
    const hasYesterdayRecord = await this.billBusinessService.queryYesterdayIsRecord({
      createTime: dateSubtract(bill.createTime, 1),
      createBy: bill.createBy
    });
    let clockDays = hasYesterdayRecord ? (businessCount === 1 ? 1 : 0) : -1
    // 更新用户业务数据
    const userData = {
      userId: bill.createBy,
      clockDays: clockDays,
      recordDays: businessCount === 1 ? 1 : 0,
      recordNum: 1
    }

    await this.userService.updateUserBusiness(userData)
    return res
  }
  /**
   * 删除账单
   * @param id
   */
  @Post('delete')
  async remove(@Body() body) {
    const res = await this.billBusinessService.remove(body)
    // 当天业务数据数量等于0，说明今日记录的已删完
    const businessCount: number = await this.billBusinessService.queryTodayBill({
      recordDate: new Date(body.recordDate),
      createBy: body.createBy
    });

    // 更新用户业务数据
    const userData = {
      userId: body.createBy,
      clockDays: businessCount === 0 ? -1 : 0,
      recordDays: businessCount === 0 ? -1 : 0,
      recordNum: -1
    }
    await this.userService.updateUserBusiness(userData)
    return res
  }


  /**
   * 更新账单
   * @param bill
   */
  @Post("update")
  async update(@Body() bill) {
    return await this.billBusinessService.updateById(bill)
  }

  /**
   * 获取账单列表明细
   * @param id
   */
  @Get('detail/list')
  async getDetailList(@Query() query) {
    let res = await this.billBusinessService.getDetailList(query)
    return res
  }

  /**
   * 获取账单列表 - 按年
   * @param year
   */
  @Get('list/year')
  async getBillListByYear(@Query() query) {
    let res = await this.billBusinessService.getBillListByYear(query)
    return res
  }

  /**
   * 获取本月支出
   * @param date
   */
  @Get('expend/month')
  async getCurrentMonthExpend(@Query() query) {
    let res = await this.billBusinessService.getCurrentMonthExpend(query)
    return res
  }

  /**
   * 获取今日花销图片
   * @param query
   */
  @Get('today/expense/img')
  async getTodayExpenseImg(@Query() query) {
    return await this.billBusinessService.getTodayExpenseImg(query)
  }

  /**
   * 获取图表数据
   * @param query
   */
  @Get('chart')
  async getChartData(@Query() query) {
    return await this.billBusinessService.getChartData(query)
  }
}
