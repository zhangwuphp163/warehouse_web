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
            </lay-table>
          </lay-card>
        </lay-col>
      </lay-row>
    </lay-container>
  </template>
  
  <script lang="ts">
  import { ref } from 'vue'
  import { layer } from '@layui/layer-vue'
  import { setting } from '../../api/module/base'
  import { useI18n } from '@layui/layui-vue'
  
  export default {
    setup() {
      const { t } = useI18n()
      const visible = ref(false)
      const page = {limit:10,current:1,total:0,showCount:true,showRefresh:true}
      const loading = ref(true)
      const dataSource = ref([])

      const columns = [
        {
          title: t('code'),
          key: 'code',
          align:"center"
        },
        {
          title: t('country_zh'),
          key: 'zh_name',
          align:"center"
        },
        {
          title: t('country_en'),
          key: 'en_name',
          align:"center"
        },
      ]

      const searchForm = {
        type:"country",
        pageInfo:page
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
  
      return {
        columns,
        change,
        visible,
        loading,
        page,
        dataSource,
        toSearch,
        searchForm
      }
    },
    mounted() {
        this.toSearch() 
    }
  }
  </script>
  