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
          >
            <template v-slot:toolbar>
              <lay-button size="sm" type="primary" @click="createAsn">新增</lay-button>
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
import { order,deleteById } from '../../../api/module/order'
import router from '../../../router'

export default{
  setup() {
    const columns = [
      {
        title:"订单号",
        width:"200px",
        key:"order_number"
      },
      {
        title:"状态",
        width:"200px",
        key:"status"
      },
      {
        title:"备注",
        width:"200px",
        key:"remarks"
      },
      {
        title:"运费",
        width:"200px",
        key:"freight"
      },
      {
        title:"加工费用",
        width:"200px",
        key:"process_cost"
      },
      {
        title:"加工时间",
        width:"200px",
        key:"process_time"
      },
      {
        title:"分配时间",
        width:"200px",
        key:"allocate_at"
      },
      {
        title:"出库时间",
        width:"200px",
        key:"outbound_at"
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
    const page = {limit:10,current:1,total:0,showCount:true,showRefresh:true}

    const searchFormData = {
      asn_number:'',
      pageInfo:page
    }

    function createAsn(){
      router.push('/list/order/create');
    }

    const editRaw = function(data: any){
      router.push('/list/order/edit/'+data.id);
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
                        order(searchFormData).then(({data,code}) => {
                          loading.value = false
                          dataSource.value = data
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
    
    function toSearch(){
      loading.value = true
      order(searchFormData).then(({data,code,total}) => {
        loading.value = false
        dataSource.value = data
        searchFormData.pageInfo.total = total
      })
    }

    return {
      columns,
      dataSource,
      loading,
      deleteRaw,
      visible,
      toSearch,
      page,
      searchFormData,
      editRaw,
      createAsn
    }
  },
   mounted() {
    this.loading = true
    order(this.searchFormData).then(({data,code,total}) => {
      this.loading = false
      this.dataSource = data
      this.searchFormData.pageInfo.total = total
    })
  },
}
</script>