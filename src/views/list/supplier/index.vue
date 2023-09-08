<template>
  <lay-container fluid="true" style="padding: 10px">
    <lay-row :space="10">
      <lay-col :md="24">
        <lay-card>
          <lay-table
            :columns="columns"
            :dataSource="dataSource"
            :loading="loading"
          >
            <template v-slot:toolbar>
              <lay-button size="sm" type="primary" @click="createSupplier">新增</lay-button>
            </template>
            <template v-slot:operator="{ data }">
              <lay-button size="xs" type="primary" @click="editSupplier(data)">修改</lay-button>
              <lay-button size="xs" @click="deleteRaw(data)">删除</lay-button>
            </template>
            <template v-slot:footer>
              <lay-layer v-model="visible" :shade="false" :area="['500px', '450px']" :btn="action">
                <div style="padding: 20px;">
                  <lay-form :model="model">
                    <lay-form-item label="名称" prop="name" required>
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
import { createOrUpdate,supplier,deleteById } from '../../../api/module/supplier'


export default{
  setup() {
    const columns = [
      {
        title:"名称",
        width:"200px",
        key:"name"
      },
      {
        title:"创建时间",
        width:"200px",
        key:"created_at"
      },
      {
        title: '操作',
        width: '180px',
        customSlot: 'operator',
        key: 'operator',
        fixed: 'right'
      }
    ]
    const dataSource = ref([])
    const loading = ref(false)
    const visible = ref(false)
    const model = {
      id:'',
      name:''
    }
    const editSupplier = function(data: any){
      model.id = data.id
      model.name = data.name
      visible.value = true
    }
    const deleteRaw = function(data: any){
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
                        supplier({}).then(({data,code}) => {
                          loading.value = false
                          dataSource.value = data
                        })
                      }else{
                        console.log(msg)
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
    const action = ref([
    {
        text: "确认",
        callback: () => {
          let loadId = layer.load(0)
          createOrUpdate(model).then(({code,msg}) => {
          
            if(code == 200){
              layer.msg(msg,{ icon: 1 })
              visible.value = false
              if(model.id == ''){
                toSearch()
              }
            }else{
              layer.msg(msg,{ icon: 2,time:2000})
            }
          }).finally(() => {
            layer.close(loadId)
          })
        }
      }
    ])

    function toSearch(){
      loading.value = true
      supplier({}).then(({data,code}) => {
        loading.value = false
        dataSource.value = data
      })
    }

    function createSupplier(){
      model.id = ''
      model.name = ''
      visible.value = true
    }

    return {
      columns,
      dataSource,
      loading,
      deleteRaw,
      editSupplier,
      visible,
      model,
      toSearch,
      createSupplier,
      action
    }
  },
   mounted() {
    this.loading = true
    supplier({}).then(({data,code}) => {
        this.loading = false
        this.dataSource = data
      })
      
  },
}
</script>