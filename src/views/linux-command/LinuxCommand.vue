<template>
  <VContainer title="Linux常见命令查询">
    <div class="box-wrap">
      <div
        v-for="item in commandList"
        :key="item.category"
        class="command-wrap"
      >
        <h3 class="mb-12">{{ item.category }}</h3>
        <div v-for="command in item.list" :key="command.name">
          <div class="flex">
            <p class="command-row">{{ command.name }}</p>
            <p class="command-row">{{ command.description }}</p>
            <p class="command-row">{{ command.usage }}</p>
            <p class="command-row">{{ command.example }}</p>
          </div>
        </div>
      </div>
    </div>
  </VContainer>
</template>
<script setup lang="ts">
import VContainer from "@/components/v-container/Container.vue";
const commandList = [
  {
    category: "系统与基础",
    list: [
      {
        name: "ls",
        description: "列出目录内容",
        usage: "ls [选项] [文件或目录]",
        example: "ls -la",
      },
      {
        name: "cd",
        description: "切换目录",
        usage: "cd [目录路径]",
        example: "cd /home/user",
      },
      {
        name: "pwd",
        description: "显示当前工作目录",
        usage: "pwd",
        example: "pwd",
      },
      {
        name: "mkdir",
        description: "创建新目录",
        usage: "mkdir [选项] 目录名",
        example: "mkdir test",
      },
      {
        name: "rm",
        description: "删除文件或目录",
        usage: "rm [选项] 文件名",
        example: "rm -rf test/",
      },
      {
        name: "cp",
        description: "复制文件或目录",
        usage: "cp [选项] 源文件 目标文件",
        example: "cp file1 file2",
      },
      {
        name: "mv",
        description: "移动或重命名文件",
        usage: "mv [选项] 源文件 目标文件",
        example: "mv old.txt new.txt",
      },
    ],
  },
  {
    category: "网络相关",
    list: [
      {
        name: "ifconfig",
        description: "显示网络接口信息",
        usage: "ifconfig [网络接口]",
        example: "ifconfig -a",
      },
      {
        name: "ping",
        description: "测试网络连接",
        usage: "ping [选项] [目标地址]",
        example: "ping www.google.com",
      },
      {
        name: "netstat",
        description: "显示网络连接状态",
        usage: "netstat [选项]",
        example: "netstat -an",
      },
      {
        name: "curl",
        description: "发送HTTP请求",
        usage: "curl [选项] [URL]",
        example: "curl https://api.example.com",
      },
      {
        name: "wget",
        description: "下载文件",
        usage: "wget [选项] [URL]",
        example: "wget https://example.com/file.zip",
      },
      {
        name: "ssh",
        description: "远程登录",
        usage: "ssh [用户名@]主机名",
        example: "ssh user@192.168.1.100",
      },
      {
        name: "scp",
        description: "远程文件复制",
        usage: "scp [选项] 源文件 目标位置",
        example: "scp file.txt user@remote:/path",
      },
    ],
  },
  {
    category: "进程管理",
    list: [
      {
        name: "ps",
        description: "显示进程状态",
        usage: "ps [选项]",
        example: "ps aux",
      },
      {
        name: "top",
        description: "动态显示系统进程",
        usage: "top",
        example: "top",
      },
      {
        name: "kill",
        description: "终止进程",
        usage: "kill [信号] 进程ID",
        example: "kill -9 1234",
      },
    ],
  },
  {
    category: "文件操作",
    list: [
      {
        name: "cat",
        description: "查看文件内容",
        usage: "cat [选项] 文件名",
        example: "cat file.txt",
      },
      {
        name: "grep",
        description: "文本搜索",
        usage: "grep [选项] 模式 文件名",
        example: "grep 'error' log.txt",
      },
      {
        name: "chmod",
        description: "修改文件权限",
        usage: "chmod [选项] 权限值 文件名",
        example: "chmod 755 script.sh",
      },
      {
        name: "tar",
        description: "文件打包/解包",
        usage: "tar [选项] 文件名",
        example: "tar -czf archive.tar.gz files/",
      },
    ],
  },
];
</script>
<style scoped>
.command-wrap {
  margin-bottom: 20px;
  padding: 10px;
  padding-bottom: 20px;
}
.command-row {
  width: 220px;
  border-left: 2px solid #ccc;
  padding-left: 8px;
}
</style>