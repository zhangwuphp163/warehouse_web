<template>
  <lay-container style="margin: 10px">
    <lay-row space="10">
      <lay-col md="8">
        <lay-card>
          <lay-form :model="formData" ref="inboundFef" :pane="true">
            <lay-form-item label="入库单号" required>
              <lay-input v-model="formData.asn_number" autofocus ref="asn_number_ref" @keyup.enter="validatorForm('asn_number',$event)" ></lay-input>
            </lay-form-item>
            <lay-form-item label="物料条码" required>
              <lay-input v-model="formData.material_barcode" ref="material_barcode_ref" @keyup.enter="validatorForm('material_barcode',$event)"></lay-input>
            </lay-form-item>
            <lay-form-item label="数量" required>
              <lay-input-number v-model="formData.qty" ref="qty_ref" @keyup.enter="validatorForm('qty',$event)"></lay-input-number>
              <!-- <lay-switch v-model="is_auto_submit" onswitch-text="自动提交"  unswitch-text="是否自动提交"></lay-switch> -->
            </lay-form-item>
              
            <!-- <lay-form-item label="单价">
              <lay-input-number v-model="formData.actual_unit_price" :step="0.01"></lay-input-number>
            </lay-form-item> -->
            <lay-form-item>
                <lay-row :space="20">
                  <lay-col :md="12">
                    <lay-button
                      :fluid="true"
                      @click="submitClick"
                      type="primary"
                      >收货</lay-button
                    >
                  </lay-col>
                  <lay-col :md="12">
                    <lay-button :fluid="true" @click="submitClick"
                      >重置</lay-button
                    >
                  </lay-col>
                </lay-row>
              </lay-form-item>
          </lay-form>
        </lay-card>
        
      </lay-col>
      <lay-col md="16">
        <lay-table :columns="columns" :dataSource="dataSource"  :default-toolbar="false">
          <tr><td>11</td></tr>
          <template v-slot:actual_qty="{ data }">
            <span style="color:#f00">{{ data.actual_qty }}</span>
          </template>
        </lay-table>
      </lay-col>

    </lay-row>
  </lay-container>
</template>

<script lang="ts">
import { ref } from 'vue'
import { layer } from '@layui/layer-vue'
import { inbound,getItems } from '../../api/module/asn'

export default {
  setup() {
    const asn_number_ref = ref()
    const qty_ref = ref()
    const material_barcode_ref = ref()
    const formData = ref({
      asn_number:'',
      material_barcode:'',
      qty:1,
      //actual_unit_price:0.00
    })
    const is_auto_submit = ref(false)
    const dataSource = ref([])
    function validatorForm(type: any,event:any){
      if(event.code == "NumpadEnter"){
        if(type == 'asn_number'){
          let layerId = layer.load(1)
          getItems(formData.value.asn_number).then(({data,code,msg}) => {
            if(code == 200){
              dataSource.value = data
              layer.msg(msg,{icon:1,time:2000})
              formData.value.material_barcode = ""
              material_barcode_ref.value.focus()
            }else{
              layer.msg(msg,{icon:2,time:2000})
              reset()
            }
          }).finally(() => {
            layer.close(layerId)
          })
          return false;
        }
        setInputFocus();
      }
    }

    function reset(){
      formData.value = {
        asn_number:'',
        material_barcode:'',
        qty:1,
        actual_unit_price:0.00
      }
      asn_number_ref.value.focus()
      dataSource.value = []
    }

    function setInputFocus(){
      if(formData.value.asn_number == ''){
        asn_number_ref.value.focus()
        return false
      }

      if(formData.value.material_barcode == ''){
        material_barcode_ref.value.focus()
        return false

      }
      if(formData.value.qty <= 0){
        qty_ref.value.focus()
        return false
      }
      inboundPost()
    }
    function submitClick(){
      let flag = setInputFocus();
      if(flag){
        inboundPost()
      }
    }

    function inboundPost(){
      let layerId = layer.load(1)
        inbound(formData.value).then(({code,msg,data}) => {
          if(code == 200){
            dataSource.value = data
            layer.msg(msg,{icon:1,time:2000});
          }else{
            layer.msg(msg,{icon:2,time:2000})
          }
        }).finally(() => {
          formData.value.material_barcode = ''
          material_barcode_ref.value.focus()
          layer.close(layerId)
        });
    }
    const columns = [
      {
        title:"已收数量",
        key:"actual_qty",
        customSlot:"actual_qty",
        align:"center"
      },
      {
        title:"计划数量",
        key:"plan_qty",
        align:"center"
      },
      {
        title:"供应商",
        key:"supplier",
        align:"center"
      },
      {
        title:"物料条码",
        key:"material_barcode",
        align:"center"
      },
      {
        title:"物料名称",
        key:"material_name",
        align:"center"
      }
      
    ]
    

    return {
      formData,
      validatorForm,
      asn_number_ref,
      qty_ref,
      material_barcode_ref,
      submitClick,
      columns,
      dataSource,
      reset,
      is_auto_submit,
      inboundPost
    }
  },
  mounted(){

  }
    
}
</script>