import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Observable, map } from 'rxjs';

@Injectable()
export class AxiosService {

  constructor(
    private readonly httpService: HttpService
  ) { }
  // 发送get请求
  get(url: string, data: any): Observable<any> {
    const config: any = {
      method: 'get',
      url,
      params: data,
    }
    return this.httpService.request(config).pipe(
      map((res) => res.data)
    );
  }
  // 发送post请求
  post(url: string, data: any): Observable<any> {
    const config: any = {
      method: 'post',
      url,
      data,
    }
    return this.httpService.request(config).pipe(
      map((res) => res.data)
    );
  }

}
