<template>
  <div class="login-wrap">
    <div class="login-root">
      <div class="login-main">
        <div class="login-container">
          <div class="login-ID">
            <lay-tab type="brief" v-model="method">
              <lay-tab-item title="用户名" id="1">
                <div style="height: 180px">
                  <lay-form-item :label-width="0">
                    <lay-input :allow-clear="true" prefix-icon="layui-icon-username" placeholder="用户名"
                      v-model="loginForm.username"></lay-input>
                  </lay-form-item>
                  <lay-form-item :label-width="0">
                    <lay-input :allow-clear="true" prefix-icon="layui-icon-password" placeholder="密码" password
                      type="password" v-model="loginForm.password"></lay-input>
                  </lay-form-item>
                  <lay-form-item :label-width="0">
                    <lay-button style="margin-top: 20px" type="primary" :loading="loging" :fluid="true"
                      loadingIcon="layui-icon-loading" @click="loginSubmit">登录</lay-button>
                  </lay-form-item>
                </div>
              </lay-tab-item>
            </lay-tab>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { login } from '../../api/module/user'
import { defineComponent, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../../store/user'
import { layer } from '@layui/layer-vue'

export default defineComponent({
  setup() {
    const router = useRouter()
    const userStore = useUserStore()
    const method = ref('1')
    const loging = ref(false);
    const loginForm = reactive({
      username: 'root',
      password: '123456'
    })
    onMounted(() => {
    })

    const loginSubmit = async () => {
      loging.value = true;
      login(loginForm).then(({ data, code, msg }) => {
        setTimeout(() => {
          loging.value = false;
          if (code == 200) {
            layer.msg(msg, { icon: 1 }, async () => {
              userStore.token = data.token
              await userStore.loadMenus()
              await userStore.loadPermissions()
              router.push('/')
            })
          } else {
            layer.msg(msg, { icon: 2 })
          }
        }, 1000)
      })
    }

    return {
      loginSubmit,
      loginForm,
      method,
      loging
    }
  }
})
</script>

<style scoped>

.login-root {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  justify-content: center;
  width: 100%;
  min-width: 320px;
  background-color: initial;
}

.login-main {
  position: relative;
  display: block;
}

.logo-container {
  max-width: calc(100vw - 28px);
  margin-bottom: 40px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-container {
  position: relative;
  overflow: hidden;
  width: 420px;
  height: 320px;
  max-width: calc(100vw - 28px);
  border-radius: 4px;
  background: hsla(0, 0%, 100%, 0.5);
  backdrop-filter: blur(30px);
  display: flex;
  box-shadow: 6px 6px 12px 4px rgba(0, 0, 0, 0.1);
}

.login-side {
  padding: 40px 20px 20px;
  background-color: var(--global-primary-color);
  flex: 1;
  height: 100%;
}


.login-ID {
  padding: 20px;
  width: 380px;
  min-width: 380px;
}

.login-container .layui-tab-head {
  background: transparent;
}

.login-container .layui-input-wrapper {
  margin-top: 10px;
  margin-bottom: 10px;
}

.login-container .layui-input-wrapper {
  margin-top: 12px;
  margin-bottom: 12px;
}

.login-container .assist {
  margin-top: 5px;
  margin-bottom: 5px;
  letter-spacing: 2px;
}

.login-container .layui-btn {
  margin: 10px 0px 10px 0px;
  letter-spacing: 2px;
  height: 40px;
}

.login-container .layui-line-horizontal {
  letter-spacing: 2px;
  margin-bottom: 34px;
  margin-top: 24px;
}

.other-ways {
  display: flex;
  justify-content: space-between;
  margin: 0;
  padding: 0;
  list-style: none;
  font-size: 14px;
  font-weight: 400;
}

.other-ways li {
  width: 100%;
}

.line-container {
  justify-content: center;
  align-items: center;
  text-align: center;
  cursor: pointer;
}

.line-container .icon {
  height: 28px;
  width: 28px;
  margin-right: 0;
  vertical-align: middle;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 1px 2px 0 rgb(9 30 66 / 4%), 0 1px 4px 0 rgb(9 30 66 / 10%),
    0 0 1px 0 rgb(9 30 66 / 10%);
}

.line-container .text {
  display: block;
  margin: 12px 0 0;
  font-size: 12px;
  color: #8592a6;
}

:deep(.layui-tab-title .layui-this) {
  background-color: transparent;
}
</style>
