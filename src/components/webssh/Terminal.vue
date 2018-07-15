<template>
  <!-- <div class="terminal-wrapper"> -->
    <!-- <div class="terminal-header" v-if="term.show === true">
        <span class="terminal-title">Terminal-({{ term.sockInfo.host }}:{{ term.sockInfo.port }})</span>
        <span class="terminal-time">{{ term.connectedTime }}</span>
        <div class="dialog-close el-icon-close" @click="closeTerminal()"></div>
    </div>
    <div class="terminal-console" :id="'terminal-' + term.connectedTime"></div> -->
    <el-collapse-item v-show="term.invalid === false" :name="term.connectedTime">
      <template slot="title">
        <div class="terminal-header" :id="term.connectedTime">
          <span class="terminal-title">Terminal<i style="color: orange;">({{ term.sockInfo.host }}:{{ term.sockInfo.port }})</i></span>
          <span class="terminal-time" style="color:gray;font-size:8px;">{{ term.connectedTime }}</span>
          <div class="dialog-close el-icon-close" @click="closeTerminal()"></div>
        </div>
      </template>
      <!-- <div style="display:flex;">
        <div class="dialog-close el-icon-close" @click="closeTerminal()"></div>
        <div class="terminal-console" :id="'terminal-' + term.connectedTime"></div>
      </div> -->
      <!-- <div class="dialog-close el-icon-close" @click="closeTerminal()"></div> -->
      <div class="terminal-console" :id="'terminal-' + term.connectedTime"></div>
    </el-collapse-item> 
  <!-- </div> -->
</template>
<script>
import * as fit from 'xterm/lib/addons/fit/fit'
import * as attach from 'xterm/lib/addons/attach/attach'
import * as fullscreen from 'xterm/lib/addons/fullscreen/fullscreen';
import { Terminal } from 'xterm'
import 'xterm/dist/xterm.css';

Terminal.applyAddon(fit)
Terminal.applyAddon(attach)
Terminal.applyAddon(fullscreen)

export default {
  name: 'Terminal',
  props: {
    term: {
      type: Object,
      default: {
        sockInfo: {
          connected: false,
          username: null,
          password: null,
          sock: null,
          host: null,
          port: null,
        },
        term: null,
        show: true,
        invalid: false,
        connectedTime: Date.parse(new Date()),
      },
    },
    currentIndex: {
      type: Number,
      default: -1,
    },
  },
  data() {
    return {
      model: window.GlobalUtil.model,
      util: window.GlobalUtil,
    }
  },
  watch: {
  },
  computed: {
  },
  methods: {
    onOpenTerminal() {
      console.log(`ssh onopen: ${this.term.sockInfo.host}, time: ${this.term.connectedTime}`)
      this.term.sockInfo.connected = true
      this.term.sockInfo.sock.send(JSON.stringify({
        cmd: 'ssh_connect',
        data: {
          host: this.term.sockInfo.host,
          port: this.term.sockInfo.port,
          username: this.term.sockInfo.username,
          password: this.term.sockInfo.password,
        }
      }))
      this.term.term.attach(this.term.sockInfo.sock)
      this.term.term._initialized = true
    },
    onErrorTerminal() {
      console.log(`ssh onerror: ${this.term.sockInfo.host}, time: ${this.term.connectedTime}`)
      this.term.sockInfo.connected = false
      this.term.term.detach(this.term.sockInfo.sock)
      this.term.sockInfo.sock.close()
      const ele = document.getElementById(this.term.connectedTime)
      if (ele !== null) {
        ele.style.color = 'red'
      }
      this.term.show = false
      // this.term.term.destroy()
      // this.termContainer.style.display = 'none';

      // for (let i = 0; i < this.model.sshModel.terms.length; i += 1) {
      //   if (this.model.sshModel.terms[i].time === this.term.time) {
      //     this.model.sshModel.terms[i].term.detach(this.model.sshModel.terms[i].sockInfo.sock)
      //     this.model.sshModel.terms[i].term.destroy()
      //     this.termContainer.style.display = 'none';
      //   }
      // }
    },
    onCloseTerminal() {
      console.log(`ssh onclose: ${this.term.sockInfo.host}, time: ${this.term.connectedTime}`)
      this.term.sockInfo.connected = false
      this.term.term.detach(this.term.sockInfo.sock)
      this.term.sockInfo.sock.close()
      console.log
      const ele = document.getElementById(this.term.connectedTime)
      if (ele !== null) {
        ele.style.color = 'red'
      }
      this.term.show = false
      // this.term.term.destroy()
      // this.termContainer.style.display = 'none';
    },
    initTerminal() {
      console.log('initTerminal', this.term.connectedTime)
      if (this.term.sockInfo === null || this.term.sockInfo.sock === null || this.term.sockInfo.sock === undefined) {
        this.term.sockInfo.sock = new WebSocket('ws://' + this.util.socketInfo.host + '/ws?type=ssh')
        this.term.sockInfo.sock.onopen = this.onOpenTerminal
        this.term.sockInfo.sock.onclose = this.onCloseTerminal
        this.term.sockInfo.sock.onerror = this.onErrorTerminal
        console.log('connect socket')
      }
      else if (this.term.sockInfo.connected === false) {
        const ele = document.getElementById(this.term.connectedTime)
        if (ele !== null) {
          ele.style.color = 'red'
        }
      }

      if (this.term.term === null || this.term.term === undefined) {
        this.term.term = new Terminal()
        console.log('create terminal')
        this.term.invalid = false
      }
      this.termContainer = document.getElementById('terminal-' + this.term.connectedTime)
      this.term.term.open(this.termContainer)
    },
    closeTerminal() {
      console.log('closeTerminal:', this.term.connectedTime)
      if (this.term.sockInfo.sock && this.term.sockInfo.connected) {
        this.term.sockInfo.sock.close()
      }
      this.term.term.detach(this.term.sockInfo.sock)
      this.term.term.destroy()
      this.term.invalid = true
      if (this.termContainer !== null) {
        this.termContainer.style.display = 'none';
      }
    },
  },
  mounted() {
    this.initTerminal();
  },
  beforeDestroy() {
    console.log('beforeDestroy: ', this.term.connectedTime)
  },
}
</script>
<style>
.el-collapse-item__header {
  color: green;
  font-size: 15px;
  display: flex;
}
.el-collapse-item__header.is-active {
  color: blue;
  /* background: burlywood; */
  background: darkslategrey;
}
/* .el-collapse-item__arrow {
  margin-left: 20%;
} */
</style>

<style scoped lang="scss">
.terminal-wrapper {
  margin-top: 10px;
  margin-bottom: 20px;
  // display: inline-block;
  .terminal-header {
    display: flex;
    // margin-bottom: 5px;
    // justify-content: space-between;
    // .terminal-title {
    //   color: rgb(7, 76, 167);
    //   text-align: left;
    //   width: 50%;
    //   // margin-left: 100px;
    // }
    // .terminal-time {
    //   margin: auto;
    //   // margin-right: 50px;
    //   text-align: right;
    //   color: gray;
    //   font-size: 10px;
    // }
    // .dialog-close {
    //   // margin: auto;
    //   width: 30px;
    //   height: 30px;
    // }
  }
}
.el-icon-close {
  color: red;
}
.el-icon-close:hover {
  color: red;
}
</style>
