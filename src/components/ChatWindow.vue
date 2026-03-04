<template>
  <div class="chat-window" :style="{ background: wallpaperStyle }">
    <div v-if="!activeChatId" class="chat-window__empty">
      <p>Выберите чат</p>
    </div>
    <template v-else>
      <div class="chat-window__header">
        <h3>{{ activeChat?.name }}</h3>
        <div class="chat-window__controls">
          <button
            v-for="(gradient, key) in wallpapers"
            :key="key"
            class="chat-window__wallpaper-btn"
            :class="{ 'chat-window__wallpaper-btn--active': wallpaper === key }"
            :style="{ background: gradient }"
            @click="setWallpaper(key as any)"
            :title="`Обои ${key.slice(-1)}`"
          />
        </div>
      </div>
      <div ref="messagesContainer" class="chat-window__messages">
        <transition-group name="message-fade" tag="div" class="messages-list">
          <div
            v-for="message in activeChatMessages"
            :key="message.id"
            class="message"
            :class="`message--${message.type}`"
          >
            <div class="message__bubble">
              <div class="message__text" v-html="formatMessage(message.text)" />
              <div class="message__time">{{ formatTime(message.createdAt) }}</div>
            </div>
          </div>
        </transition-group>
      </div>
      <div class="chat-window__input">
        <textarea
          v-model="messageText"
          class="chat-window__textarea"
          placeholder="Введите сообщение..."
          rows="1"
          @keydown.enter="handleKeyDown"
        />
        <button
          class="chat-window__button"
          :disabled="!messageText.trim()"
          @click="handleSend"
        >
          Отправить
        </button>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, nextTick, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useChatStore } from '@/stores/chatStore'
import { useThemeStore, wallpapers, type Wallpaper } from '@/stores/themeStore'

export default defineComponent({
  name: 'ChatWindow',
  setup () {
    const chatStore = useChatStore()
    const themeStore = useThemeStore()
    const { activeChatId, activeChat, activeChatMessages } = storeToRefs(chatStore)
    const { wallpaper } = storeToRefs(themeStore)

    const messageText = ref('')
    const messagesContainer = ref<HTMLElement | null>(null)

    const wallpaperStyle = computed(() => wallpapers[wallpaper.value])

    const setWallpaper = (newWallpaper: Wallpaper) => {
      themeStore.setWallpaper(newWallpaper)
    }

    const formatMessage = (text: string): string => {
      let formatted = text
      formatted = formatted.replace(/</g, '&lt;').replace(/>/g, '&gt;')
      formatted = formatted.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      formatted = formatted.replace(/\*(.+?)\*/g, '<em>$1</em>')
      formatted = formatted.replace(/\n/g, '<br>')
      return formatted
    }

    const formatTime = (dateString: string) => {
      const date = new Date(dateString)
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      return `${hours}:${minutes}`
    }

    const scrollToBottom = () => {
      nextTick(() => {
        if (messagesContainer.value) {
          messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
        }
      })
    }

    const handleSend = () => {
      if (!messageText.value.trim()) return

      chatStore.sendMessage(messageText.value)
      messageText.value = ''
      scrollToBottom()
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault()
        handleSend()
      }
    }

    watch(activeChatMessages, () => {
      scrollToBottom()
    }, { deep: true })

    watch(activeChatId, () => {
      scrollToBottom()
    })

    return {
      activeChatId,
      activeChat,
      activeChatMessages,
      messageText,
      messagesContainer,
      wallpaper,
      wallpapers,
      wallpaperStyle,
      formatMessage,
      formatTime,
      handleSend,
      handleKeyDown,
      setWallpaper
    }
  }
})
</script>

<style scoped lang="scss">
.chat-window {
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
  transition: background 0.3s ease;

  &__empty {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: var(--text-secondary);
    font-size: 18px;
    background: var(--bg-secondary);
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px;
    background: var(--bg-primary);
    border-bottom: 1px solid var(--border-color);

    h3 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
    }
  }

  &__controls {
    display: flex;
    gap: 8px;
  }

  &__wallpaper-btn {
    width: 32px;
    height: 32px;
    border: 2px solid transparent;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      transform: scale(1.1);
      border-color: rgba(255, 255, 255, 0.5);
    }

    &--active {
      border-color: var(--text-primary);
      box-shadow: 0 0 0 2px var(--bg-primary);
    }
  }

  &__messages {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
  }

  &__input {
    display: flex;
    gap: 12px;
    padding: 16px 20px;
    background: var(--bg-primary);
    border-top: 1px solid var(--border-color);
  }

  &__textarea {
    flex: 1;
    padding: 10px 12px;
    border: 1px solid var(--border-color);
    border-radius: 8px;
    font-family: inherit;
    font-size: 14px;
    resize: none;
    outline: none;
    min-height: 40px;
    max-height: 120px;
    background: var(--bg-primary);
    color: var(--text-primary);

    &:focus {
      border-color: #2196f3;
    }
  }

  &__button {
    padding: 10px 20px;
    background: #2196f3;
    color: #fff;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s;

    &:hover:not(:disabled) {
      background: #1976d2;
    }

    &:disabled {
      background: #e0e0e0;
      color: #9e9e9e;
      cursor: not-allowed;
    }
  }
}

.messages-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.message {
  display: flex;

  &--incoming {
    justify-content: flex-start;

    .message__bubble {
      background: var(--message-incoming-bg);
      color: var(--message-incoming-text);
      border-radius: 12px 12px 12px 4px;
    }
  }

  &--outgoing {
    justify-content: flex-end;

    .message__bubble {
      background: var(--message-outgoing-bg);
      color: var(--message-outgoing-text);
      border-radius: 12px 12px 4px 12px;
    }
  }

  &__bubble {
    max-width: 60%;
    padding: 10px 14px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }

  &__text {
    font-size: 14px;
    line-height: 1.4;
    word-wrap: break-word;

    :deep(strong) {
      font-weight: 600;
    }

    :deep(em) {
      font-style: italic;
    }
  }

  &__time {
    font-size: 11px;
    margin-top: 4px;
    opacity: 0.7;
    text-align: right;
  }
}

.message-fade-enter-active {
  transition: all 0.3s ease-out;
}

.message-fade-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.message-fade-enter-to {
  opacity: 1;
  transform: translateY(0);
}
</style>
