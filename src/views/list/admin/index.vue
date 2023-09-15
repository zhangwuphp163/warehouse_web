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
                <lay-button size="sm" type="primary" @click="createUser">新增</lay-button>
              </template>
  
              <!-- <template v-slot:barcode="{ data }">
                {{ data.barcode }}
              </template>
              <template v-slot:name="{ data }">
                {{ data.name }}
              </template> -->
              <template v-slot:operator="{ data }">
                <lay-button size="xs" type="primary" @click="editRaw(data)">修改</lay-button>
                <!-- <lay-button size="xs" @click="deleteRaw(data)">删除</lay-button> -->
              </template>
              <template v-slot:footer>
                <lay-layer v-model="visible" :shade="false" :area="['500px', '450px']" :btn="action" :title="operationType">
                  <div style="padding: 20px;">
                    <lay-form :model="model">
                      <lay-form-item label="登录账号" prop="username" required >
                        <lay-input v-model="model.username"></lay-input>
                      </lay-form-item>
                      <lay-form-item label="姓名" prop="name" required>
                        <lay-input v-model="model.name"></lay-input>
                      </lay-form-item>
                      <lay-form-item label="密码" prop="password">
                        <lay-input v-model="model.password"></lay-input>
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
  import { user,createOrUpdate,deleteById } from '../../../api/module/user'
  
  export default {
    setup() {
      const visible = ref(false)
      const page = {limit:10,current:1,total:0,showCount:true,showRefresh:true}
      const loading = ref(true)
      const dataSource = ref([])
      const operation = ref("create")
      const operationType = ref("新增")

      const columns = [
        {
          title: '登录账号',
          key: 'username'
        },
        {
          title: '姓名',
          key: 'name'
        },
        {
          title: '密钥',
          key: 'api_token'
        },
        {
          title: '密钥过期时间',
          key: 'validity_at'
        },
        {
          title: '创建时间',
          key: 'created_at'
        },
        {
          title: '更新时间',
          key: 'updated_at'
        },
        {
          title: '操作',
          width: '180px',
          customSlot: 'operator',
          key: 'operator',
          fixed: 'right'
        }
      ]
      const searchForm = {
        barcode: '',
        name: '',
        pageInfo:page
      }
  
      const model = {
        id:'',
        username: '',
        name: '',
        password:'',
        unit_price:0.00
      }
  
      function createUser(){
        model.username = ''
        model.name = ''
        model.password = ''
        model.id = ''
        operation.value = "create"
        operationType.value = "新增"
        visible.value = true
      }
      
      const editRaw = function(data: any){
        model.username = data.username
        model.name = data.name
        model.password = ''
        model.id = data.id
        operation.value = "edit"
        operationType.value = "编辑"
        visible.value = true
        
      }
  
      const deleteRaw = function(data: any){
        console.log(data)
        layer.confirm("确认删除？",{
              title:'删除',
              btn: [
                  {
                    text:'确定', callback: (id:any) => {
                      let loadId = layer.load(0)
                      deleteById(data.id).then(({code,msg}) => {
                        if(code == 200){
                          layer.msg(msg,{icon:1})
                          loading.value = true
                          user(searchForm).then(({data,code,total}) => {
                            loading.value = false
                            dataSource.value = data
                            page.total = total
                          })
                        }else{
                          layer.msg(msg,{icon:2})
                        }
                      }).finally(() => {
                        layer.close(loadId)
                        layer.close(id)
                      })
                    }
                  },
                  {
                    text:'取消', callback: (id:any) => { 
                      layer.close(id); 
                    }
                  }
                ]
              }
              
          );
      
      }
  
      const change = function ({ current, limit }: any) {
        page.current = current
        page.limit = limit
        loading.value = true
        user(searchForm).then(({data,code,total}) => {
          loading.value = false
          dataSource.value = data
          page.total = total
        })
      }
  
      function toSearch(){
        loading.value = true
        page.current = 1
        page.total = 0
        user(searchForm).then(({data,code,total}) => {
          loading.value = false
          dataSource.value = data
          page.total = total
        })
      }
  
      const action = ref([
      {
          text: "确认",
          callback: () => {
            let loadId = layer.load(0)
            createOrUpdate(model).then(({code,msg}) => {
            
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
          text: "取消",
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
        deleteRaw,
        model,
        action,
        visible,
        loading,
        page,
        dataSource,
        createUser,
        operation,
        operationType,
        toSearch
      }
    },
    mounted() {
        this.toSearch() 
    }
  }
  </script>
  