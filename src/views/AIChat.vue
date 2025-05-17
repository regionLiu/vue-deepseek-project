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
      <!-- 输入框上方左上角下拉框 -->
      <div class="chat-mode-select-bar">
        <select v-model="selectedMode" class="chat-mode-select" :disabled="sending">
          <option v-for="mode in CHAT_MODE_LIST" :key="mode" :value="mode">{{ mode }}</option>
        </select>
      </div>
      <!-- 新增：下拉框和输入框之间的文件上传控件 -->
      <div class="chat-file-upload-bar">
        <input type="file" @change="onFileChange" class="chat-file-input" :disabled="sending" />
        <span v-if="fileName" class="file-name">已选择：{{ fileName }}</span>
      </div>
      <div class="chat-messages-wrapper">
        <div class="chat-messages">
          <template v-for="(msg, idx) in messages" :key="idx">
            <div :class="['chat-bubble', msg.role === 'user' ? 'right' : 'left']">
              <div class="bubble-content">{{ msg.content }}</div>
              <!-- 新增：AI回复下方展示生成文件下载 -->
              <template v-if="msg.role === 'ai'">
                <div v-if="aiMetaList[idx] && aiMetaList[idx].doc_url" class="ai-doc-download">
                  生成文件：<a href="javascript:void(0)" class="download-link">立即下载</a>
                </div>
              </template>
            </div>
          </template>
        </div>
      </div>
    </div>
    <!-- 悬浮输入栏，底部居中，圆角阴影卡片 -->
    <div class="chat-input-float">
      <div class="chat-input-bar">
        <textarea id="chat-input" class="chat-input" v-model="input" :disabled="sending" placeholder="给 Anycreator 发送消息 " rows="2" @keydown.enter.exact.prevent="sendAIChat" @keydown="handleKeydown"></textarea>
        <button class="send-btn" title="发送" @click="sendAIChat" :disabled="sending">
          <svg width="22" height="22" viewBox="0 0 20 20" fill="none"><path d="M2.656 17.344c-1.016-1.015-1.15-2.75-.313-4.925.325-.825.73-1.617 1.205-2.365L3.582 10l-.033-.054c-.5-.799-.91-1.596-1.206-2.365-.836-2.175-.703-3.91.313-4.926.56-.56 1.364-.86 2.335-.86 1.425 0 3.168.636 4.957 1.756l.053.034.053-.034c1.79-1.12 3.532-1.757 4.957-1.757.972 0 1.776.3 2.335.86 1.014 1.015 1.148 2.752.312 4.926a13.892 13.892 0 0 1-1.206 2.365l-.034.054.034.053c.5.8.91 1.596 1.205 2.365.837 2.175.704 3.911-.311 4.926-.56.56-1.364.861-2.335.861-1.425 0-3.168-.637-4.957-1.757L10 16.415l-.053.033c-1.79 1.12-3.532 1.757-4.957 1.757-.972 0-1.776-.3-2.335-.86z" fill="#fff" stroke="#fff" stroke-width=".1"></path></svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import { useRouter } from 'vue-router'
