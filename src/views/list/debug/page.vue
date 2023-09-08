<template>
  <lay-form :model="details">
        <lay-form-item v-for="detail in details" :key="detail.id" :label="detail.label">
          <lay-input :model-value="detail.value"></lay-input>
        </lay-form-item>
      </lay-form>
</template>
<script lang="ts">
export default {
  props: {
    details:{
      type: Object,
      required: true
    }
  }
}
</script>