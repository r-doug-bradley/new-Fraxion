<!-- ChatPage.vue -->
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import TeamsChatKendo from '@/components/TeamsKendo.vue';

// ---------------------------------------------
// Types
// ---------------------------------------------
interface TeamsLikeMessage {
  id: string;
  body: string;
  fromName: string;
  fromInitials: string;
  fromMe: boolean;
  created: string;
}

// A chat list item
interface TeamsChatItem {
  id: string;
  title: string;
  subtitle?: string;
  messages: TeamsLikeMessage[];
}

// ---------------------------------------------
// State
// ---------------------------------------------
const chats = ref<TeamsChatItem[]>([]);
const activeChat = ref<TeamsChatItem | null>(null);
const sending = ref(false);

// ---------------------------------------------
// Load chats (Graph API placeholder)
// ---------------------------------------------
async function loadChats() {
  // Example fake data — replace with your Graph call:
  chats.value = [
    {
      id: 'chat-1',
      title: 'Project Alpha',
      subtitle: 'Team Chat',
      messages: []
    },
    {
      id: 'chat-2',
      title: 'DevOps Team',
      subtitle: 'Channel Chat',
      messages: []
    }
  ];

  // Auto-select first chat
  activeChat.value = chats.value[0];
}

// ---------------------------------------------
// Load messages for the selected chat
// ---------------------------------------------
async function loadMessages(chatId: string) {
  // CALL Graph → GET /chats/{chatId}/messages
  // Convert Graph payload → TeamsLikeMessage[]
  const graphMessages: TeamsLikeMessage[] = [
    {
      id: '1',
      body: 'Welcome to the chat!',
      fromName: 'System Bot',
      fromInitials: 'SB',
      fromMe: false,
      created: '10:00 AM'
    }
  ];

  const chat = chats.value.find(c => c.id === chatId);
  if (chat) chat.messages = graphMessages;
}

// ---------------------------------------------
// Handle sending messages
// ---------------------------------------------
async function handleSend(text: string) {
  if (!activeChat.value) return;

  sending.value = true;
  try {
    // CALL Graph → POST message
    // Then reload messages:
    await loadMessages(activeChat.value.id);
  } finally {
    sending.value = false;
  }
}

// ---------------------------------------------
onMounted(async () => {
  await loadChats();              // loads chat list
  await loadMessages(activeChat.value!.id);  // loads first chat's messages
});
</script>

<template>
  <div class="flex h-full w-full">
    <!-- --------------------- -->
    <!-- Left panel: chat list -->
    <!-- --------------------- -->
    <aside class="w-64 border-r k-border-color flex flex-col">
      <div class="px-4 py-3 font-semibold text-sm">Chats</div>

      <div class="flex-1 overflow-y-auto">
        <div
          v-for="chat in chats"
          :key="chat.id"
          class="px-4 py-2 cursor-pointer hover:bg-gray-100"
          :class="activeChat?.id === chat.id ? 'bg-gray-200 font-semibold' : ''"
          @click="activeChat = chat; loadMessages(chat.id)"
        >
          {{ chat.title }}
        </div>
      </div>
    </aside>

    <!-- --------------------- -->
    <!-- Right panel: chat pane -->
    <!-- --------------------- -->
    <main class="flex-1 min-w-0">
      <TeamsChatKendo
        v-if="activeChat"
        :title="activeChat.title"
        :subtitle="activeChat.subtitle"
        :messages="activeChat.messages"
        :sending="sending"
        @send="handleSend"
      />
    </main>
  </div>
</template>
