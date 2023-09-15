<template>
  <template v-for="(menu, index) in menus" :key="index">
    <lay-menu-item :id="menu.id">
      <template #icon>
        <lay-icon :type="menu.icon"></lay-icon>
      </template>
      <template #title>{{ t(menu.title) }}</template>
    </lay-menu-item>
  </template>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useI18n } from '@layui/layui-vue'

export default defineComponent({
  name: "GlobalMainMenuItem",
  props: {
    menus: {
      type: Object,
    },
  },setup(){
    const { t } = useI18n()
    return {
      t
    }
  }
});
</script>
