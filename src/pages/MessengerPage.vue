<template>
  <div class="messenger">
    <ChatList />
    <ChatWindow />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ChatList from '@/components/ChatList.vue'
import ChatWindow from '@/components/ChatWindow.vue'

export default defineComponent({
  name: 'MessengerPage',
  components: {
    ChatList,
    ChatWindow
  }
})
</script>

<style scoped lang="scss">
.messenger {
  display: flex;
  height: 100vh;
  overflow: hidden;
  background: var(--bg-secondary);

  :deep(.chat-list) {
    width: 300px;
    border-right: 1px solid var(--border-color);
  }

  :deep(.chat-window) {
    flex: 1;
  }

  @media (max-width: 767px) {
    :deep(.chat-list) {
      width: 100%;
      border-right: none;
    }

    :deep(.chat-window) {
      display: none;
    }
  }
}
</style>
