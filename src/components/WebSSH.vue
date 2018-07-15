<template lang="html">
  <div class="app-container">
    <!-- <BaseCommonTopMenu class="base-top-menu"
      :backTitle="$t('terminal')">
    </BaseCommonTopMenu> -->
    <div class="webssh-area">
      <div class="webssh-config">
        <div>
          <el-tag type="info" class="webssh-config-text">{{$t('host')}}:</el-tag>
          <el-input clearable class="webssh-config-input webssh-config-host" type="text" placeholder="host" v-model="model.sshModel.sshInfo.host"></el-input>
          <!-- <input class="webssh-config-input webssh-config-host" type="text" placeholder="host" v-model="model.sshModel.sshInfo.host"> -->
        </div>
        <div>
          <el-tag type="info" class="webssh-config-text">{{$t('post')}}:</el-tag>
          <el-input clearable class="webssh-config-input webssh-config-port" type="text" placeholder="port" v-model="model.sshModel.sshInfo.port"></el-input>
          <!-- <input class="webssh-config-input webssh-config-port" type="text" placeholder="port" v-model="model.sshModel.sshInfo.port"> -->
        </div>
        <div>
          <el-tag type="info" class="webssh-config-text">{{$t('username')}}:</el-tag>
          <el-input clearable class="webssh-config-input webssh-config-username" type="text" placeholder="username" v-model="model.sshModel.sshInfo.username"></el-input>
          <!-- <input class="webssh-config-input webssh-config-username" type="text" placeholder="username" v-model="model.sshModel.sshInfo.username"> -->
        </div>
        <div>
          <el-tag type="info" class="webssh-config-text">{{$t('password')}}:</el-tag>
          <el-input clearable class="webssh-config-input webssh-config-password" type="password" v-if="!model.sshModel.sshInfo.showPassword" placeholder="password" v-model="model.sshModel.sshInfo.password"></el-input>
          <el-input clearable class="webssh-config-input webssh-config-password" type="text" v-else placeholder="password" v-model="model.sshModel.sshInfo.password"></el-input>
          <!-- <input class="webssh-config-input webssh-config-password" type="password" v-if="!model.sshModel.sshInfo.showPassword" placeholder="password" v-model="model.sshModel.sshInfo.password">
          <input class="webssh-config-input webssh-config-password" type="text" v-else placeholder="password" v-model="model.sshModel.sshInfo.password"> -->
          <el-checkbox type="checkbox" v-model="model.sshModel.sshInfo.showPassword"  title="visible"></el-checkbox>
        </div>
        <el-button class="webssh-connect-btn" @click="connectSSH()">{{$t('connectSSH')}}</el-button>
      </div>
      <!-- <div v-model="model.sshModel.termItems.length" class="terminal-group">
        <template v-for="(term, index) in model.sshModel.termItems">
          <Terminal :term="term" :currentIndex="index"></Terminal>
        </template>
      </div> -->
      <!-- <div class="terminal-group">
        <div style="border:1px red  solid;overflow-y:scroll;">
        <el-collapse v-if="model.sshModel.termItems.length !== 0" v-model="activeTerms">
          <template v-for="(term, index) in model.sshModel.termItems">
              <Terminal :term="term" :currentIndex="index"></Terminal>
          </template>
        </el-collapse>
        </div>
      </div> -->
      <div class="terminal-group">
        <div  class="terminal-group-area">
          <el-collapse v-if="model.sshModel.termItems.length !== 0" v-model="activeTerms">
            <template v-for="(term, index) in model.sshModel.termItems">
                <Terminal :term="term" :currentIndex="index" v-if="term.reload"></Terminal>
            </template>
          </el-collapse>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BaseCommonTopMenu from './common/BaseCommonTopMenu';
import Terminal from './webssh/Terminal'

