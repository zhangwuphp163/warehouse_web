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
            @row="rowClick"
            @change="change"
          >
        
            <template v-slot:toolbar>
              <lay-button size="sm" type="primary" @click="createMaterial">新增</lay-button>
              <lay-button size="sm" @click="batchDelete" class="d-none">批量删除</lay-button>
            </template>

            <!-- <template v-slot:barcode="{ data }">
              {{ data.barcode }}
            </template>
            <template v-slot:name="{ data }">
              {{ data.name }}
            </template> -->
            <template v-slot:operator="{ data }">
              <lay-button size="xs" type="primary" @click="showDetail(data)">查看</lay-button>
              <lay-button size="xs" type="primary" @click="editRaw(data)">修改</lay-button>
              <lay-button size="xs" @click="deleteRaw(data)">删除</lay-button>
            </template>
            <template v-slot:footer>
              <lay-layer v-model="visible" :shade="false" :area="['500px', '450px']" :btn="action" :title="operationType">
                <div style="padding: 20px;">
                  <lay-form :model="model">
                    <lay-form-item label="条码" prop="barcode" required >
                      <lay-input v-model="model.barcode"></lay-input>
                    </lay-form-item>
                    <lay-form-item label="名称" prop="name" required>
                      <lay-input v-model="model.name"></lay-input>
                    </lay-form-item>
                    <lay-form-item label="描述" prop="description" required>
                      <lay-input v-model="model.description"></lay-input>
                    </lay-form-item>
                    <lay-form-item label="单价" prop="unit_price">
                      <lay-input v-model="model.unit_price"></lay-input>
                    </lay-form-item>
                  </lay-form>
                </div>
              </lay-layer>
              <lay-layer v-model="showVisible"  :area="['500px', '450px']">
                <div style="padding: 20px;">
                  <DetailPage  :details="detailModel"/>
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
import { material,createOrUpdate,deleteById } from '../../../api/module/material'
import DetailPage from '../debug/page.vue';

export default {
  components:{
    DetailPage
  },
  setup() {
    const selectedKeys = ref([])
    const checkbox = ref(false)
    const defaultToolbar = ref(true)
    const visible = ref(false)
    const page = {limit:10,current:1,total:0,showCount:true,showRefresh:true}
    const loading = ref(true)
    const dataSource = ref([])
    const operation = ref("create")
    const operationType = ref("新增")
    const showVisible = ref(false)
    const detailModel = [
      {
        label:'id',
        required:true,
        is_show:true,
        value:''
      }
    ]

    const columns = [
      {
        title: '复选',
        width: '30px',
        type: 'checkbox',
        fixed: 'left'
      },
      {
        title: '条码',
        width: '200px',
        //customSlot: 'barcode',
        key: 'barcode'
      },
      {
        title: '名称',
        width: '180px',
        //customSlot: 'name',
        key: 'name'
      },
      {
        title: '描述',
        width: '180px',
        key: 'description'
      },
      {
        title: '单价',
        width: '180px',
        key: 'unit_price'
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
    const searchForm = {
      barcode: '',
      name: '',
      pageInfo:page
    }

    const model = {
      id:'',
      barcode: '',
      name: '',
      description:'',
      unit_price:0.00
    }

    function createMaterial(){
      model.barcode = ''
      model.name = ''
      model.description = ''
      model.id = ''
      model.unit_price = 0.00
      operation.value = "create"
      operationType.value = "新增"
      visible.value = true
    }
    
    const editRaw = function(data: any){
      model.barcode = data.barcode
      model.name = data.name
      model.description = data.description
      model.id = data.id
      operation.value = "edit"
      model.unit_price = data.unit_price
      operationType.value = "编辑"
      visible.value = true
    }

    const showDetail = function(data: any){
      for (let index = 0; index < data.length; index++) {
        const element = detailModel[index];
        
      }
      operationType.value = "编辑"
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
                        material(searchForm).then(({data,code,total}) => {
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

    const rowClick = function (data: any) {
      //console.log(data)
    }

    const rowDoubleClick = function (data: any) {
      //console.log(data)
    }

    const change = function ({ current, limit }: any) {
      page.current = current
      page.limit = limit
      loading.value = true
      material(searchForm).then(({data,code,total}) => {
        loading.value = false
        dataSource.value = data
        page.total = total
      })
      //layer.msg('current:' + current + ' limit:' + limit)
    }

    function toReset() {
      searchForm.barcode = ''
      searchForm.name = ''
    }

    function toSearch(){
      loading.value = true
      page.current = 1
      page.total = 0
      material(searchForm).then(({data,code,total}) => {
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
              if(model.id == ''){
                toSearch()
              }
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
            //layer.confirm("取消操作", { visible:false });
        }
    }
    ])
    
    return {
      columns,
      selectedKeys,
      checkbox,
      defaultToolbar,
      rowClick,
      rowDoubleClick,
      change,
      toReset,
      searchForm,
      editRaw,
      deleteRaw,
      model,
      action,
      visible,
      loading,
      page,
      dataSource,
      createMaterial,
      operation,
      operationType,
      toSearch,
      detailModel,
      showVisible,
      showDetail
    }
  },
  mounted() {
    this.loading = true
    material(this.searchForm).then(({data,code,total}) => {
        this.loading = false
        this.dataSource = data
        this.page.total = total
        //console.log(res);
      })
      
  },
  methods: {
    // toSearch(){
    //   this.loading = true
    //   material(this.searchForm).then(({data,code,page}) => {
    //     this.loading = false
    //     this.dataSource = data
    //     this.page = page
    //     //console.log(res);
    //   })
    // },
    // changeVisible(){
    //   console.log('debug')
    //   this.visible = ref(true)
    // } ,
    batchDelete(){
      console.log(this.selectedKeys)
    },
    updateItem(index:any, value:any) {

    }
  }
}
</script>
