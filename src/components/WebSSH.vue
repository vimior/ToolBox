<template lang="html">
  <div class="app-container">
    <!-- <BaseCommonTopMenu class="base-top-menu"
      :backTitle="$t('terminal')">
    </BaseCommonTopMenu> -->
    <div class="webssh-area">
      <div class="webssh-config">
        <div>
          <span class="webssh-config-text">{{$t('host')}}:</span>
          <input class="webssh-config-input webssh-config-host" type="text" placeholder="host" v-model="model.sshModel.sshInfo.host">
        </div>
        <div>
          <span class="webssh-config-text">{{$t('post')}}:</span>
          <input class="webssh-config-input webssh-config-port" type="text" placeholder="port" v-model="model.sshModel.sshInfo.port">
        </div>
        <div>
          <span class="webssh-config-text">{{$t('username')}}:</span>
          <input class="webssh-config-input webssh-config-username" type="text" placeholder="username" v-model="model.sshModel.sshInfo.username">
        </div>
        <div>
          <span class="webssh-config-text">{{$t('password')}}:</span>
          <input class="webssh-config-input webssh-config-password" type="password" v-if="!model.sshModel.sshInfo.showPassword" placeholder="password" v-model="model.sshModel.sshInfo.password">
          <input class="webssh-config-input webssh-config-password" type="text" v-else placeholder="password" v-model="model.sshModel.sshInfo.password">
          <el-checkbox type="checkbox" v-model="model.sshModel.sshInfo.showPassword"  title="visible"></el-checkbox>
        </div>
        <el-button class="webssh-connect-btn" @click="connectSSH()">{{$t('connectSSH')}}</el-button>
      </div>
      <!-- <div v-model="model.sshModel.termItems.length" class="terminal-group">
        <template v-for="(term, index) in model.sshModel.termItems">
          <Terminal :term="term" :currentIndex="index"></Terminal>
        </template>
      </div> -->
      <div class="terminal-group">
      <el-collapse v-if="model.sshModel.termItems.length !== 0" v-model="activeTerms">
        <template v-for="(term, index) in model.sshModel.termItems">
            <Terminal :term="term" :currentIndex="index"></Terminal>
        </template>
      </el-collapse>
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
            term.show = true
          }
          else {
            term.show = false
          }
        });
      }
    },
  },
  components: {
    Terminal,
    BaseCommonTopMenu,
  },
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.app-container {
  width: 100%;
  height:100%;
  border-left: 1px solid rgba(137, 137, 137, 0.35);
  // overflow: auto;
  overflow: hidden;
}
.webssh-area {
  // margin: auto;
  /*display: flex;*/
  overflow: hidden;
  .webssh-config {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1500;
    background: white;
    // margin: auto;
    // margin-top: 10px;
    // margin-left: 100px;
    /*display: flex;*/
    /*width: 19%;*/
    /*justify-content: flex-start;*/
    // align-items: center;
    /*flex-direction: column;*/
    text-align: center;
    &>div {
     margin: 5px;
     display: inline-block;
    }
    span {
      margin: 6px;
      padding: 6px 0;
      // width: 65px;
      display: inline-block;
      text-align: right;
    }
    // input[type=text],input[type=password] {
    //   // border: none;
    //   width: 80px;
    //   padding: 8px 10px;
    //   color: #666;
    // }
    .webssh-config-input {
      border: 1px solid;
      padding: 8px 10px;
      color: #666;
    }
    .webssh-config-host {
      width: 100px;
    }
    .webssh-config-port {
      width: 45px;
    }
    .webssh-config-username {
      width: 80px;
    }
    .webssh-config-password {
      width: 80px;
    }
    .webssh-connect-btn {
      line-height: 36px;
      padding: 0 14px;
      margin-left: 50px;
    }
  }
  .terminal-group {
    // position: fixed;
    margin-top: 5%;
    margin-left: 10%;
    margin-right: 10%;
    text-align: center;
    // overflow-y: auto;
    overflow-x: hidden;
    // margin-top: 50px;
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
