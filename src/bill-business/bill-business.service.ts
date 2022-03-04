import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getConnection, Like } from 'typeorm';
import { groupBy, startsWith } from 'lodash';
import Decimal from "decimal.js";
import { createCanvas, loadImage } from 'canvas';

import { BillBusinessEntity } from './bill-business.entity';
import { formatDate, dateDiff, dateArray } from '../utils';

@Injectable()
export class BillBusinessService {
  constructor(
    @InjectRepository(BillBusinessEntity)
    private readonly billBusinessRepository: Repository<BillBusinessEntity>,
  ) { }

  // 创建账单
  async create(newBill: Partial<BillBusinessEntity>): Promise<BillBusinessEntity> {
    if (!newBill.mode || !newBill.classifyId) {
      throw new HttpException(`分类信息必填`, 401);
    }
    // let existBill = await this.classifyBusinessRepository.findOne({ classifyId})
    // if (!existBill || existBill.mode !== newBill.mode) {
    //   throw new HttpException(`分类和模式不匹配`, 401);
    // }

    return await this.billBusinessRepository.save(newBill);
  }

  // 获取指定账单by - id
  async findById(id: string): Promise<BillBusinessEntity> {
    return await this.billBusinessRepository.findOne(id);
  }

  // 更新账单信息
  async updateById(bill: any): Promise<BillBusinessEntity> {
    if (!bill.id) {
      throw new HttpException(`bill_id必填`, 401);
    }
    const existBill = await this.billBusinessRepository.findOne(bill.id);
    if (!existBill) {
      throw new HttpException(`id为${bill.id}的账单不存在`, 401);
    }

    const updateBill = this.billBusinessRepository.merge(existBill, bill);
    return this.billBusinessRepository.save(updateBill);
  }

  // 刪除账单
  async remove(query: any) {
    const { id, createBy } = query
    const existBill = await this.billBusinessRepository.findOne(id);

    if (!existBill) {
      throw new HttpException(`id为${id}的账单不存在`, 401);
    }
    if (existBill.createBy !== createBy) {
      throw new HttpException(`创建人与当担用户不一致`, 401);
    }
    // 逻辑删除
    const updateBill = this.billBusinessRepository.merge(existBill, { isDeleted: 1 });
    return this.billBusinessRepository.save(updateBill);
    // return await this.billBusinessRepository.remove(existBill);
  }

  // 获取账单列表明细
  async getDetailList(query: any) {
    const { date, createBy } = query
    if (!date || !createBy) {
      throw new HttpException(`recordDate和createBy必填`, 401);
    }
    // 获取用户查询时间内所有的账单数据
    const allBillDate = await getConnection()
      .query(`SELECT
              bill.id, bill.amount, bill.mode
              , bill.remark, bill.classify_id AS classifyId, bill.record_date AS recordDate, classify.name AS classifyName, classify.icon AS classifyIcon
              FROM bill_business bill
              LEFT JOIN classify_business classify ON classify.id = bill.classify_id
              WHERE bill.create_by = "${createBy}" AND bill.is_deleted = 0 AND bill.record_date like '%${date}%'
              ORDER BY bill.record_date DESC
            `)

    // 按日期分组对象
    const dataObj = groupBy(allBillDate, 'recordDate')
    // 按日期分组数组
    const dateList = Object.keys(dataObj).map(item => {
      let list = dataObj[item]

      const { expendAmount: expend, incomeAmount: income } = this.getAmountData(list);
      return {
        recordDate: item,
        expend,
        income,
        list
      };
    })
    // 支出总金额
    let expendAmount: number | string = '0.00'
    // 收入总金额
    let incomeAmount: number | string = '0.00'
    dateList.forEach(i => {
      expendAmount = new Decimal(expendAmount).add(new Decimal(i.expend)).toFixed(2)
      incomeAmount = new Decimal(incomeAmount).add(new Decimal(i.income)).toFixed(2)
    })

    return {
      dateList,
      expendAmount,
      incomeAmount,
    }

  }

  // 获取账单列表 - 按年
  async getBillListByYear(query: any) {
    const { year, createBy } = query
    const billDate = await this.billBusinessRepository.find({
      where: { createBy, isDeleted: 0, recordDate: Like(`${year}%`) }
    })
    const {
      expendAmount,
      incomeAmount,
      balanceAmount
    } = this.getAmountData(billDate)

    // 月份账单列表
    const list = []
    let curMonth = new Date().getMonth() + 1
    // 查看过去日期的数据或者未来的数据
    if (new Date().getFullYear() !== Number(year)) {
      curMonth = 12
    }

    for (let i = curMonth; i > 0; i--) {
      let curList = billDate.filter(item => {
        return new Date(item.recordDate).getMonth() + 1 === i
      })
      const {
        expendAmount: expend,
        incomeAmount: income,
        balanceAmount: balance
      } = this.getAmountData(curList)

      list.push({
        month: `${i}月`,
        income,
        expend,
        balance
      })
    }
    return {
      list,
      income: incomeAmount,
      expend: expendAmount,
      balance: balanceAmount
    }
  }
  // 获取本月支出
  async getCurrentMonthExpend(query: any) {
    const { createBy } = query
    const currentMonth = formatDate(null, 'YYYY-MM')
    const billList = await this.billBusinessRepository.find({
      where: { createBy, isDeleted: 0, mode: 1, recordDate: Like(`${currentMonth}%`) }
    })

    const { expendAmount } = this.getAmountData(billList)
    return expendAmount
  }

