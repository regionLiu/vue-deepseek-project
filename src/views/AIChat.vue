<template>
  <div class="ai-chat-root">
    <!-- 主色调导航栏，fixed置顶 -->
    <nav class="main-navbar">
      <div class="navbar-title">Anycreator</div>
      <div class="navbar-spacer"></div>
      <img class="navbar-logo" src="/icon/settings_icon.png" alt="用户设定" title="用户设定" />
    </nav>
    <!-- 聊天历史记录区，紧贴菜单栏，背景与主页面一致 -->
    <div class="chat-messages-area">
      <div class="chat-messages">
        <template v-for="(msg, idx) in [...messages].reverse()" :key="idx">
          <div class="chat-bubble right" v-if="msg.role === 'user'">
            <div class="bubble-content">{{ msg.content }}</div>
          </div>
          <!-- 预留：后续可加左侧气泡（AI回复） -->
        </template>
      </div>
    </div>
    <!-- 悬浮输入栏，底部居中，圆角阴影卡片 -->
    <div class="chat-input-float">
      <div class="chat-input-bar">
        <textarea id="chat-input" class="chat-input" v-model="input" placeholder="给 Anycreator 发送消息 " rows="2" @keydown.enter.exact.prevent="sendMessage" @keydown="handleKeydown"></textarea>
        <button class="send-btn" title="发送" @click="sendMessage">
          <svg width="22" height="22" viewBox="0 0 20 20" fill="none"><path d="M2.656 17.344c-1.016-1.015-1.15-2.75-.313-4.925.325-.825.73-1.617 1.205-2.365L3.582 10l-.033-.054c-.5-.799-.91-1.596-1.206-2.365-.836-2.175-.703-3.91.313-4.926.56-.56 1.364-.86 2.335-.86 1.425 0 3.168.636 4.957 1.756l.053.034.053-.034c1.79-1.12 3.532-1.757 4.957-1.757.972 0 1.776.3 2.335.86 1.014 1.015 1.148 2.752.312 4.926a13.892 13.892 0 0 1-1.206 2.365l-.034.054.034.053c.5.8.91 1.596 1.205 2.365.837 2.175.704 3.911-.311 4.926-.56.56-1.364.861-2.335.861-1.425 0-3.168-.637-4.957-1.757L10 16.415l-.053.033c-1.79 1.12-3.532 1.757-4.957 1.757-.972 0-1.776-.3-2.335-.86z" fill="#fff" stroke="#fff" stroke-width=".1"></path></svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'
// 聊天消息列表，初始为空
const messages = ref([])
// 输入框内容
const input = ref('')
// 发送消息
function sendMessage() {
  const text = input.value.trim()
  if (!text) return
  messages.value.push({ role: 'user', content: text })
  input.value = ''
  // 滚动到底部
  nextTick(() => {
    const msgList = document.querySelector('.chat-messages')
    if (msgList) msgList.scrollTop = msgList.scrollHeight
  })
}
// 回车快捷发送
function handleKeydown(e) {
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
    sendMessage()
  }
}
</script>

