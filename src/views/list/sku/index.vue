<template>
  <lay-container fluid="true" style="padding: 10px">
    <lay-row :space="10">
      <lay-col :md="24">
        <lay-card>
          <lay-form style="margin-top: 20px">
            <lay-row>
              <lay-col :md="6">
                <lay-form-item label="条码：" label-width="50">
                  <lay-input
                    v-model="searchForm.barcode"
                    style="width: 90%"
                  ></lay-input>
                </lay-form-item>
              </lay-col>
              <lay-col :md="6">
                <lay-form-item label="名称：" label-width="50">
                  <lay-input
                    v-model="searchForm.name"
                    style="width: 90%"
                  ></lay-input>
                </lay-form-item>
              </lay-col>
              <lay-col :md="6">
                <lay-form-item label-width="0">
                  <lay-button type="primary" @click="toSearch">查询</lay-button>
                  <lay-button @click="toReset">重置</lay-button>
                </lay-form-item>
              </lay-col>
            </lay-row>
          </lay-form>
        </lay-card>
      </lay-col>
      <lay-col :md="24">
        <lay-card>
          <lay-table
            :page="page"
            :columns="columns"
            :dataSource="dataSource"
            :default-toolbar="defaultToolbar"
            v-model:selectedKeys="selectedKeys"
            :loading="loading"
          >
        
            <template v-slot:toolbar>
              <lay-button size="sm" type="primary" @click="createSku">新增</lay-button>
              <!-- <lay-button size="sm" @click="batchDelete" class="d-none">批量删除</lay-button> -->
            </template>
            <template v-slot:operator="{ data }">
              <lay-button size="xs" type="primary" @click="editRaw(data)">修改</lay-button>
              <lay-button size="xs" @click="deleteRaw(data)">删除</lay-button>
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
import { sku,deleteById } from '../../../api/module/sku'
import router from '../../../router'

export default {
  setup() {
    const selectedKeys = ref([])
    const checkbox = ref(false)
    const defaultToolbar = ref(true)
    const page = {limit:10,current:1,total:0,showCount:true,showRefresh:true}
    const loading = ref(false)
    const dataSource = ref([])
    const searchForm = {
      barcode: '',
      name: '',
      pageInfo: page
    }

    const columns = [
      {
        title: '复选',
        width: '30px',
        type: 'checkbox',
        fixed: 'left'
      },
      {
        title:"条码",
        width:"200px",
        key:"barcode"
      },
      {
        title:"名称",
        width: "180px",
        key:"name"
      },
      {
        title:"描述",
        width: "400px",
        key:"description",
        ellipsisTooltip: true,
      },
      {
        title: '创建时间',
        width: '180px',
        key: 'created_at'
      },
      {
        title: '操作',
        width: '180px',
        customSlot: 'operator',
        key: 'operator',
        fixed: 'right'
      }
    ]

    const model = {}

    const editRaw = function(data: any){
      router.push('/list/sku/edit/'+data.id);
    }

    function createSku(){
      router.push('/list/sku/create');
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
                        sku(searchForm).then(({data,code,total}) => {
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

    function toReset() {
      searchForm.barcode = ''
      searchForm.name = ''
    }

    function toSearch(){
      loading.value = true
      page.current = 1
      page.total = 0
      sku(searchForm).then(({data,code,total}) => {
        loading.value = false
        dataSource.value = data
        page.total = total
      })
    }

    return {
      columns,
      dataSource,
      selectedKeys,
      checkbox,
      defaultToolbar,
      page,
      loading,
      searchForm,
      toReset,
      toSearch,
      model,
      deleteRaw,
      editRaw,
      createSku
    }
  },
  mounted(){
    this.loading = true
    sku(this.searchForm).then(({data,code,total}) => {
      this.loading = false
      this.dataSource = data
      this.page.total = total
    })
  }
}
</script>