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
            >
          
              <template v-slot:toolbar>
                <lay-button size="sm" type="primary" @click="createWarehouse">{{ t('create') }}</lay-button>
              </template>

              <template v-slot:operator="{ data }">
                <lay-button size="xs" type="primary" @click="editRaw(data)">{{ t('edit') }}</lay-button>
              </template>
              <template v-slot:footer>
                <lay-layer v-model="visible" :shade="false" :area="['500px', '250px']" :btn="action" :title="operationType">
                  <div style="padding: 20px;">
                    <lay-form :model="model">
                      <lay-form-item :label="t('code')" prop="code" required >
                        <lay-input v-model="model.code"></lay-input>
                      </lay-form-item>
                      <lay-form-item :label="t('name')" prop="name" required>
                        <lay-input v-model="model.name"></lay-input>
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
  import { ref } from 'vue'
  import { layer } from '@layui/layer-vue'
  import { setting,createOrUpdate } from '../../api/module/base'
  import { useI18n } from '@layui/layui-vue'
  export default {
    setup() {
      const { t } = useI18n()
      const visible = ref(false)
      const page = {limit:10,current:1,total:0,showCount:true,showRefresh:true}
      const loading = ref(true)
      const dataSource = ref([])
      const operation = ref("create")
      const operationType = ref(t('create'))

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
          title: t('operation'),
          width: '180px',
          customSlot: 'operator',
          key: 'operator',
          fixed: 'right',
          align:"center"
        }
      ]
      const searchForm = {
        type: 'warehouse',
        pageInfo:page
      }
  
      const model = {
        id:'',
        code: '',
        name: '',
      }
  
      function createWarehouse(){
        model.code = ''
        model.name = ''
        operation.value = "create"
        operationType.value = t('create')
        visible.value = true
      }
      
      const editRaw = function(data: any){
        model.code = data.code
        model.name = data.name
        model.id = data.id
        operation.value = "edit"
        operationType.value = t('edit')
        visible.value = true
        
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
            let loadId = layer.load(0)
            createOrUpdate('warehouse',model).then(({code,msg}) => {
            
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
        model,
        action,
        visible,
        loading,
        page,
        dataSource,
        createWarehouse,
        operation,
        operationType,
        toSearch,
        t
      }
    },
    mounted() {
        this.toSearch() 
    }
  }
  </script>
  