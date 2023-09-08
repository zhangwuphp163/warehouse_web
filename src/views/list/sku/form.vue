<template>
  <div style="height: 100%; width: 100%">
    <div style="height: calc(100% - 60px); width: 100%; overflow: auto">
      <lay-container
        :fluid="true"
        style="padding: 10px; padding-top: 0px; position: relative"
      >
        <lay-form :model="formData" ref="layFormRef" required>
          <lay-card title="商品信息">
            <lay-row>
              <lay-col md="8">
                <lay-form-item label="条码" prop="barcode">
                  <lay-input
                    placeholder="请输入条码"
                    v-model="formData.barcode"
                  ></lay-input>
                </lay-form-item>
              </lay-col>
              <lay-col md="8">
                <lay-form-item label="名称" prop="name">
                  <lay-input
                    placeholder="请输入名称"
                    v-model="formData.name"
                  ></lay-input>
                </lay-form-item>
              </lay-col>
              <lay-col md="8">
                <lay-form-item label="描述" prop="description">
                  <lay-input
                    placeholder="请输入描述"
                    v-model="formData.description"
                  ></lay-input>
                </lay-form-item>
              </lay-col>
            </lay-row>
          </lay-card>
        

        <br />

        <lay-card title="物料列表">
          <lay-table :columns="columns" :dataSource="formData.items">
            <template #name="{ data,rowIndex }" >
              <lay-form-item  :prop="'items.'+rowIndex+'.material_id'" label="物料名称">
                <lay-select v-model="data.material_id"  :items="materialSourceData" :options="materialSourceData" :show-search="true"></lay-select>
              </lay-form-item>
            </template>
            <template #qty="{ data,rowIndex }">
              <lay-form-item :prop="'items.'+rowIndex+'.qty'" label="数量">
                <lay-input-number
                  v-model="data.qty"
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
        <!-- <lay-button @click="">重置</lay-button> -->
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, watch, reactive } from 'vue'
import { layer } from '@layui/layer-vue'
import { skuCreateOrUpdate,getSkuInfo } from '../../../api/module/sku'
import { getSelectList } from '../../../api/module/commone'
import router from '../../../router'

export default {
  name: 'Intricate',
  props: ['sku_id'],
  setup() {
    // 表格列
    const columns = [
      {
        title: '物料名称',
        key: 'name',
        customSlot: 'name'
      },
      {
        title: '数量',
        key: 'qty',
        ellipsisTooltip: true,
        customSlot: 'qty'
      },
      {
        title: '操作',
        width: '180px',
        key: 'operate',
        customSlot: 'operate',
        ellipsisTooltip: true
      }
    ]
    // 编辑表格
    const editHandle = (data: any) => {
      data.isEdit = true
    }

    // 保存表格编辑
    const saveTable = (data: any) => {
      data.isEdit = false
    }

    // 表格编辑的输入事件
    const changeData = (val: any, data: any, key: string) => {
      data[key] = val
    }

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
        qty: 1
      })
    }

    // 表单数据
    const formData = ref({
      id: '',
      name: '',
      barcode: '',
      description: '',
      items: [
      {
        id:'',
        material_id: '',
        rowIndex: "1",
        qty: 1
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
            skuCreateOrUpdate(formData.value).then(({code,msg}) => {
              if(code == 200){
                layer.msg(msg, { icon: 1, time: 2000 },function(){
                  router.push('/list/sku')
                  //location.reload()
                })
              }
            }).finally(() => {
              layer.close(id)
            })
            
            
          } 
        }
      )
    }

    const materialSourceData = ref([])
    return {
      saveTable,
      editHandle,
      columns,
      changeData,
      formData,
      submitForm,
      layFormRef,
      deleteHandler,
      addHandler,
      materialSourceData
    }
  },
  mounted(){
    getSelectList({type:"material"}).then(({data,code})=>{
      this.materialSourceData = data
    })
    if(this.sku_id != undefined){
      let id = layer.load(1)
      getSkuInfo(this.sku_id).then(({code,data}) => {
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