// 导入全局聊天模式列表和映射
import { CHAT_MODE_LIST, CHAT_MODE_MAP, BASE_URL, AI_CHAT_STREAM_API } from '../env.js'
// 聊天消息列表，初始为空
const messages = ref([])
// AI回复meta信息（如doc_url），用于展示下载按钮
const aiMetaList = ref([]) // 与messages中AI回复一一对应
// 输入框内容
const input = ref('')
// 聊天模式下拉框选中项
const selectedMode = ref(CHAT_MODE_LIST[0])
// 文件上传相关
const file = ref(null)
const fileName = ref('')
// 发送按钮和输入框禁用状态
const sending = ref(false)
const router = useRouter()
let lastContent = ''
function onFileChange(e) {
  file.value = e.target.files[0] || null
  fileName.value = file.value ? file.value.name : ''
}
// 发送AI对话请求（带文件上传）
async function sendAIChat() {
  const text = input.value.trim()
  if ((!text && !file.value) || sending.value) return // 没有内容也没文件或正在发送时不发送
  sending.value = true // 禁用按钮和输入框
  const token = localStorage.getItem('access_token')
  const formData = new FormData()
  formData.append('text', text)
  formData.append('request_type', CHAT_MODE_MAP[selectedMode.value])
  formData.append('access_token', token)
  if (file.value) {
    formData.append('file', file.value)
  }
  try {
    // 用户消息先加入右侧气泡
    if (text) {
      messages.value.push({ role: 'user', content: text })
      input.value = ''
    }
    file.value = null
    fileName.value = ''
    // 滚动到底部
    nextTick(() => {
      const msgList = document.querySelector('.chat-messages')
      if (msgList) msgList.scrollTop = msgList.scrollHeight
    })
    // 发起AI对话请求
    const res = await fetch(`${BASE_URL}${AI_CHAT_STREAM_API}`, {
      method: 'POST',
      body: formData
    })
    console.log('响应状态', res.status)
    console.log('响应头', Array.from(res.headers.entries()))
    // 401未授权，跳转到登录页
    if (res.status === 401) {
      router.push('/login')
      return
    }
    // 判断是否流式响应
    const isStream = res.headers.get('X-Stream') === 'true'
    if (!res.ok) throw new Error('请求失败')
    if (isStream) {
      // 流式响应，逐行解析JSON，逐字显示AI回复内容
      let aiMsg = ''
      let lastDocUrl = ''
      messages.value.push({ role: 'ai', content: '' })
      aiMetaList.value.push(null) // 先占位
      const aiMsgObj = messages.value[messages.value.length - 1]
      const aiMetaObj = { doc_url: '' }
      const reader = res.body.getReader()
      const decoder = new TextDecoder('utf-8')
      let buffer = ''
      let done = false
      while (!done) {
        const { value, done: doneReading } = await reader.read()
        done = doneReading
        if (value) {
          buffer += decoder.decode(value)
          // 按行分割处理
          let lines = buffer.split('\n')
          buffer = lines.pop() // 最后一行可能是不完整的，留到下次
          for (const line of lines) {
            let cleanLine = line.trim()
            if (!cleanLine) continue
            if (cleanLine.startsWith('data:')) {
              cleanLine = cleanLine.slice(5).trim()
            }
            try {
              const data = JSON.parse(cleanLine)
              const newContent = data.data || ''
              // 处理meta.doc_url
              if (data.meta && data.meta.doc_url) {
                aiMetaObj.doc_url = data.meta.doc_url
              }
              aiMetaList.value[messages.value.length - 1] = { ...aiMetaObj }
              // 替换流式响应内容追加部分：
              // 原来是逐字追加，现在每收到一段content就整体追加
              if (newContent) {
                aiMsgObj.content += newContent
                await nextTick()
                const msgList = document.querySelector('.chat-messages')
                if (msgList) msgList.scrollTop = msgList.scrollHeight
              }
            } catch (e) {
              console.error('流式响应解析失败:', cleanLine, e)
            }
          }
        }
      }
    } else {
      // 非流式，直接展示完整AI回复
      const text = await res.text()
      console.log('响应体', text) // 打印原始响应体内容
      let data
      try {
        // 只取最后一行非空内容
        const lines = text.split('\n').map(l => l.trim()).filter(Boolean)
        const lastLine = lines[lines.length - 1]
        data = JSON.parse(lastLine)
      } catch (e) {
        console.error('原始响应体不是合法JSON:', text)
        throw new Error('返回内容不是合法JSON')
      }
      const aiMsg = (data.data ?? '[无AI回复内容]')
      messages.value.push({ role: 'ai', content: aiMsg })
      // 检查meta.doc_url
      if (data.meta && data.meta.doc_url) {
        aiMetaList.value.push({ doc_url: data.meta.doc_url })
      } else {
        aiMetaList.value.push(null)
      }
    }
    // 滚动到底部
    nextTick(() => {
      const msgList = document.querySelector('.chat-messages')
      if (msgList) msgList.scrollTop = msgList.scrollHeight
    })
  } catch (err) {
    console.error('请求异常', err)
    alert('请求失败，请重试')
  } finally {
    sending.value = false // 恢复按钮和输入框
  }
}
// 回车快捷发送
function handleKeydown(e) {
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
    sendAIChat()
  }
}
</script>

