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
            >
              <template v-slot:toolbar>
                <lay-button size="sm" type="primary" @click="createBox">{{ t('create') }}</lay-button>
              </template>
          
              <template v-slot:operator="{ data }">
                <lay-button size="xs" type="primary" @click="editRaw(data)">{{ t('edit') }}</lay-button>
              </template>
              <template v-slot:footer>
                <lay-layer v-model="visible" :shade="false" :btn="action" :title="operationType" anim="1" :area="['800px','600px']" >
                  <div style="padding: 20px;">
                    <lay-form :model="formData" ref="layFormRef" v-for="(item, index) in formData" :key="index" :pane="true">
                      <lay-form-item :label="t(index)" :label-width="180">
                        <lay-input  :name="index"></lay-input>
                      </lay-form-item>
                    </lay-form>
                    <!-- <lay-form :model="formData" :pane="true">
                      <lay-form-item :label="formData.code" :label-width="180">
                        <lay-input  v-model="formData.code"></lay-input>
                      </lay-form-item>
                    </lay-form> -->
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
  import { getTableHeaders } from '../../api/module/common'
  import { useI18n } from "@layui/layui-vue"
  export default {

    setup() {
      const { t } = useI18n()
      const visible = ref(false)
      const page = {limit:10,current:1,total:0,showCount:true,showRefresh:true}
      const dataSource = ref([])
      const loading = ref(true)

      const baseFormData = {
        id:"",
        code:"",
        company_name:"",
        shipper_name:"",
        shipper_company:"",
        shipper_phone:"",
        shipper_address:"",
        shipper_country:"",
        shipper_province:"",
        shipper_city:"",
        shipper_postal_code:"",
        shipper_email:"",
        shipper_tax_number_type:"",
        shipper_tax_number:"",
        shipper_id_card_number_type:"",
        shipper_id_card_number:"",
        ioss_number:"",
        ioss_issuer_country_code:""
      }
      const columns = [
        {
          title: t('code'),
          key: 'code',
          width: '200px',
          align:"center"
        },
        {
          title: t('company_name'),
          key: 'company_name',
          width: '200px',
          align:"center"
        },
        {
          title: t('shipper_name'),
          key: 'shipper_name',
          width: '200px',
          align:"center"
        },
        {
          title: t('shipper_company'),
          key: 'shipper_company',
          width: '200px',
          align:"center"
        },
        {
          title: t('shipper_phone'),
          key: 'shipper_phone',
          width: '200px',
          align:"center"
        },
        {
          title: t('shipper_address'),
          key: 'shipper_address',
          width: '200px',
          align:"center"
        },
        {
          title: t('shipper_country'),
          key: 'shipper_country',
          width: '200px',
          align:"center"
        },
        {
          title: t('shipper_province'),
          key: 'shipper_province',
          width: '200px',
          align:"center"
        },
        {
          title: t('shipper_city'),
          key: 'shipper_city',
          width: '200px',
          align:"center"
        },
        {
          title: t('shipper_postal_code'),
          key: 'shipper_postal_code',
          width: '200px',
          align:"center"
        },
        {
          title: t('shipper_email'),
          key: 'shipper_email',
          width: '200px',
          align:"center"
        },
        {
          title: t('shipper_tax_number_type'),
          key: 'shipper_tax_number_type',
          width: '200px',
          align:"center"
        },
        {
          title: t('shipper_tax_number'),
          key: 'shipper_tax_number',
          width: '200px',
          align:"center"
        },
        {
          title: t('shipper_id_card_number_type'),
          key: 'shipper_id_card_number_type',
          width: '200px',
          align:"center"
        },
        {
          title: t('shipper_id_card_number'),
          key: 'shipper_id_card_number',
          width: '200px',
          align:"center"
        },
        {
          title: t('ioss_number'),
          key: 'ioss_number',
          width: '200px',
          align:"center"
        },
        {
          title: t('ioss_issuer_country_code'),
          key: 'ioss_issuer_country_code',
          width: '200px',
          align:"center"
        },
        {
          title: t('operation'),
          width: '90px',
          customSlot: 'operator',
          key: 'operator',
          fixed: 'right',
          align:"center"
        }
      ]
      const searchForm = {
        type: 'client',
        pageInfo:page
      }

      const formData = ref({})
      function createBox(){
        formData.value = Object.assign({},baseFormData)
        visible.value = true
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
      
      const editRaw = function(data: any){
        visible.value = true
        this.formData = data 
      }
      const layFormRef = ref()
      const action = ref([
      {
          text: t('confirm'),
          callback: () => {
            this.layFormRef.value.validate(
          (isValidate: boolean, model: any, errors: any) => {
            console.log(model)
          }
      )
            // let loadId = layer.load(0)
            // createOrUpdate('warehouse',model).then(({code,msg}) => {
            
            //   if(code == 200){
            //     layer.msg(msg,{ icon: 1 })
            //     visible.value = false
            //     toSearch()
            //   }else{
            //     layer.msg(msg,{ icon: 2 })
            //   }
            // }).finally(() => {
            //   layer.close(loadId)
            // })
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
        loading,
        columns,
        visible,
        page,
        dataSource,
        toSearch,
        searchForm,
        createBox,
        formData,
        t,
        editRaw,
        action,
        layFormRef
      }
    },
    mounted() {
      this.toSearch()
        // getTableHeaders("client",{}).then(({data,code})=>{
        //   this.columns = data
          
        // })
    }
  }
  </script>