  // 工具函数 - 计算列表中的收入及支出
  getAmountData(list: any) {
    // 支出总金额
    let expendAmount: number | string = 0
    // 收入总金额
    let incomeAmount: number | string = 0
    list.forEach(i => {
      if (Number(i.mode) === 1) {
        expendAmount = new Decimal(expendAmount).add(new Decimal(i.amount)).toFixed(2)
      }
      if (Number(i.mode) === 2) {
        incomeAmount = new Decimal(incomeAmount).add(new Decimal(i.amount)).toFixed(2)
      }
    })
    // 结余
    let balanceAmount = new Decimal(incomeAmount).sub(new Decimal(expendAmount)).toFixed(2)
    return {
      expendAmount,
      incomeAmount,
      balanceAmount
    }
  }

  // 查询今日账单数量
  async queryTodayBill(query: any): Promise<number> {
    const res = await this.billBusinessRepository.count(query)

    return res
  }

  // 查询昨日有没有记录
  async queryYesterdayIsRecord(query: any): Promise<boolean> {

    const res = await this.billBusinessRepository.findOne(query);

    return !!res
  }

  // 获取今日花销图片
  async getTodayExpenseImg(query: any) {
    // const canvas = createCanvas(200, 200)
    // const ctx = canvas.getContext('2d')
    // // Write "Awesome!"
    // ctx.font = '30px Impact'
    // ctx.rotate(0.1)
    // ctx.fillText('Awesome!', 50, 100)

    // // Draw line under text
    // var text = ctx.measureText('Awesome!')
    // ctx.strokeStyle = 'rgba(0,0,0,0.5)'
    // ctx.beginPath()
    // ctx.lineTo(50, 102)
    // ctx.lineTo(50 + text.width, 102)
    // ctx.stroke()
    // console.log(canvas.toDataURL());

    // return canvas.toDataURL()
    // Draw cat with lime helmet
    // loadImage('static/images/today-expense.png').then((image) => {
    //   ctx.drawImage(image, 50, 0, 70, 70)

    //   console.log('<img src="' + canvas.toDataURL() + '" />')
    // })
  }

  // 查询传入的分类id是否有录入数据
  async queryClassifyHasBusinessData(classifyId: string) {
    return await this.billBusinessRepository.findOne({ where: { classifyId, isDeleted: 0 } });
  }

  // 获取图表数据
  async getChartData(query: any) {
    if (!query.startDate || !query.endDate) {
      throw new HttpException(`时间范围必填`, 401);
    }
    const { mode, type, createBy, startDate, endDate } = query

    const allBillDate = await getConnection()
      .query(`SELECT
              bill.id, bill.amount, bill.mode, bill.remark, bill.classify_id AS classifyId,
              bill.record_date AS recordDate, classify.name AS classifyName, classify.icon AS classifyIcon
              FROM bill_business bill
              LEFT JOIN classify_business classify ON classify.id = bill.classify_id
              WHERE bill.create_by = "${createBy}" AND bill.is_deleted = 0 AND bill.mode = ${mode} AND
              bill.record_date BETWEEN "${startDate}" AND "${endDate}"
              ORDER BY CAST(bill.amount AS DECIMAL) DESC
            `)

    // 空数据
    if (allBillDate.length === 0) {
      return {
        sumAmount: '0',
        rankList: [],
        chartData: []
      }
    }
    // chart数据
    const num: number =
      Number(type) === 1 ? dateDiff(endDate, startDate) : 11;
    let chartData: any = dateArray(num, startDate, Number(type))
    chartData = chartData.map((item: any) => {
      const billList = allBillDate.filter(i => startsWith(formatDate(i.recordDate), item))
      const { expendAmount, incomeAmount } = this.getAmountData(billList)
      return { expendAmount, incomeAmount }
    })

    // 按分类对象分组
    const classifyObj = groupBy(allBillDate, 'classifyId')

    // 总金额
    const sum = allBillDate.reduce((a, b) => {
      let amount = new Decimal(a.amount).add(new Decimal(b.amount)).toFixed(2)
      return {
        amount
      }
    })

    // 排行榜列表
    let classifyList = Object.keys(classifyObj).map(item => {
      let list = classifyObj[item]
      const { amount, classify, ratio } = this.geRatioData(list, sum.amount);
      return {
        ...classify,
        amount,
        ratio,
        list
      };
    })
    //  排行榜第一
    const firstRank = classifyList[0] ? classifyList[0].amount : ''
    classifyList = classifyList.map(item => {
      return {
        ...item,
        progress: Decimal.div(item.amount, firstRank).mul(100).toFixed(1)
      }
    })
    return {
      sumAmount: sum.amount,
      rankList: classifyList,
      chartData
    }
  }

  // 工具函数 - 计算列表中的比例和金额
  geRatioData(list: any, sum: string) {
    // 支出总金额
    let amount: number | string = 0
    let classify: any = {}
    list.forEach(i => {
      amount = new Decimal(amount).add(new Decimal(i.amount)).toFixed(2)
      if (!classify.classifyId) {
        classify = {
          classifyId: i.classifyId,
          classifyName: i.classifyName,
          classifyIcon: i.classifyIcon,
        }
      }
    })

    let ratio: string = Decimal.div(amount, sum).mul(100).toFixed(1) + '%'

    return {
      amount,
      ratio,
      classify
    }
  }
}
