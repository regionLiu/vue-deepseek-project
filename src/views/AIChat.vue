<template>
  <div class="ai-chat-root">
    <div class="ai-chat-main">
      <!-- 左侧任务栏 -->
      <aside class="sidebar" :class="{ collapsed: sidebarCollapsed }">
        <div class="sidebar-header">
          <div class="sidebar-header-row-toggle">
            <button class="sidebar-toggle-btn" @click="sidebarCollapsed = !sidebarCollapsed" aria-label="切换边栏">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#888" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="sidebar-toggle-svg"><rect width="18" height="18" x="3" y="3" rx="2"></rect><path d="M15 3v18"></path></svg>
            </button>
          </div>
          <template v-if="!sidebarCollapsed">
            <div class="sidebar-header-row-newtask">
              <button class="new-task-btn" @click="showTaskDropdown = !showTaskDropdown">新建任务</button>
            </div>
            <div v-if="showTaskDropdown" class="task-dropdown">
              <div v-for="mode in CHAT_MODE_LIST" :key="mode" class="task-dropdown-item" @click="createTask(mode)">
                {{ mode }}
              </div>
            </div>
          </template>
        </div>
        <div v-if="!sidebarCollapsed" class="task-list">
          <div
            v-for="task in tasks"
            :key="task.id"
            :class="['task-card', { active: task.id === currentTaskId }]"
            @click="selectTask(task.id)"
          >
            <div class="task-title">{{ task.title }}</div>
            <div class="task-type">{{ task.mode }}</div>
            <button class="task-close-btn" @click.stop="openCloseConfirm(task.id)" title="关闭任务">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#888" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
            </button>
          </div>
        </div>
        <div v-if="!sidebarCollapsed" class="sidebar-footer-setting">
          <div class="footer-menu-wrapper" @mouseenter="showFooterMenu = true" @mouseleave="showFooterMenu = false">
            <button class="footer-menu-btn" aria-label="设置">
              <svg width="24" height="24" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="4" width="16" height="2.5" rx="1.2" fill="#888"/>
                <rect x="3" y="9.25" width="16" height="2.5" rx="1.2" fill="#888"/>
                <rect x="3" y="14.5" width="16" height="2.5" rx="1.2" fill="#888"/>
              </svg>
            </button>
            <div v-if="showFooterMenu" class="footer-menu-pop">
              <div class="footer-menu-item" @click="logout">退出登录</div>
            </div>
          </div>
        </div>
      </aside>
      <!-- 右侧对话区 -->
      <section class="chat-section">
        <template v-if="!currentTaskId">
          <div class="chat-empty-tip">请创建任务</div>
        </template>
        <template v-else>
          <div class="chat-logo-inline"><span class="corner-logo-small">Anycreator</span></div>
          <div class="chat-messages-area">
            <!-- 聊天内容区 -->
            <div class="chat-messages-wrapper">
              <div class="chat-messages">
                <template v-for="(msg, idx) in currentTask.messages" :key="idx">
                  <div class="bubble-wrapper" :class="msg.role === 'user' ? 'bubble-wrapper-user' : 'bubble-wrapper-ai'">
                    <div class="bubble-label">
                      {{ msg.role === 'user' ? '我：' : 'Anycreator：' }}
                    </div>
                    <div :class="['chat-bubble', msg.role === 'user' ? 'right' : 'left']">
                      <div class="bubble-content">
                        <template v-if="msg.role === 'ai' && msg.content && msg.content.type === 'download'">
                          <div style="display: flex; flex-direction: column; align-items: flex-start;">
                            <a href="javascript:void(0)" class="download-link" @click="downloadDoc(msg.content.url)">点我下载</a>
                            <div class="download-tip">下载后文件如果需要修改请改文件名</div>
                          </div>
                        </template>
                        <template v-else>
                          {{ msg.content }}
                        </template>
                      </div>
                      <template v-if="msg.role === 'ai' && currentTask.aiMetaList[idx] && currentTask.aiMetaList[idx].doc_url">
                        <div class="ai-doc-download">
                          <a href="javascript:void(0)" class="download-link" @click="downloadDoc(currentTask.aiMetaList[idx].doc_url)">点我下载</a>
                        </div>
                      </template>
                    </div>
                  </div>
                </template>
              </div>
            </div>
            <!-- 输入栏和文件上传 -->
            <div class="chat-input-float">
              <div class="chat-input-bar modern-chat-input-bar chat-input-bar-hasfile" :class="{ 'has-file': file }">
                <!-- 文件卡片放在输入区内部，输入框和按钮的上方一行 -->
                <div v-if="file" class="file-card-area file-card-area-inbar">
                  <div class="file-card">
                    <div class="file-thumb">
                      <img v-if="fileIsImage" :src="fileUrl" alt="预览" class="file-img" />
                      <svg v-else width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#bbb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="4"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
                    </div>
                    <div class="file-info">
                      <div class="file-name-ellipsis">{{ file.name }}</div>
                      <div class="file-size">{{ fileSizeStr }}</div>
                    </div>
                    <button class="file-remove-btn" @click="removeFile" title="移除文件">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#888" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
                    </button>
                  </div>
                </div>
                <label class="upload-btn modern-upload-btn upload-btn-center" :class="{ disabled: sending || disableUpload }">
                  <input type="file" @change="onFileChange" class="chat-file-input" :disabled="sending || disableUpload" />
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#888" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-paperclip">
                    <path d="M13.234 20.252 21 12.3"></path>
                    <path d="m16 6-8.414 8.586a2 2 0 0 0 0 2.828 2 2 0 0 0 2.828 0l8.414-8.586a4 4 0 0 0 0-5.656 4 4 0 0 0-5.656 0l-8.415 8.585a6 6 0 1 0 8.486 8.486"></path>
                  </svg>
                </label>
                <textarea id="chat-input" class="chat-input" v-model="input" :disabled="sending" placeholder="给 Anycreator 发送消息 " rows="2" @keydown.enter.exact.prevent="sendAIChat" @keydown="handleKeydown"></textarea>
                <button class="send-btn" title="发送" @click="sendAIChat" :disabled="sending">
                  <svg width="22" height="22" viewBox="0 0 20 20" fill="none"><path d="M2.656 17.344c-1.016-1.015-1.15-2.75-.313-4.925.325-.825.73-1.617 1.205-2.365L3.582 10l-.033-.054c-.5-.799-.91-1.596-1.206-2.365-.836-2.175-.703-3.91.313-4.926.56-.56 1.364-.86 2.335-.86 1.425 0 3.168.636 4.957 1.756l.053.034.053-.034c1.79-1.12 3.532-1.757 4.957-1.757.972 0 1.776.3 2.335.86 1.014 1.015 1.148 2.752.312 4.926a13.892 13.892 0 0 1-1.206 2.365l-.034.054.034.053c.5.8.91 1.596 1.205 2.365.837 2.175.704 3.911-.311 4.926-.56.56-1.364.861-2.335.861-1.425 0-3.168-.637-4.957-1.757L10 16.415l-.053.033c-1.79 1.12-3.532 1.757-4.957 1.757-.972 0-1.776-.3-2.335-.86z" fill="#fff" stroke="#fff" stroke-width=".1"></path></svg>
                </button>
              </div>
            </div>
          </div>
        </template>
      </section>
    </div>
    <div v-if="showCloseConfirm" class="close-confirm-mask">
      <div class="close-confirm-dialog">
        <div class="close-confirm-title">确认关闭并删除该任务？</div>
        <div class="close-confirm-actions">
          <button class="close-confirm-btn close-confirm-btn-yes" @click="confirmCloseTask">是</button>
          <button class="close-confirm-btn close-confirm-btn-no" @click="showCloseConfirm = false">取消</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { CHAT_MODE_LIST, CHAT_MODE_MAP, BASE_URL, AI_CHAT_STREAM_API } from '../env.js'