export default {
  name: 'WebSSH',
  i18n: {
    messages: {
      en: {
        terminal: 'Terminal',
        host: 'Host',
        port: 'Port',
        username: 'Username',
        password: 'Password',
        connectSSH: 'Connect',
      },
      cn: {
        terminal: '终端',
        host: '主机',
        port: '端口',
        username: '用户名',
        password: '密码',
        connectSSH: '连接',
      },
    },
  },
  data() {
    return {
      model: window.GlobalUtil.model,
    }
  },
  methods: {
    connectSSH() {
      let count = 0;
      for (let i = 0; i < this.model.sshModel.termItems.length; i += 1) {
        if (this.model.sshModel.termItems[i].sockInfo.connected) {
          count += 1;
        }
      }
      if (count >= 5) {
        this.$message('terminal limit')
        return
      }
      this.model.sshModel.termItems.push({
        sockInfo: {
          connected: false,
          sock: null,
          host: this.model.sshModel.sshInfo.host,
          port: this.model.sshModel.sshInfo.port,
          username: this.model.sshModel.sshInfo.username,
          password: this.model.sshModel.sshInfo.password,
        },
        term: null,
        show: true,
        invalid: false,
        reload: true,
        connectedTime: (new Date()).toLocaleString(),
      })
      // document.scrollingElement.scrollTop = document.scrollingElement.scrollHeight
    },
  },
  beforeDestroy() {
    console.log('beforeDestroy')
    const termItems = []
    for (let i = 0; i < this.model.sshModel.termItems.length; i += 1) {
      if (this.model.sshModel.termItems[i].sockInfo.connected) {
        termItems.push(this.model.sshModel.termItems[i])
      }
    }
    this.model.sshModel.termItems = termItems;
  },
  computed: {
    activeTerms: {
      get() {
        const actives = []
        for (let i = 0; i < this.model.sshModel.termItems.length; i++) {
          if (this.model.sshModel.termItems[i].show) {
            actives.push(this.model.sshModel.termItems[i].connectedTime)
          }
        }
        return actives
      },
      set(value) {
        this.model.sshModel.termItems.forEach(term => {
          if (value.includes(term.connectedTime)) {
            if (term.show !== true) {
              term.reload = false;
              this.$nextTick(() => {
                term.reload = true;
              })
            }
            term.show = true
          }
          else {
            term.show = false
          }
        });
        // this.isReload = false;
        // this.$nextTick(() => {
        //   this.isReload = true;
        // })
      }
    },
  },
  components: {
    Terminal,
    BaseCommonTopMenu,
  },
}
</script>
<style>
.el-input__inner {
  -webkit-appearance: none;
  background-color: #fff;
  background-image: none;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  color: #606266;
  display: inline-block;
  font-size: inherit;
  height: 32px;
  line-height: 32px;
  outline: 0;
  padding: 0 15px;
  -webkit-transition: border-color .2s cubic-bezier(.645,.045,.355,1);
  transition: border-color .2s cubic-bezier(.645,.045,.355,1);
  width: 100%;
}
html, body {
  overflow:  hidden !important;
}
</style>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.app-container {
  width: 100%;
  height:100%;
  border-left: 1px solid rgba(137, 137, 137, 0.35);
}
.webssh-area {
  overflow: hidden;
  .webssh-config {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1500;
    background: white;
    text-align: center;
    &>div {
     margin: 5px;
     display: inline-block;
    }
    .webssh-config-host {
      width: 160px;
    }
    .webssh-config-port {
      width: 90px;
    }
    .webssh-config-username {
      width: 150px;
    }
    .webssh-config-password {
      width: 150px;
    }
    .webssh-connect-btn {
      line-height: 36px;
      padding: 0 14px;
      margin-left: 50px;
    }
  }
  .terminal-group {
    position: absolute;
    // border:1px blue solid;
    text-align: center;
    // margin-top: 50px; // 5%;
    // margin-bottom: 30px; // 3%;
    // margin-left: 15%;
    // margin-right: 15%;
    margin: auto;
    left: 0;
    right: 0;
    top: 50px;
    bottom: 30px;
    width: 750px;
    height: 90%;
    .terminal-group-area {
      position:absolute;
      // border:1px red  solid;
      // margin-right: -20px;
      width: 760px;
      height: 100%;
      overflow-y: auto;
      overflow-x: hidden;
    }
  }
}
.app-container::-webkit-scrollbar {/*滚动条整体样式*/
  width: 4px;     /*高宽分别对应横竖滚动条的尺寸*/
  height: 4px;
}
.app-container::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
  border-radius: 5px;
  -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
  background: #D8D8D8;
}
.app-container::-webkit-scrollbar-track {/*滚动条里面轨道*/
  -webkit-box-shadow: inset 0 0 5px rgba(231,231,231,0.4);
  border-radius: 0;
  background: rgba(231,231,231,0.4);
}
</style>
