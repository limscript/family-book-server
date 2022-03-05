interface MiniProgram {
  baseUrl: string;
  appid: string;
  secret: string;
}
//  小程序配置文件
export const MINI_PROGRAM_CONFIG: MiniProgram = {
  baseUrl: 'https://api.weixin.qq.com',
  appid: 'wx4416e2aa666d107a',
  secret: '37fe31f4ece57708c3d0508c86bec754',
}
// 服务器https证书位置
// /usr/local/lighthouse/softwares/nginx/conf/www.limscript.vip_nginx