// 任务数据结构：{ id, title, mode, selectedMode, messages, aiMetaList }
let taskIdSeed = 1
const tasks = ref([])
const currentTaskId = ref(null)
const showTaskDropdown = ref(false)
const sidebarCollapsed = ref(false)
const file = ref(null)
const fileName = ref('')
const input = ref('')
const sending = ref(false)
const router = useRouter()
const fileUrl = ref('')
const fileIsImage = computed(() => file.value && file.value.type && file.value.type.startsWith('image/'))
const fileSizeStr = computed(() => file.value ? (file.value.size > 1024*1024 ? (file.value.size/1024/1024).toFixed(2)+' MB' : (file.value.size/1024).toFixed(2)+' KB') : '')
const showFooterMenu = ref(false)
const showCloseConfirm = ref(false)
const closeTaskId = ref(null)
const disableUpload = computed(() => {
  // 只要是"对话"或"自动(对话)"模式就禁用上传
  return currentTask.value.selectedMode === '对话' || currentTask.value.selectedMode === '自动(对话)'
})

// 新建任务
function createTask(mode) {
  const id = 'task_' + (taskIdSeed++)
  const task = {
    id,
    title: mode + '任务',
    mode,
    selectedMode: mode,
    messages: [],
    aiMetaList: []
  }
  tasks.value.unshift(task)
  currentTaskId.value = id
  showTaskDropdown.value = false
  input.value = ''
  file.value = null
  fileName.value = ''
}
// 选择任务
function selectTask(id) {
  currentTaskId.value = id
  input.value = ''
  file.value = null
  fileName.value = ''
}
// 当前任务对象
const currentTask = computed(() => {
  return tasks.value.find(t => t.id === currentTaskId.value) || {
    id: '',
    title: '',
    mode: CHAT_MODE_LIST[0],
    selectedMode: CHAT_MODE_LIST[0],
    messages: [],
    aiMetaList: []
  }
})
function onFileChange(e) {
  const inputEl = e.target
  file.value = inputEl.files[0] || null
  fileName.value = file.value ? file.value.name : ''
  if (file.value && file.value.type && file.value.type.startsWith('image/')) {
    fileUrl.value = URL.createObjectURL(file.value)
  } else {
    fileUrl.value = ''
  }
  // 关键：重置 input 的 value，保证同一个文件可以重复上传
  inputEl.value = ''
}
function removeFile() {
  file.value = null
  fileName.value = ''
  fileUrl.value = ''
}
function scrollToBottom() {
  nextTick(() => {
    const msgList = document.querySelector('.chat-messages')
    if (msgList) msgList.scrollTop = msgList.scrollHeight
  })
}
// 发送AI对话请求（带文件上传）
async function sendAIChat() {
  const text = input.value.trim()
  if ((!text && !file.value) || sending.value) return
  sending.value = true
  const token = localStorage.getItem('access_token')
  const formData = new FormData()
  formData.append('text', text)
  formData.append('request_type', CHAT_MODE_MAP[currentTask.value.selectedMode])
  formData.append('access_token', token)
  if (file.value) {
    formData.append('file', file.value)
  }
  try {
    if (text) {
      currentTask.value.messages.push({ role: 'user', content: text })
      input.value = ''
      scrollToBottom()
      // 如果是该任务的第一条消息，则用前五个字更新卡片标题
      if (currentTask.value.messages.length === 1) {
        const preview = text.slice(0, 5)
        if (preview) {
          currentTask.value.title = preview
        }
      }
    }
    // 发送后清空文件，允许再次上传
    file.value = null
    fileName.value = ''
    fileUrl.value = ''
    currentTask.value.messages.push({ role: 'ai', content: '加载中...' })
    currentTask.value.aiMetaList.push(null)
    const loadingMsgIdx = currentTask.value.messages.length - 1
    await nextTick()
    scrollToBottom()
    const res = await fetch(`${BASE_URL}${AI_CHAT_STREAM_API}`, {
      method: 'POST',
      body: formData
    })
    if (res.status === 401) {
      router.push('/login')
      return
    }
    const isStream = res.headers.get('X-Stream') === 'true'
    if (!res.ok) throw new Error('请求失败')
    if (isStream) {
      let fullContent = ''
      let lastDocUrl = ''
      const reader = res.body.getReader()
      const decoder = new TextDecoder('utf-8')
      let done = false
      while (!done) {
        const { value, done: doneReading } = await reader.read()
        done = doneReading
        if (value) {
          let chunk = decoder.decode(value).trim()
          if (!chunk) continue
          let lines = chunk.split(/\r?\n/)
          for (const line of lines) {
            if (!line.trim()) continue
            let cleanLine = line.trim()
            if (cleanLine.startsWith('data:')) {
              cleanLine = cleanLine.slice(5).trim()
            }
            try {
              const resp = JSON.parse(cleanLine)
              const newContent = resp.data || ''
              if (newContent) {
                fullContent += newContent
                currentTask.value.messages[loadingMsgIdx].content = fullContent
                scrollToBottom()
              }
              if (resp.meta && resp.meta.doc_url) {
                lastDocUrl = resp.meta.doc_url
              }
            } catch (e) {
              console.error('流式响应解析失败:', cleanLine, e)
            }
          }
        }
      }
      if (lastDocUrl) {
        currentTask.value.messages.push({ role: 'ai', content: { type: 'download', url: lastDocUrl } })
        currentTask.value.aiMetaList.push(null)
        scrollToBottom()
      }
    } else {
      const text = await res.text()
      let data
      try {
        const lines = text.split('\n').map(l => l.trim()).filter(Boolean)
        const lastLine = lines[lines.length - 1]
        data = JSON.parse(lastLine)
      } catch (e) {
        console.error('原始响应体不是合法JSON:', text)
        throw new Error('返回内容不是合法JSON')
      }
      const requestType = CHAT_MODE_MAP[currentTask.value.selectedMode]
      if (requestType === 'excel') {
        currentTask.value.messages.splice(loadingMsgIdx, 1)
        currentTask.value.aiMetaList.splice(loadingMsgIdx, 1)
        currentTask.value.messages.push({ role: 'ai', content: { type: 'download', url: data.data } })
        currentTask.value.aiMetaList.push(null)
        scrollToBottom()
      } else {
        currentTask.value.messages[loadingMsgIdx].content = data.data ?? '[无AI回复内容]'
        currentTask.value.aiMetaList[loadingMsgIdx] = null
        scrollToBottom()
      }
    }
  } catch (err) {
    alert('请求失败，请重试')
  } finally {
    sending.value = false
  }
}
function handleKeydown(e) {
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
    sendAIChat()
  }
}
async function downloadDoc(url) {
  // 前端兜底修复0.0.0.0为localhost
  url = url.replace('0.0.0.0', 'localhost')
  const access_token = localStorage.getItem('access_token')
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${access_token}`
      }
    })
    if (res.status === 401) {
      router.push('/login')
      return
    }
    if (!res.ok) throw new Error('下载失败')
    const blob = await res.blob()
    const filename = url.split('/').pop() || '下载文件'
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(link.href)
  } catch (err) {
    alert('下载失败，请重试')
  }
}
function logout() {
  localStorage.removeItem('access_token')
  router.push('/')
}
function openCloseConfirm(id) {
  closeTaskId.value = id
  showCloseConfirm.value = true
}
function confirmCloseTask() {
  const idx = tasks.value.findIndex(t => t.id === closeTaskId.value)
  if (idx !== -1) {
    tasks.value.splice(idx, 1)
    // 如果当前关闭的是选中的任务，自动切换到下一个或无
    if (currentTaskId.value === closeTaskId.value) {
      if (tasks.value.length > 0) {
        currentTaskId.value = tasks.value[0].id
      } else {
        currentTaskId.value = null
      }
    }
  }
  showCloseConfirm.value = false
  closeTaskId.value = null
}
</script>

<style scoped>
/* 聊天区顶部左上角logo样式 */
.chat-logo-inline {
  width: 100%;
  max-width: 700px;
  margin: 0 auto;
  display: flex;
  align-items: flex-start;
  padding-left: 0;
  padding-top: 8px;
  padding-bottom: 0;
  justify-content: flex-start;
}
.corner-logo-small {
  font-family: '阿里妈妈刀隶体 Regular', sans-serif;
  font-size: 1.25rem;
  color: #222;
  font-weight: bold;
  letter-spacing: 2px;
  user-select: none;
  pointer-events: auto;
  transition: color 0.25s cubic-bezier(.4,0,.2,1);
  margin-left: 0;
  margin-bottom: 0;
  margin-top: 0;
}
.corner-logo-small:hover {
  color: #22C55E;
}
.ai-chat-main {
  display: flex;
  height: 100vh;
  width: 100vw;
  background: #f6f8fa;
}
.sidebar {
  width: 320px;
  min-width: 220px;
  background: #fff;
  border-right: 1.5px solid #e6eaf0;
  box-shadow: 2px 0 16px #22C55E0a;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding: 0 0 0 0;
  position: relative;
  z-index: 2;
  transition: width 0.25s cubic-bezier(.4,0,.2,1);
}
.sidebar.collapsed {
  width: 56px;
  min-width: 56px;
}
.sidebar-header {
  padding: 18px 12px 12px 12px;
  border-bottom: 1.5px solid #e6eaf0;
  background: #fafdff;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 0;
}
.sidebar.collapsed .sidebar-header .new-task-btn,
.sidebar.collapsed .sidebar-header .task-dropdown {
  display: none !important;
}
.sidebar-toggle-btn, .new-task-btn {
  width: 100%;
  margin-bottom: 0;
}
.sidebar-toggle-btn {
  background: none;
  border: none;
  padding: 0 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: background 0.2s;
}
.sidebar-toggle-btn:hover svg rect {
  fill: #22C55E;
}
.new-task-btn {
  flex: 1 1 auto;
  min-width: 0;
  padding: 7px 0;
  background: #e6eaf0;
  color: #22C55E;
  font-size: 0.98rem;
  font-weight: 500;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  box-shadow: 0 1px 4px #22C55E11;
  letter-spacing: 1px;
}
.new-task-btn:hover {
  background: #22C55E;
  color: #fff;
}
.task-dropdown {
  position: absolute;
  left: 0;
  top: 44px;
  width: 100%;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 32px #22C55E22;
  border: 1.5px solid #e6eaf0;
  z-index: 10;
  padding: 8px 0;
}
.task-dropdown-item {
  padding: 12px 18px;
  color: #22C55E;
  font-size: 1.05rem;
  cursor: pointer;
  transition: background 0.18s, color 0.18s;
  border-radius: 8px;
}
.task-dropdown-item:hover {
  background: #f6f8fa;
  color: #16a34a;
}
.task-list {
  flex: 1 1 auto;
  overflow-y: auto;
  padding: 18px 0 0 0;
  background: #fff;
  padding-left: 18px;
}
.task-list.centered {
  justify-content: center;
  align-items: center;
  display: flex;
  flex-direction: column;
}
.task-card {
  background: #fafdff;
  border-radius: 10px;
  margin: 0 8px 16px 8px;
  padding: 14px 10px 10px 10px;
  box-shadow: 0 2px 8px #22C55E0a;
  border: 1.5px solid #e6eaf0;
  cursor: pointer;
  transition: border 0.2s, box-shadow 0.2s, background 0.2s;
  display: flex;
  flex-direction: column;
  gap: 4px;
  position: relative;
}
.task-card.active {
  border: 2px solid #22C55E;
  background: #f3fef6;
  box-shadow: 0 4px 16px #22C55E22;
}
.task-title {
  font-size: 1.08rem;
  font-weight: bold;
  color: #222;
  margin-bottom: 2px;
}
.task-type {
  font-size: 0.98rem;
  color: #22C55E;
  opacity: 0.7;
}
.upload-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  padding: 0 8px 0 0;
  margin-right: 4px;
  cursor: pointer;
  transition: background 0.2s;
  position: relative;
}
.upload-btn input[type="file"] {
  display: none;
}
.upload-btn.disabled {
  pointer-events: none;
  opacity: 0.5;
}
.file-name {
  color: #22C55E;
  font-size: 0.98rem;
  margin-right: 8px;
}
/* 新增：现代曲别针上传按钮样式 */
.modern-upload-btn {
  width: 32px;
  height: 32px;
  border-radius: 999px;
  border: 1.5px solid #e6eaf0;
  background: #fff;
  box-shadow: 0 1px 4px #22C55E11;
  padding: 0;
  margin-right: 10px;
  transition: border 0.2s, background 0.2s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.modern-upload-btn svg {
  stroke: #888;
  transition: stroke 0.2s;
}
.modern-upload-btn:hover {
  border-color: #22C55E;
  background: #f6f8fa;
}
.modern-upload-btn:hover svg {
  stroke: #22C55E;
}
/* 右侧对话区 */
.chat-section {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f6f8fa;
  position: relative;
  align-items: center;
}
/* 聊天历史记录区，紧贴顶部 */
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
  justify-content: center;
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
  margin-left: auto;
  margin-right: auto;
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
  align-items: center;
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
  margin-left: auto;
  margin-right: auto;
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
.file-card-area {
  width: 100%;
  max-width: 700px;
  min-width: 320px;
  margin-bottom: 8px;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  margin-left: auto;
  margin-right: auto;
}
.file-card-area-above {
  margin-bottom: 8px;
  margin-top: 0;
  justify-content: flex-start;
}
.file-card {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 4px 16px 0 #0001, 0 1.5px 4px #22C55E11;
  border: 1.5px solid #e6eaf0;
  padding: 8px 16px 8px 8px;
  min-width: 0;
  max-width: 340px;
  position: relative;
  transition: box-shadow 0.2s;
}
.file-thumb {
  width: 38px;
  height: 38px;
  border-radius: 8px;
  background: #f6f8fa;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex-shrink: 0;
}
.file-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}
.file-info {
  flex: 1 1 auto;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.file-name-ellipsis {
  font-size: 0.98rem;
  color: #222;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 180px;
}
.file-size {
  font-size: 0.88rem;
  color: #888;
}
.file-remove-btn {
  background: none;
  border: none;
  border-radius: 999px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.18s;
  margin-left: 4px;
}
.file-remove-btn:hover {
  background: #f6f8fa;
}
.file-remove-btn svg {
  stroke: #888;
  transition: stroke 0.18s;
}
.file-remove-btn:hover svg {
  stroke: #e74c3c;
}
.file-card-area-inside-bar {
  width: 100%;
  margin-bottom: 8px;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
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
.modern-chat-input-bar {
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  gap: 12px;
  width: 100%;
  flex-wrap: wrap;
}
.file-card-area-inline {
  display: flex;
  align-items: center;
  margin-bottom: 0;
  margin-right: 8px;
  max-width: 260px;
  min-width: 0;
}
.file-card {
  margin-bottom: 0;
}
.chat-input {
  flex: 1 1 auto;
  min-width: 0;
  max-width: 100%;
}
.send-btn {
  flex-shrink: 0;
}
@media (max-width: 700px) {
  .modern-chat-input-bar {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }
  .file-card-area-inline {
    max-width: 100%;
    margin-right: 0;
    margin-bottom: 6px;
  }
}
.chat-input-bar-hasfile {
  flex-direction: row;
  align-items: flex-end;
}
.file-card-area-inbar {
  width: 100%;
  margin-bottom: 8px;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
}
.sidebar-header-row {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  margin-bottom: 0;
}
.sidebar-header-row-toggle {
  margin-bottom: 12px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
}
.sidebar-header-row-newtask {
  margin-bottom: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
}
.upload-btn-center {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 33px;
  margin-left: 10px;
  margin-bottom: 10px;
}
.sidebar-footer-setting {
  width: 100%;
  padding: 0 0 18px 18px;
  box-sizing: border-box;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  position: absolute;
  left: 0;
  bottom: 0;
  z-index: 10;
}
.footer-menu-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  min-height: 38px;
  z-index: 20;
}
.footer-menu-btn {
  background: none;
  border: none;
  border-radius: 8px;
  width: 38px;
  height: 33px;
  margin-left: 10px;
  z-index: 21;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.18s;
}
.footer-menu-btn:hover {
  background: #f6f8fa;
}
.footer-menu-pop {
  position: absolute;
  left: 0;
  bottom: 33px;
  min-width: 120px;
  background: #fff;
  border: 1px solid #e6eaf0;
  border-radius: 10px;
  box-shadow: 0 4px 24px #0002;
  z-index: 22;
  padding: 8px 0;
  pointer-events: auto;
}
.footer-menu-item {
  padding: 10px 18px;
  color: #e74c3c;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.18s;
  border-radius: 8px;
}
.footer-menu-item:hover {
  background: #f6f8fa;
}
.chat-empty-tip {
  width: 100%;
  height: 100%;
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  color: #bbb;
  font-weight: 500;
  letter-spacing: 2px;
  background: transparent;
  user-select: none;
}
.task-close-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  background: none;
  border: none;
  border-radius: 50%;
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.18s;
  z-index: 2;
}
.task-close-btn svg {
  stroke: #888;
  transition: stroke 0.18s;
}
.task-close-btn:hover {
  background: #f6f8fa;
}
.task-close-btn:hover svg {
  stroke: #e74c3c;
}
.close-confirm-mask {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.18);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}
.close-confirm-dialog {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 8px 32px #0002;
  padding: 36px 32px 28px 32px;
  min-width: 280px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.close-confirm-title {
  font-size: 1.18rem;
  color: #222;
  font-weight: 500;
  margin-bottom: 24px;
}
.close-confirm-actions {
  display: flex;
  gap: 18px;
}
.close-confirm-btn {
  min-width: 64px;
  padding: 8px 0;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.18s, color 0.18s;
}
.close-confirm-btn-yes {
  background: #e74c3c;
  color: #fff;
}
.close-confirm-btn-yes:hover {
  background: #c0392b;
}
.close-confirm-btn-no {
  background: #f6f8fa;
  color: #222;
}
.close-confirm-btn-no:hover {
  background: #e6eaf0;
}
.download-tip {
  color: #888;
  font-size: 0.98rem;
  margin-top: 4px;
  margin-left: 2px;
}
.bubble-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-bottom: 0;
}
.bubble-wrapper-user {
  align-items: flex-end;
}
.bubble-wrapper-ai {
  align-items: flex-start;
}
.bubble-label {
  font-size: 0.92rem;
  color: #aaa;
  margin-bottom: 2px;
  user-select: none;
  line-height: 1.2;
  text-align: left;
  margin-right: 40px;
}
.sidebar-toggle-svg {
  stroke: #888;
  transition: stroke 0.2s;
}
</style> 