<template>
  <!-- 右侧插画和装饰文字区域 -->
  <div class="right-content">
    <div class="avatar-center">
      <div class="avatar-select-panel">
        <div class="avatar-text-simple">
          <span>AI工具</span>
          <span class="avatar-text-divider">｜</span>
          <span>作者简介</span>
        </div>
        <div class="avatar-left-group">
          <div class="avatar-btn avatar-left-btn" ref="leftAvatarRef" @click="toggleForm">
            <img class="avatar avatar-left" src="/illustration.png" alt="左头像" />
          </div>
          <transition name="fade">
            <div
              v-show="showForm"
              class="form-card-animate form-card-fixed"
              :style="formCardStyle"
            >
              <FormCard />
            </div>
          </transition>
        </div>
        <div class="avatar-divider"></div>
        <div class="avatar-btn avatar-right-btn">
          <img class="avatar avatar-right" src="/illustration.png" alt="右头像" />
        </div>
      </div>
      <!-- 绿色文字，头像下方居中显示 -->
      <div class="green-text">————技术为服务而存在————</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, onMounted, onBeforeUnmount } from 'vue'
import FormCard from './FormCard.vue'

const showForm = ref(false)
const leftAvatarRef = ref(null)
const formCardStyle = computed(() => {
  if (!showForm.value || !leftAvatarRef.value) return { display: 'none' }
  return {
    position: 'absolute',
    right: 'calc(100% + 24px)', // 头像左侧24px间距
    top: '50%',
    transform: 'translateY(-50%)',
    minWidth: '320px',
    zIndex: 1
  }
})
function toggleForm() {
  showForm.value = !showForm.value
  if (showForm.value) {
    nextTick(() => {
      const input = document.querySelector('.form-card-animate input')
      if (input) input.focus()
    })
  }
}
function handleEsc(e) {
  if (showForm.value && (e.key === 'Escape' || e.key === 'Esc')) {
    showForm.value = false
  }
}
onMounted(() => {
  window.addEventListener('keydown', handleEsc)
})
onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleEsc)
})
</script>

<style scoped>
.right-content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
}
.avatar-center {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.avatar-select-panel {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 100vw;
  gap: 32px;
}
.avatar-left-group {
  position: relative;
  display: flex;
  align-items: center;
}
.form-card-fixed {
  position: absolute;
  right: calc(100% + 24px);
  top: 50%;
  transform: translateY(-50%);
  min-width: 320px;
  z-index: 1;
}
.avatar-btn {
  width: 180px;
  height: 180px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin: 0;
  z-index: 2;
}
.avatar-btn:hover .avatar {
  box-shadow: 0 8px 32px #22C55E44;
}
.avatar {
  width: 180px;
  height: 180px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 8px 32px rgba(34, 197, 94, 0.12);
  background: #fff;
  border: 4px solid #fff;
  margin: 0;
  z-index: 2;
}
.form-card-animate {
  min-width: 320px;
  z-index: 1;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
.green-text {
  margin-top: 50px;
  color: #22c55e4a;
  font-size: 20px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
}
.avatar-text-simple {
  position: absolute;
  top: -32px;
  left: 50.6%;
  transform: translateX(-50%);
  width: 384px;
  text-align: center;
  font-size: 14px;
  color: #888;
  white-space: nowrap;
  z-index: 10;
  pointer-events: none;
}
.avatar-text-divider {
  color: #bbb;
  margin: 0 6px;
  font-weight: bold;
}
.avatar-divider {
  width: 4px;
  height: 60px;
  background: #e0e0e0;
  border-radius: 2px;
  margin: 0 8px;
  opacity: 0.7;
}
@media (max-width: 900px) {
  .right-content {
    min-width: 0;
    min-height: 0;
  }
  .avatar-select-panel {
    flex-direction: column;
    position: static;
    transform: none;
    width: 100vw;
    height: auto;
    justify-content: center;
    align-items: center;
    gap: 24px;
  }
  .form-card-animate {
    margin-right: 0;
    margin-top: 16px;
  }
}
</style> 