import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Chat {
  id: number
  name: string
  online: boolean
  lastMessage: string
  unread: boolean
}

export interface Message {
  id: number
  text: string
  type: 'incoming' | 'outgoing'
  createdAt: string
}

const STORAGE_KEY = 'chat_messages'

const randomMessages = [
  'Привет!',
  'Как дела?',
  'Что нового?',
  'Отлично!',
  'Хорошо',
  'Понятно',
  'Спасибо!',
  'До встречи',
  'Пока!',
  'Интересно',
  'Согласен',
  'Не знаю',
  'Может быть',
  'Конечно!',
  'Давай',
  'Окей',
  'Супер',
  'Класс!',
  'Круто',
  'Ясно'
]

export const useChatStore = defineStore('chat', () => {
  const chats = ref<Chat[]>([])
  const messages = ref<Record<number, Message[]>>({})
  const activeChatId = ref<number | null>(null)

  const activeChat = computed(() => {
    if (!activeChatId.value) return null
    return chats.value.find(chat => chat.id === activeChatId.value) || null
  })

  const activeChatMessages = computed(() => {
    if (!activeChatId.value) return []
    return messages.value[activeChatId.value] || []
  })

  const loadMessagesFromStorage = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        messages.value = JSON.parse(stored)
      }
    } catch (error) {
    }
  }

  const saveMessagesToStorage = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.value))
    } catch (error) {
    }
  }

  const fetchChats = async () => {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/users')
      const users = await response.json()

      chats.value = users.slice(0, 5).map((user: any) => ({
        id: user.id,
        name: user.name,
        online: Math.random() > 0.5,
        lastMessage: 'Нет сообщений',
        unread: false
      }))
    } catch (error) {
    }
  }

  const generateMessages = (chatId: number) => {
    const newMessages: Message[] = []

    for (let i = 0; i < 20; i++) {
      const type = Math.random() > 0.5 ? 'incoming' : 'outgoing'
      const text = randomMessages[Math.floor(Math.random() * randomMessages.length)]
      const date = new Date()
      date.setMinutes(date.getMinutes() - (20 - i) * 5)

      newMessages.push({
        id: Date.now() + i,
        text,
        type,
        createdAt: date.toISOString()
      })
    }

    messages.value[chatId] = newMessages
    saveMessagesToStorage()

    const chat = chats.value.find(c => c.id === chatId)
    if (chat && newMessages.length > 0) {
      chat.lastMessage = newMessages[newMessages.length - 1].text
    }
  }

  const setActiveChat = (chatId: number) => {
    activeChatId.value = chatId

    if (!messages.value[chatId]) {
      generateMessages(chatId)
    }

    const chat = chats.value.find(c => c.id === chatId)
    if (chat) {
      chat.unread = false
    }
  }

  const sendMessage = (text: string) => {
    if (!text.trim() || !activeChatId.value) return

    const newMessage: Message = {
      id: Date.now(),
      text: text.trim(),
      type: 'outgoing',
      createdAt: new Date().toISOString()
    }

    if (!messages.value[activeChatId.value]) {
      messages.value[activeChatId.value] = []
    }

    messages.value[activeChatId.value].push(newMessage)
    saveMessagesToStorage()

    const chat = chats.value.find(c => c.id === activeChatId.value)
    if (chat) {
      chat.lastMessage = text.trim()
    }

    simulateReply()
  }

  const simulateReply = () => {
    const chatId = activeChatId.value
    if (!chatId) return

    const delay = Math.floor(Math.random() * 1000) + 1000

    setTimeout(() => {
      const replyMessage: Message = {
        id: Date.now(),
        text: 'Спасибо за сообщение!)',
        type: 'incoming',
        createdAt: new Date().toISOString()
      }

      if (!messages.value[chatId]) {
        messages.value[chatId] = []
      }

      messages.value[chatId].push(replyMessage)
      saveMessagesToStorage()

      const chat = chats.value.find(c => c.id === chatId)
      if (chat) {
        chat.lastMessage = replyMessage.text

        if (activeChatId.value !== chatId) {
          chat.unread = true
        }
      }
    }, delay)
  }

  const toggleOnlineStatus = (chatId: number) => {
    const chat = chats.value.find(c => c.id === chatId)
    if (chat) {
      chat.online = Math.random() > 0.5
    }
  }

  loadMessagesFromStorage()

  return {
    chats,
    messages,
    activeChatId,
    activeChat,
    activeChatMessages,
    fetchChats,
    generateMessages,
    setActiveChat,
    sendMessage,
    simulateReply,
    toggleOnlineStatus
  }
})
