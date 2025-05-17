// 全局路由路径常量，便于统一维护和修改
// 如需调整路由结构，只需修改此处即可

export const BASE_URL = 'http://localhost:8000'


export const ROOT_PATH = '/'
export const LOGIN_PATH = '/login'
export const AI_CHAT_PATH = '/ai_chat'
export const NOT_FOUND_PATH = '/:pathMatch(.*)*'

// 聊天模式下拉框的全局选项列表
export const CHAT_MODE_LIST = [
  '自动(对话)',
  '对话',
  'Excel',
  'Word',
  '思想汇报'
]

// 聊天模式下拉框展示值到后端值的映射
export const CHAT_MODE_MAP = {
  '自动(对话)': 'chat',
  '对话': 'chat',
  'Excel': 'excel',
  'Word': 'word',
  '思想汇报': 'mind_summarize'
}

// 后端API接口路径常量，便于统一维护和引用
export const LOGIN_API = '/api/v1/login'
export const REGISTER_API = '/api/v1/register'
export const AI_CHAT_API = '/api/v1/ai_chat'
export const AI_CHAT_STREAM_API = '/api/v1/ai_chat/stream' 