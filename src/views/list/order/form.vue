<template>
  <div style="height: 100%; width: 100%">
    <div style="height: calc(100% - 60px); width: 100%; overflow: auto">
      <lay-container
        :fluid="true"
        style="padding: 10px; padding-top: 0px; position: relative"
      >
        <lay-form :model="formData" ref="layFormRef" required>
          <lay-card title="订单信息">
            <lay-row>
              <lay-col md="12">
                <lay-form-item label="订单号" prop="order_number">
                  <lay-input
                    placeholder="请输入条码"
                    v-model="formData.order_number"
                  ></lay-input>
                </lay-form-item>
              </lay-col>
              <lay-col md="12">
                <lay-form-item label="备注">
                  <lay-input
                    placeholder="请输入备注"
                    v-model="formData.remarks"
                  ></lay-input>
                </lay-form-item>
              </lay-col>
            </lay-row>
          </lay-card>
          <lay-line theme="orange"></lay-line>
          <lay-card title="物料列表">
            <lay-table :columns="columns" :dataSource="formData.items">
              <template #sku_id="{ data,rowIndex }" >
                <lay-form-item  :prop="'items.'+rowIndex+'.sku_id'" label="商品名称">
                  <lay-select v-model="data.sku_id"  :items="skuSourceData" :options="skuSourceData" :show-search="true"></lay-select>
                </lay-form-item>
              </template>
              <template #plan_qty="{ data,rowIndex }">
                <lay-form-item :prop="'items.'+rowIndex+'.plan_qty'" label="计划数量">
                  <lay-input-number
                    v-model="data.plan_qty"
                  ></lay-input-number>
                </lay-form-item>
              </template>
              <template #plan_unit_price="{ data,rowIndex }">
                <lay-form-item :prop="'items.'+rowIndex+'.plan_unit_price'" label="计划单价">
                  <lay-input-number :step="0.01"
                    v-model="data.plan_unit_price"
                  ></lay-input-number>
                </lay-form-item>
              </template>
              <template #operate="{ data }">
                <lay-button type="danger" size="xs" @click="deleteHandler(data)">
                  删除
                </lay-button>
              </template>
            </lay-table>
            <lay-button
              border="green"
              border-style="dashed"
              :fluid="true"
              @click="addHandler"
              style="margin-top: 10px"
              >新增</lay-button
            >
          </lay-card>
        </lay-form>
      </lay-container>
    </div>
    <div class="footer">
      <div class="footer-button">
        <lay-button type="primary" @click="submitForm">提交</lay-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, watch, reactive } from 'vue'
import { layer } from '@layui/layer-vue'
import { createOrUpdate,getOrderInfo } from '../../../api/module/order'
import { getSelectList } from '../../../api/module/commone'
import router from '../../../router'
import { number } from 'echarts'

export default {
  name: 'Intricate',
  props: ['order_id'],
  setup() {
    // 表格列
    const columns = [
      {
        title: '商品名称',
        key: 'sku_id',
        customSlot: 'sku_id'
      },
      {
        title: '计划数量',
        key: 'plan_qty',
        ellipsisTooltip: true,
        customSlot: 'plan_qty'
      },
      {
        title: '计划单价',
        key: 'plan_unit_price',
        ellipsisTooltip: true,
        customSlot: 'plan_unit_price'
      },
      {
        title: '操作',
        width: '180px',
        key: 'operate',
        customSlot: 'operate',
        ellipsisTooltip: true
      }
    ]
    // 删除行逻辑
    const deleteHandler = (data: any) => {
      layer.confirm('确定删除此条数据？', {
        btn: [
          {
            text: '确定',
            callback: () => {
              formData.value.items.forEach((item, index) => {
                if (item.rowIndex === data.rowIndex) {
                  formData.value.items.splice(index, 1)
                }
              })
              layer.closeAll()
            }
          },
          {
            text: '取消',
            callback: () => {
              layer.closeAll()
            }
          }
        ]
      })
    }

    // 新增行逻辑
    const addHandler = () => {
      formData.value.items.push({
        id:'',
        rowIndex: (formData.value.items.length + 1).toString(),
        sku_id: '',
        plan_qty: '1',
        plan_unit_price:0.00
      })
    }

    // 表单数据
    const formData = ref({
      id: '',
      order_number: '',
      remarks: '',
      items: [
      {
        id:'',
        sku_id: '',
        rowIndex: "1",
        plan_qty: '1',
        plan_unit_price:0.00
      }
    ]
    })

    // 校验数据
    const layFormRef = ref()
    const submitForm = () => {
      layFormRef.value.validate(
        (isValidate: boolean, model: any, errors: any) => {
          if (isValidate) {
            let id = layer.load(1)
            createOrUpdate(formData.value).then(({code,msg}) => {
              if(code == 200){
                layer.msg(msg, { icon: 1, time: 2000 },function(){
                  router.push('/list/order')
                  //location.reload()
                })
              }else{
                layer.msg(msg, { icon: 2, time: 2000 })
              }
            }).finally(() => {
              layer.close(id)
            })
            
            
          } 
        }
      )
    }

    const skuSourceData = ref([])
    return {
      columns,
      formData,
      submitForm,
      layFormRef,
      deleteHandler,
      addHandler,
      skuSourceData,
    }
  },
  mounted(){
    getSelectList({type:"sku"}).then(({data,code})=>{
      this.skuSourceData = data
    })
    if(this.order_id != undefined){
      let id = layer.load(1)
      getOrderInfo(this.order_id).then(({code,data}) => {
        this.formData = data
        
      }).finally(() => {
        layer.close(id)
      })
    }
     
  }
}
</script>

<style lang="less" scoped>
.title {
  font-size: 20px;
  font-weight: 500;
  margin-bottom: 20px;
  margin-top: 12px;
}

.describe {
  font-size: 14px;
  margin-bottom: 12px;
}
.footer {
  width: 100%;
  display: flex;
  align-items: center;
  padding: 10px;
  box-sizing: border-box;
  background-color: #ffffff;
  border-top: 1px solid whitesmoke;
  line-height: 60px;
  height: 60px;
  .footer-button {
    right: 10px;
    position: absolute;
  }
}
</style>