<style scoped>
.ai-chat-root {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f6f8fa;
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
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  padding-top: 60px;
  padding-bottom: 0;
  width: 100vw;
  max-width: 100vw;
  box-sizing: border-box;
  overflow: hidden;
}
/* 新增：聊天模式下拉框区域 */
.chat-mode-select-bar {
  width: 100%;
  max-width: 700px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 8px;
  margin-left: 0;
}
.chat-mode-select {
  font-size: 1rem;
  padding: 6px 18px 6px 10px;
  border-radius: 8px;
  border: 1.5px solid #22C55E;
  background: #fafdff;
  color: #22C55E;
  outline: none;
  margin-left: 0;
  margin-top: 0;
  margin-bottom: 0;
  box-shadow: 0 2px 8px #22C55E11;
  transition: border 0.2s;
}
.chat-mode-select:focus {
  border-color: #16a34a;
}
/* 新增：聊天消息区外层，保证内容多时只在此区域内部滚动 */
.chat-messages-wrapper {
  width: 100%;
  max-width: 700px;
  min-width: 320px;
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  margin-bottom: 0;
  overflow: hidden;
  padding-bottom: 0;
}
.chat-messages {
  width: 100%;
  flex: 1 1 auto;
  overflow-y: auto;
  padding: 24px 0 0 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: transparent;
  border-radius: 0;
  box-shadow: none;
  border: none;
  scrollbar-width: thin;
  scrollbar-color: #d1e7dd #f6f8fa;
  min-height: 0;
  max-height: 100%;
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
  width: 100vw;
  display: flex;
  justify-content: center;
  pointer-events: auto;
  z-index: 200;
  margin-bottom: 0;
  background: transparent;
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
  margin-bottom: 24px;
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
/* 新增：文件上传区域样式 */
.chat-file-upload-bar {
  width: 100%;
  max-width: 700px;
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  margin-left: 0;
}
.chat-file-input {
  font-size: 1rem;
  padding: 4px 0;
  margin-right: 12px;
}
.file-name {
  color: #22C55E;
  font-size: 0.98rem;
}
.ai-doc-download {
  margin-top: 8px;
  font-size: 0.98rem;
  color: #666;
}
.download-link {
  color: #22C55E;
  text-decoration: underline;
  cursor: pointer;
  margin-left: 6px;
}
.download-link:hover {
  color: #16a34a;
}
@media (max-width: 1100px) {
  .chat-messages-wrapper {
    max-width: 98vw;
    min-width: 0;
    height: calc(100vh - 40px - 80px);
    max-height: calc(100vh - 40px - 80px);
    margin-bottom: 0;
  }
  .chat-messages {
    max-width: 98vw;
    min-width: 0;
  }
  .chat-messages-area {
    width: 100vw;
    max-width: 100vw;
  }
}
@media (max-width: 600px) {
  .chat-input-bar {
    height: 60px;
    min-height: 60px;
    max-height: 60px;
    padding: 8px 4vw 8px 4vw;
    border-radius: 8px;
  }
  .chat-messages-wrapper {
    max-width: 99vw;
    height: calc(100vh - 40px - 60px);
    max-height: calc(100vh - 40px - 60px);
    margin-bottom: 0;
    padding-bottom: 80px; /* 移动端输入栏高度+安全距离 */
  }
  .chat-mode-select-bar {
    max-width: 98vw;
    padding-left: 2vw;
  }
  .chat-mode-select {
    font-size: 0.95rem;
    padding: 4px 10px 4px 6px;
  }
  .chat-messages {
    padding: 16px 0 80px 0; /* 移动端输入栏高度+安全距离 */
  }
}
</style> 