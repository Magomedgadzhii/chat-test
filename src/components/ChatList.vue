<template>
  <div class="chat-list">
    <div class="chat-list__header">
      <h2>Чаты</h2>
      <button class="chat-list__theme-toggle" @click="toggleTheme" :title="theme === 'light' ? 'Темная тема' : 'Светлая тема'">
        {{ theme === 'light' ? '🌙' : '☀️' }}
      </button>
    </div>
    <div class="chat-list__items">
      <div
        v-for="chat in chats"
        :key="chat.id"
        class="chat-item"
        :class="{ 'chat-item--active': chat.id === activeChatId }"
        @click="handleChatClick(chat.id)"
      >
        <div class="chat-item__avatar">
          <div
            class="chat-item__status"
            :class="{ 'chat-item__status--online': chat.online }"
          />
        </div>
        <div class="chat-item__content">
          <div class="chat-item__header">
            <span class="chat-item__name">{{ chat.name }}</span>
            <div
              v-if="chat.unread"
              class="chat-item__unread"
            />
          </div>
          <div class="chat-item__message">{{ chat.lastMessage }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useChatStore } from '@/stores/chatStore'
import { useThemeStore } from '@/stores/themeStore'

export default defineComponent({
  name: 'ChatList',
  setup () {
    const chatStore = useChatStore()
    const themeStore = useThemeStore()
    const router = useRouter()
    const { chats, activeChatId } = storeToRefs(chatStore)
    const { theme } = storeToRefs(themeStore)

    onMounted(() => {
      chatStore.fetchChats()
    })

    const handleChatClick = (chatId: number) => {
      chatStore.setActiveChat(chatId)

      if (Math.random() > 0.5) {
        chatStore.toggleOnlineStatus(chatId)
      }

      if (window.innerWidth < 768) {
        router.push(`/chat/${chatId}`)
      }
    }

    const toggleTheme = () => {
      themeStore.toggleTheme()
    }

    return {
      chats,
      activeChatId,
      theme,
      handleChatClick,
      toggleTheme
    }
  }
})
</script>

<style scoped lang="scss">
.chat-list {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--bg-primary);

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px;
    border-bottom: 1px solid var(--border-color);

    h2 {
      margin: 0;
      font-size: 20px;
      font-weight: 600;
    }
  }

  &__theme-toggle {
    width: 36px;
    height: 36px;
    border: none;
    border-radius: 8px;
    background: var(--hover-bg);
    font-size: 18px;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      background: var(--active-bg);
      transform: scale(1.05);
    }

    &:active {
      transform: scale(0.95);
    }
  }

  &__items {
    flex: 1;
    overflow-y: auto;
  }
}

.chat-item {
  display: flex;
  padding: 12px 20px;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: var(--hover-bg);
  }

  &--active {
    background: var(--active-bg);

    &:hover {
      background: var(--active-bg);
    }
  }

  &__avatar {
    position: relative;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: #90caf9;
    flex-shrink: 0;
    margin-right: 12px;
  }

  &__status {
    position: absolute;
    bottom: 2px;
    right: 2px;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #9e9e9e;
    border: 2px solid #fff;

    &--online {
      background: #4caf50;
    }
  }

  &__content {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 4px;
  }

  &__name {
    font-weight: 500;
    font-size: 14px;
    color: var(--text-primary);
  }

  &__unread {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #f44336;
    flex-shrink: 0;
  }

  &__message {
    font-size: 13px;
    color: var(--text-secondary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
