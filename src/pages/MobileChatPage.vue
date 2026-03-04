<template>
  <div class="mobile-chat-page">
    <div class="mobile-chat-page__header">
      <button class="mobile-chat-page__back" @click="handleBack">
        ← Назад
      </button>
      <h3>{{ activeChat?.name }}</h3>
    </div>
    <ChatWindow />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useChatStore } from '@/stores/chatStore'
import ChatWindow from '@/components/ChatWindow.vue'

export default defineComponent({
  name: 'MobileChatPage',
  components: {
    ChatWindow
  },
  setup () {
    const router = useRouter()
    const route = useRoute()
    const chatStore = useChatStore()
    const { activeChat } = storeToRefs(chatStore)

    onMounted(() => {
      const chatId = Number(route.params.id)
      if (chatId) {
        chatStore.setActiveChat(chatId)
      }
    })

    const handleBack = () => {
      router.back()
    }

    return {
      activeChat,
      handleBack
    }
  }
})
</script>

<style scoped lang="scss">
.mobile-chat-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: var(--bg-secondary);

  &__header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    background: var(--bg-primary);
    border-bottom: 1px solid var(--border-color);

    h3 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      flex: 1;
    }
  }

  &__back {
    padding: 8px 12px;
    background: transparent;
    border: none;
    font-size: 16px;
    color: #2196f3;
    cursor: pointer;
    transition: opacity 0.2s;

    &:hover {
      opacity: 0.7;
    }

    &:active {
      opacity: 0.5;
    }
  }

  :deep(.chat-window) {
    flex: 1;
    height: auto;

    .chat-window__header {
      display: none;
    }
  }
}
</style>