<style scoped>
.ai-chat-root {
  min-height: 100vh;
  background: #f6f8fa;
  display: flex;
  flex-direction: column;
}
.main-navbar {
  width: 100vw;
  height: 40px;
  background: linear-gradient(90deg, #22C55E 0%, #16a34a 100%);
  display: flex;
  align-items: center;
  box-shadow: 0 2px 8px #22C55E44, 0 4px 16px #0000000a;
  padding: 0 8px 0 32px;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
}
.navbar-title {
  color: #fff;
  font-size: 22px;
  font-weight: bold;
  letter-spacing: 2px;
  font-family: '阿里妈妈刀隶体 Regular', sans-serif;
  user-select: none;
  height: 40px;
  display: flex;
  align-items: center;
}
.navbar-spacer { flex: 1; }
.navbar-logo {
  width: 28px;
  height: 28px;
  margin-left: 18px;
  margin-right: 40px;
  cursor: pointer;
  border-radius: 50%;
  transition: box-shadow 0.2s;
  box-shadow: 0 2px 8px #22C55E22;
}
.navbar-logo:hover { box-shadow: 0 4px 16px #22C55E55; }
/* 聊天历史记录区，紧贴菜单栏，背景透明无圆角阴影 */
.chat-messages-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding-top: 48px;
  padding-bottom: 120px; /* 留出输入栏空间 */
  min-height: 0;
  background: transparent;
  width: 50vw;
}
.chat-messages {
  width: 100%;
  max-width: 1000px;
  min-width: 360px;
  min-height: 60vh;
  max-height: 80vh;
  overflow-y: auto;
  padding: 24px 0 24px 0;
  display: flex;
  flex-direction: column-reverse;
  gap: 16px;
  background: transparent;
  border-radius: 0;
  box-shadow: none;
  border: none;
  scrollbar-width: thin;
  scrollbar-color: #d1e7dd #f6f8fa;
}
.chat-messages::-webkit-scrollbar {
  width: 8px;
  background: #f6f8fa;
  border-radius: 8px;
}
.chat-messages::-webkit-scrollbar-thumb {
  background: #d1e7dd;
  border-radius: 8px;
}
.chat-bubble {
  display: flex;
  width: 100%;
  margin: 0 auto;
}
.chat-bubble.left {
  justify-content: flex-start;
  margin-left: 0;
}
.chat-bubble.right {
  justify-content: flex-end;
  align-self: flex-end;
  margin-right: 0;
}
.bubble-content {
  display: inline-block;
  min-width: 48px;
  max-width: 700px;
  padding: 13px 18px;
  border-radius: 16px;
  font-size: 16px;
  line-height: 1.7;
  box-shadow: 0 2px 8px #22C55E11;
  background: #f6f8fa;
  color: #222;
  word-break: break-all;
  white-space: pre-line;
  border: 1px solid #e6eaf0;
}
.chat-bubble.left .bubble-content {
  background: #f3fef6;
  color: #22C55E;
  border-bottom-left-radius: 4px;
}
.chat-bubble.right .bubble-content {
  background: linear-gradient(90deg, #22C55E 0%, #16a34a 100%);
  color: #fff;
  border-bottom-right-radius: 4px;
  border: none;
  margin-right: 4vw;
}
/* 悬浮输入栏，底部居中，圆角阴影卡片 */
.chat-input-float {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  display: flex;
  justify-content: center;
  pointer-events: none;
  z-index: 200;
}
.chat-input-bar {
  width: 100%;
  max-width: 700px;
  min-width: 320px;
  display: flex;
  align-items: flex-end;
  gap: 12px;
  background: #fff;
  padding: 18px 24px 18px 24px;
  border-radius: 18px;
  box-shadow: 0 4px 32px 0 #1e2c4012, 0 1.5px 4px #0001;
  border: 1px solid #e6eaf0;
  margin-bottom: 32px;
  pointer-events: auto;
}
.chat-input {
  flex: 1;
  min-height: 38px;
  max-height: 120px;
  border-radius: 12px;
  border: 1.5px solid #e0e0e0;
  font-size: 16px;
  padding: 10px 14px;
  resize: none;
  outline: none;
  background: #fafdff;
  transition: border 0.2s;
}
.chat-input:focus {
  border-color: #22C55E;
}
.send-btn {
  width: 44px;
  height: 44px;
  background: linear-gradient(90deg, #22C55E 0%, #16a34a 100%);
  border: none;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s, transform 0.18s cubic-bezier(.4,0,.2,1);
  box-shadow: 0 2px 8px #22C55E22;
  margin-bottom: 5px;
}
.send-btn:hover {
  background: #16a34a;
  transform: scale(1.08);
}
@media (max-width: 1100px) {
  .chat-messages {
    max-width: 100vw;
    min-width: 0;
  }
  .chat-input-bar {
    max-width: 98vw;
    min-width: 0;
    border-radius: 12px;
    margin-bottom: 12px;
  }
  .chat-bubble, .bubble-content {
    max-width: 98vw;
  }
}
</style> 