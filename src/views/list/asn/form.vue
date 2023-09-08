<template>
  <div style="height: 100%; width: 100%">
    <div style="height: calc(100% - 60px); width: 100%; overflow: auto">
      <lay-container
        :fluid="true"
        style="padding: 10px; padding-top: 0px; position: relative"
      >
        <lay-form :model="formData" ref="layFormRef" required>
          <lay-card title="入库单信息">
            <lay-row>
              <lay-col md="12">
                <lay-form-item label="入库单号" prop="asn_number">
                  <lay-input
                    placeholder="请输入条码"
                    v-model="formData.asn_number"
                    :disabled="disabled"
                  ></lay-input>
                </lay-form-item>
              </lay-col>
              <lay-col md="12">
                <lay-form-item label="备注">
                  <lay-input
                    placeholder="请输入备注"
                    v-model="formData.remarks"
                    :disabled="disabled"
                  ></lay-input>
                </lay-form-item>
              </lay-col>
            </lay-row>
          </lay-card>
          <lay-line theme="orange"></lay-line>
          <lay-card title="物料列表">
            <lay-table :columns="columns" :dataSource="formData.items">
              <template #material_id="{ data,rowIndex }" >
                <lay-form-item  :prop="'items.'+rowIndex+'.material_id'">
                  <lay-select v-model="data.material_id"  :items="materialSourceData" :options="materialSourceData" :show-search="true" :disabled="disabled"></lay-select>
                </lay-form-item>
              </template>
              <template #supplier_id="{ data,rowIndex }" >
                <lay-form-item  :prop="'items.'+rowIndex+'.supplier_id'">
                  <lay-select v-model="data.supplier_id"  :items="supplierSourceData" :options="supplierSourceData" :show-search="true" :disabled="disabled"></lay-select>
                </lay-form-item>
              </template>
              <template #plan_qty="{ data,rowIndex }">
                <lay-form-item :prop="'items.'+rowIndex+'.plan_qty'">
                  <lay-input-number
                    v-model="data.plan_qty"
                    :disabled="disabled"
                  ></lay-input-number>
                </lay-form-item>
              </template>
              <template #actual_qty="{ data,rowIndex }">
                <lay-form-item :prop="'items.'+rowIndex+'.actual_qty'">
                  <lay-input-number
                    v-model="data.actual_qty"
                    :disabled="true"
                  ></lay-input-number>
                </lay-form-item>
              </template>
              <template #plan_unit_price="{ data,rowIndex }">
                <lay-form-item :prop="'items.'+rowIndex+'.plan_unit_price'">
                  <lay-input-number :step="0.01"
                    v-model="data.plan_unit_price"
                    :disabled="disabled"
                  ></lay-input-number>
                </lay-form-item>
              </template>
              <template #actual_unit_price="{ data,rowIndex }">
                <lay-form-item :prop="'items.'+rowIndex+'.actual_unit_price'">
                  <lay-input-number :step="0.01"
                    v-model="data.actual_unit_price"
                    :disabled="disabled"
                  ></lay-input-number>
                </lay-form-item>
              </template>
              <template #operate="{ data }">
                  <lay-button type="danger" size="xs" @click="deleteHandler(data)" v-if="action != 'show'">
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
              v-if="action != 'show'"
              >新增</lay-button
            >
          </lay-card>
        </lay-form>
      </lay-container>
    </div>
    <div class="footer">
      <div class="footer-button">
        <lay-button type="primary" @click="submitForm" v-if="action != 'show'">提交</lay-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, watch, reactive } from 'vue'
import { layer } from '@layui/layer-vue'
import { createOrUpdate,getAsnInfo } from '../../../api/module/asn'
import { getSelectList } from '../../../api/module/commone'
import router from '../../../router'

export default {
  name: 'Intricate',
  props: ['asn_id','action'],
  setup(props) {
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
        material_id: '',
        supplier_id:'',
        plan_qty: 1,
        actual_qty:0,
        plan_unit_price:0.00,
        actual_unit_price:0.00
      })
    }

    // 表单数据
    const formData = ref({
      id: '',
      asn_number: '',
      remarks: '',
      items: [
      {
        id:'',
        material_id: '',
        supplier_id:'',
        rowIndex: "1",
        plan_qty: 1,
        actual_qty:0,
        plan_unit_price:0.00,
        actual_unit_price:0.00
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
                  router.push('/list/asn')
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

    const materialSourceData = ref([])
    const supplierSourceData = ref([])
    let columns = []
    if(props.asn_id){
      columns = [
        {
          title: '物料名称',
          key: 'material_id',
          customSlot: 'material_id'
        },
        {
          title: '供应商',
          key: 'supplier_id',
          customSlot: 'supplier_id'
        },
        {
          title: '计划数量',
          key: 'plan_qty',
          ellipsisTooltip: true,
          customSlot: 'plan_qty'
        },
        {
          title: '实收数量',
          key: 'actual_qty',
          ellipsisTooltip: true,
          customSlot: 'actual_qty'
        },
        {
          title: '计划单价',
          key: 'plan_unit_price',
          ellipsisTooltip: true,
          customSlot: 'plan_unit_price'
        },
        {
          title: '实际单价',
          key: 'actual_unit_price',
          ellipsisTooltip: true,
          customSlot: 'actual_unit_price'
        },
        {
          title: '操作',
          width: '180px',
          key: 'operate',
          customSlot: 'operate',
          ellipsisTooltip: true
        }
      ]
    }else{
      columns = [
        {
          title: '物料名称',
          key: 'material_id',
          customSlot: 'material_id'
        },
        {
          title: '供应商',
          key: 'supplier_id',
          customSlot: 'supplier_id'
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
    }

    const disabled = ref(props.action == 'show'?true:false)

    return {
      columns,
      formData,
      submitForm,
      layFormRef,
      deleteHandler,
      addHandler,
      materialSourceData,
      supplierSourceData,
      disabled
    }
  },
  mounted(){
    getSelectList({type:"material"}).then(({data,code})=>{
      this.materialSourceData = data
    })
    getSelectList({type:"supplier"}).then(({data,code})=>{
      this.supplierSourceData = data
    })
    if(this.asn_id != undefined){
      let id = layer.load(1)
      getAsnInfo(this.asn_id).then(({code,data}) => {
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
