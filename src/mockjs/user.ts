import { Result } from "../types/result";
import { User } from "../types/user";

let user: User = {
  'userId': '1',
  'username': 'root',
}

const menus = [
  {
    id: "/workspace",
    icon: "layui-icon-home",
    title: "工作空间",
    children: [
      {
        id: "/workspace/dashboards",
        icon: "layui-icon-find-fill",
        title: "Dashboards"
      }
    ]
  },
  {
    id: "/table",
    icon: "layui-icon-align-left",
    title: "列表页面",
    children: [
      {
        id: "/list/asn",
        icon: "layui-icon-list",
        title: "入库列表",
      },
      {
        id: "/list/order",
        icon: "layui-icon-list",
        title: "订单列表"
      },
      {
        id: "/list/material",
        icon: "layui-icon-list",
        title: "物料列表"
      },
      {
        id: "/list/sku",
        icon: "layui-icon-list",
        title: "商品列表",
      },
      {
        id: "/list/supplier",
        icon: "layui-icon-list",
        title: "供应商"
      },
      {
        id: "/list/user",
        icon: "layui-icon-list",
        title: "用户列表"
      },
      {
        id: "/list/debug",
        icon: "layui-icon-list",
        title: "Debug"
      }
    ]
  },
  {
    id: "/operation",
    icon: "layui-icon-component",
    title: "操作页面",
    children: [
      {
        id: "/operation/inbound",
        icon: "layui-icon-find-fill",
        title: "入库"
      }
    ]
  },
]

const getInfo = (req: any, res: any) => {
  let item = JSON.parse(req.body);
  let token = item ? item.token : null;
  let result: Result = {
    code: 200,
    msg: "操作成功",
    data: user,
    success: true
  }
  if (item || token) {
    result.code = 99998;
    result.msg = "请重新登录";
    result.success = false;
  }
  return result;
}

const getPermission = (req: any, res: any) => {
  let item = JSON.parse(req.body);
  let token = item ? item.token : null;
  let result: Result = {
    code: 200,
    msg: "操作成功",
    //data: ['sys:user:add', 'sys:user:edit', 'sys:user:delete', 'sys:user:import', 'sys:user:export'],
    data:[],
    success: true
  }
  if (item || token) {
    result.code = 99998;
    result.msg = "请重新登录";
    result.success = false;
  }
  return result;
}

const getMenu = (req: any, res: any) => {
  let item = JSON.parse(req.body);
  let token = item ? item.token : null;
  let result: Result = {
    code: 200,
    msg: "操作成功",
    data: menus,
    success: true
  }
  if (item || token) {
    result.code = 99998;
    result.msg = "请重新登录";
    result.success = false;
  }
  return result;
}

const getUpload = (req: any, res: any) => {
  return {
    'code': 200,
    'msg': '上传成功',
    'success': true
  }
}

export default {
  getInfo, 
  getMenu, 
  //getLogin, 
  getPermission, 
  getUpload
}