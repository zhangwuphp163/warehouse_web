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
            skin="row"
            :even="true"
            @change="change"
            size="md"
            :resize="false"
            @sort-change="sortChange"
          >
            <template v-slot:processing="{ data }">
              <lay-progress :percent="data.processing"  theme="orange" style="width: 100%;"  :show-text="true" :text="data.processing"></lay-progress>
            </template>
            <template v-slot:toolbar>
              <lay-button size="sm" type="primary" @click="createAsn">新增</lay-button>
            </template>
            <template v-slot:operator="{ data }">
              <lay-button size="xs" type="warm" @click="showRaw(data)">查看</lay-button>
              <lay-button size="xs" type="primary" v-if="data.status != 'finished'" @click="editRaw(data)">修改</lay-button>
              <lay-button size="xs" type="danger" v-if="false" @click="deleteRaw(data)">删除</lay-button>
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
import { asn,deleteById } from '../../../api/module/asn'
import router from '../../../router'



//export default new Vue({\  beforeMount() {\    document.title = this.$t('pageTitle');\  },\});\``
export default{
  beforeMount() {
      //document.title = t('hello')
  },
  setup() {
    const columns = [
      {
        sort:"DESC",
        title:"入库单号",
        key:"asn_number",
        align:"center",
        fixed:"left"
      },
      {
        sort:"DESC",
        title:"状态",
        key:"status",
        align:"center"
      },
      {
        title:"收货进度",
        key:"processing",
        customSlot: 'processing',
        align:"center"
      },
      {
        title:"备注",
        key:"remarks",
        align:"center"
      },
      {
        title:"入库时间",
        key:"inbound_at",
        align:"center"
      },
      {
        title:"确认时间",
        key:"confirmed_at",
        align:"center"
      },
      {
        title:"创建时间",
        key:"created_at",
        align:"center"
      },
      {
        title: '操作',
        width: '160px',
        customSlot: 'operator',
        align:"center",
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
      sort:'',
      sort_by:'desc',
      pageInfo:page
    }

    function createAsn(){
      router.push('/list/asn/create');
    }

    const editRaw = function(data: any){
      router.push('/list/asn/edit/'+data.id);
    }

    const showRaw = function(data: any){
      router.push('/list/asn/show/'+data.id+'/show');
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
                        asn(searchFormData).then(({data,code}) => {
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
      asn(searchFormData).then(({data,code,total}) => {
        loading.value = false
        dataSource.value = data
        searchFormData.pageInfo.total = total
      })
    }

    const change = function () {
      toSearch()
    }
    const sortChange = function(sort:any,sortBy:any){
      searchFormData.sort = sort
      searchFormData.sort_by = sortBy
      toSearch();
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
      createAsn,
      showRaw,
      change,
      sortChange
    }
  },
   mounted() {
    this.loading = true
    asn(this.searchFormData).then(({data,code,total}) => {
      this.loading = false
      this.dataSource = data
      this.searchFormData.pageInfo.total = total
    })
  },
  computed: {
    pageTitle() {
  
      return "ASN"
    },
  },
}
</script>