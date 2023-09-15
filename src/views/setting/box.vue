<template>
    <lay-container fluid="true" style="padding: 10px">
      <lay-row :space="10">
        <lay-col :md="24">
          <lay-card>
            <lay-table
              :page="page"
              :columns="columns"
              :dataSource="dataSource"
              :loading="loading"
              :ellipsisTooltip="true"
              :even="true"
              :resize="true"
              @change="change"
              locale="en_US"
            >
          
              <template v-slot:toolbar>
                <lay-button size="sm" type="primary" @click="createBox">{{ t('create') }}</lay-button>
              </template>

              <template v-slot:operator="{ data }">
                <lay-button size="xs" type="primary" @click="editRaw(data)">{{ t('edit') }}</lay-button>
              </template>
              <template v-slot:footer>
                <lay-layer v-model="visible" :shade="false" :btn="action" :title="operationType" anim="1" :area="['450px','500px']">
                  <div style="padding: 20px;">
                    <lay-form :model="formData" ref="layFormRef" required>
                      <lay-form-item :label="t('code')" prop="code" required >
                        <lay-input v-model="formData.code"></lay-input>
                      </lay-form-item>
                      <lay-form-item :label="t('name')" prop="name" required>
                        <lay-input v-model="formData.name"></lay-input>
                      </lay-form-item>
                      <lay-form-item :label="t('warehouse')" prop="warehouse_id" required>
                          <lay-select v-model="formData.warehouse_id" :items="warehouseDataSource" :options="warehouseDataSource" @change="setSelectValue($event,'warehouse')" :allow-clear="true"></lay-select>
                      </lay-form-item>
                      <lay-form-item :label="t('client')">
                        <lay-select v-model="formData.client_id" :items="warehouseDataSource" :options="warehouseDataSource" :show-search="true" @change="setSelectValue($event,'client')"></lay-select>
                      </lay-form-item> 
                      <lay-form-item :label="t('is_active')">
                        <lay-switch v-model="formData.is_active" :onswitch-text="t('enable')"  :unswitch-text="t('disable')"></lay-switch>
                      </lay-form-item>
                      <lay-form-item :label="t('weight')">
                        <lay-input-number :step="1" :min="0" v-model="formData.weight"></lay-input-number>
                      </lay-form-item>
                      <lay-form-item :label="t('length')">
                        <lay-input-number :step="0.1" :min="0.0" v-model="formData.length"></lay-input-number>
                      </lay-form-item>
                      <lay-form-item :label="t('width')">
                        <lay-input-number :step="0.1" :min="0.0" v-model="formData.width"></lay-input-number>
                      </lay-form-item>
                      <lay-form-item :label="t('height')">
                        <lay-input-number :step="0.1" :min="0.0" v-model="formData.height"></lay-input-number>
                      </lay-form-item>
                    </lay-form>
                  </div>
                </lay-layer>
              </template>
            </lay-table>
          </lay-card>
        </lay-col>
      </lay-row>
    </lay-container>
  </template>
  
  <script lang="ts">
  import { compile, ref } from 'vue'
  import { layer } from '@layui/layer-vue'
  import { setting,createOrUpdate } from '../../api/module/base'
  import { getSelectList } from '../../api/module/common'
  import { useI18n } from "@layui/layui-vue"
  export default {

    setup() {
      const { t } = useI18n()
      const visible = ref(false)
      const page = {limit:10,current:1,total:0,showCount:true,showRefresh:true}
      const loading = ref(true)
      const dataSource = ref([])
      const operation = ref("create")
      const operationType = ref(t('create'))
      const clientDataSource = ref([])
      const warehouseDataSource = ref([])
      
      const columns = [
        {
          title: t('code'),
          key: 'code',
          align:"center"
        },
        {
          title: t('name'),
          key: 'name',
          align:"center"
        },
        {
          title: t('warehouse'),
          key: 'warehouse_name',
          align:"center"
        },
        {
          title: t('client'),
          key: 'warehouse.name',
          align:"center"
        },
        {
          title: t('is_active'),
          key: 'is_active',
          align:"center"
        },
        {
          title: t('length'),
          key: 'length',
          align:"center"
        },
        {
          title: t('width'),
          key: 'width',
          align:"center"
        },
        {
          title: t('height'),
          key: 'height',
          align:"center"
        },
        {
          title: t('weight'),
          key: 'weight',
          align:"center"
        },
        {
          title: t('operation'),
          width: '180px',
          customSlot: 'operator',
          key: 'operator',
          fixed: 'right',
          align:"center"
        }
      ]
      const searchForm = {
        type: 'box',
        pageInfo:page
      }

      const baseFormData = {
        id:'',
        code: '',
        name: '',
        client_id: '',
        warehouse_id:'',
        weight:0.000,
        length:0.00,
        width:0.00,
        height:0.00,
        is_active:true
      }
  
      const formData = ref(Object.assign({},baseFormData))
  
      function createBox(){
        formData.value = Object.assign({},baseFormData)
        operation.value = "create"
        operationType.value = t('create')
        visible.value = true
      }
      
      const editRaw = function(data: any){
        formData.value = data
        formData.value.is_active = data.is_active?true:false
        operation.value = "edit"
        operationType.value = t('edit')
        visible.value = true
        
      }

      function setSelectValue(value:any,type: string){
        if(type == 'warehouse'){
          formData.value.warehouse_id = ref(value)
        }else if(type == 'client'){
          formData.value.client_id = ref(value)
        }
      }
  
      const change = function ({ current, limit }: any) {
        page.current = current
        page.limit = limit
        loading.value = true
        setting(searchForm).then(({data,code,total}) => {
          loading.value = false
          dataSource.value = data
          page.total = total
        })
      }
  
      function toSearch(){
        loading.value = true
        page.current = 1
        page.total = 0
        setting(searchForm).then(({data,code,total}) => {
          loading.value = false
          dataSource.value = data
          page.total = total
        })
      }
      
      const action = ref([
      {
          text: t('confirm'),
          callback: () => {
            if(formData.value.warehouse_id == ''){
              layer.msg('仓库必须的',{time:2000,icon:2})
              return false
            }
            if(formData.value.code == ''){
              layer.msg('箱子代码的',{time:2000,icon:2})
              return false
            }
            if(formData.value.name == ''){
              layer.msg('箱子名称必须的',{time:2000,icon:2})
              return false
            }
            let loadId = layer.load(0)
            createOrUpdate('box',formData.value).then(({code,msg}) => {
              if(code == 200){
                layer.msg(msg,{ icon: 1 })
                visible.value = false
                toSearch()
              }else{
                layer.msg(msg,{ icon: 2 })
              }
            }).finally(() => {
              layer.close(loadId)
            })
          }
      },
      {
          text: t('cancel'),
          callback: () => {
            visible.value = false
          }
      }
      ])
      
      return {
        columns,
        change,
        searchForm,
        editRaw,
        //deleteRaw,
        formData,
        action,
        visible,
        loading,
        page,
        dataSource,
        clientDataSource,
        warehouseDataSource,
        createBox,
        operation,
        operationType,
        toSearch,
        setSelectValue,
        t
      }
    },
    mounted() {
        this.toSearch()
        getSelectList({ type:"warehouse" }).then(({data,code})=>{
          this.warehouseDataSource = data
        })
    }
  }
  </script>