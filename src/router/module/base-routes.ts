import BaseLayout from '../../layouts/BaseLayout.vue';
import Login from '../../views/login/index.vue';


export default [
  {
    path: '/',
    redirect: '/workSpace'
  },
  {
    path: '/login',
    component: Login,
    meta: { title: '登录页面' },
  },
  {
    path: '/workspace',
    redirect: '/workspace/dashboards',
    component: BaseLayout,
    meta: { title: '工作空间' },
    children: [
      {
        path: '/workspace/dashboards',
        name: 'dashboards',
        component: () => import('../../views/workSpace/dashboards/index.vue'),
        meta: { title: 'Dashboards', requireAuth: true, affix: true, closable: false },
      },
    ]
  },
  {
    path: '/list',
    component: BaseLayout,
    meta: { title: '列表页面' },
    children: [
      {
        path: '/list/asn',
        name: '入库列表',
        component: () => import('../../views/list/asn/index.vue'),
        meta: { title: '入库列表', requireAuth: true},
      },
      {
        path: '/list/asn/create',
        name: '入库单创建',
        component: () => import('../../views/list/asn/form.vue'),
        meta: { title: '入库单创建', requireAuth: true},
      },
      {
        path: '/list/asn/edit/:asn_id',
        name: '入库单编辑',
        component: () => import('../../views/list/asn/form.vue'),
        meta: { title: '入库单编辑', requireAuth: true},
        props: true
      },
      {
        path: '/list/asn/show/:asn_id/:action',
        name: '入库单详情',
        component: () => import('../../views/list/asn/form.vue'),
        meta: { title: '入库单详情', requireAuth: true},
        props: true
      },
      {
        path: '/list/order',
        name: '订单列表',
        component: () => import('../../views/list/order/index.vue'),
        meta: { title: '订单列表', requireAuth: true},
      },
      {
        path: '/list/order/create',
        name: '订单创建',
        component: () => import('../../views/list/order/form.vue'),
        meta: { title: '订单创建', requireAuth: true},
      },
      {
        path: '/list/order/edit/:order_id',
        name: '订单编辑',
        component: () => import('../../views/list/order/form.vue'),
        meta: { title: '订单编辑', requireAuth: true},
        props: true
      },
      {
        path: '/list/material',
        name: '物料列表',
        component: () => import('../../views/list/material/index.vue'),
          meta: { title: '物料列表', requireAuth: true},
      },
      {
        path: '/list/sku',
        name: '商品列表',
        component: () => import('../../views/list/sku/index.vue'),
        meta: { title: '商品列表', requireAuth: true},
      },
      {
        path: '/list/sku/create',
        name: '商品创建',
        component: () => import('../../views/list/sku/form.vue'),
        meta: { title: '商品创建', requireAuth: true},
      },
      {
        path: '/list/sku/edit/:sku_id',
        name: '商品编辑',
        component: () => import('../../views/list/sku/form.vue'),
        meta: { title: '商品编辑', requireAuth: true},
        props: true
      },
      {
        path: '/list/supplier',
        name: '供应商列表',
        component: () => import('../../views/list/supplier/index.vue'),
        meta: { title: '供应商列表', requireAuth: true},
      },
      {
        path: '/list/user',
        name: '用户列表',
        component: () => import('../../views/list/admin/index.vue'),
        meta: { title: '用户列表', requireAuth: true},
      },
      {
        path: '/list/debug',
        name: 'Debug',
        component: () => import('../../views/list/debug/index.vue'),
        meta: { title: 'Debug', requireAuth: true},
      },
    ]
  },
  {
    path: '/operation',
    component: BaseLayout,
    meta: { title: '操作页面' },
    children: [
      {
        path: '/operation/inbound',
        name: '入库',
        component: () => import('../../views/operation/inbound.vue'),
        meta: { title: '入库', requireAuth: true, affix: true, closable: false },
      },
    ]
  }
    
]