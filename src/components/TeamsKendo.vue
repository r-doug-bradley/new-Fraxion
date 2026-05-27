<!-- src/components/TeamsChatKendo.vue -->
<script setup lang="ts">
import { ref, watch, onMounted, nextTick } from 'vue';
import { Card } from '@progress/kendo-vue-layout';
import { Avatar } from '@progress/kendo-vue-layout';
import { TextArea } from '@progress/kendo-vue-inputs';
import { Button } from '@progress/kendo-vue-buttons';

interface TeamsLikeMessage {
  id: string;
  body: string;
  fromName: string;
  fromInitials: string;
  fromMe: boolean;
  created: string;
  avatarUrl?: string;
}

const props = defineProps<{
  title: string;
  subtitle?: string;
  messages: TeamsLikeMessage[];
  sending?: boolean;
}>();

const emit = defineEmits<{
  (e: 'send', text: string): void;
}>();

const draft = ref('');
const scrollContainer = ref<HTMLElement | null>(null);

function doSend() {
  const text = draft.value.trim();
  if (!text) return;
  emit('send', text);
  draft.value = '';
}

function scrollToBottom() {
  if (!scrollContainer.value) return;
  const el = scrollContainer.value;
  el.scrollTop = el.scrollHeight;
}

onMounted(() => {
  nextTick(scrollToBottom);
});

watch(
  () => props.messages.length,
  async () => {
    await nextTick();
    scrollToBottom();
  }
);
</script>

<template>
  <!-- Outer card -->
  <Card
    class="flex flex-col h-full w-full"
    :style="{ padding: 0 }"
  >
    <!-- Header (Teams-like top bar) -->
    <header
      class="flex items-center gap-3 px-4 py-3 border-b k-border-color"
    >
      <Avatar
        :text="title"
        :shape="'square'"
        :type="'image'"
        :fill="'solid'"
      />
      <div class="flex flex-col">
        <div class="font-semibold text-sm">
          {{ title }}
        </div>
        <div class="text-xs k-text-secondary">
          {{ subtitle || 'Chat' }}
        </div>
      </div>

      <div class="ml-auto flex items-center gap-2 text-xs k-text-secondary">
        <span class="inline-block w-2 h-2 rounded-full bg-green-500"></span>
        Available
      </div>
    </header>

    <!-- Messages area -->
    <div
      ref="scrollContainer"
      class="flex-1 overflow-y-auto px-4 py-3 space-y-3 text-sm k-bg-alt"
    >
      <template v-for="msg in messages" :key="msg.id">
        <div
          class="flex gap-2"
          :class="msg.fromMe ? 'justify-end' : 'justify-start'"
        >
          <!-- Left side: other user -->
          <template v-if="!msg.fromMe">
            <Avatar
              class="mt-1 flex-shrink-0"
              :text="msg.fromInitials"
              :shape="'circle'"
              :size="'small'"
            />

            <div class="max-w-[70%]">
              <div class="flex items-baseline gap-2">
                <span class="font-semibold text-xs">
                  {{ msg.fromName }}
                </span>
                <span class="text-[10px] k-text-secondary">
                  {{ msg.created }}
                </span>
              </div>
              <div
                class="mt-1 rounded-2xl px-3 py-2 k-bg-base k-border-color border"
              >
                {{ msg.body }}
              </div>
            </div>
          </template>

          <!-- Right side: me -->
          <template v-else>
            <div class="max-w-[70%] text-right">
              <div class="flex items-baseline justify-end gap-2">
                <span class="text-[10px] k-text-secondary">
                  {{ msg.created }}
                </span>
                <span class="font-semibold text-xs">
                  {{ msg.fromName }}
                </span>
              </div>
              <div
                class="mt-1 rounded-2xl px-3 py-2 k-bg-primary k-color-white"
              >
                {{ msg.body }}
              </div>
            </div>

            <Avatar
              class="mt-1 flex-shrink-0"
              :text="msg.fromInitials"
              :shape="'circle'"
              :size="'small'"
            />
          </template>
        </div>
      </template>
    </div>

    <!-- Composer -->
    <div class="px-3 pt-2 pb-3 border-t k-border-color">
      <!-- Toolbar row (emoji, attach, etc. placeholders) -->
      <div class="flex items-center gap-2 mb-2 text-xs k-text-secondary">
        <button
          type="button"
          class="w-7 h-7 rounded-full flex items-center justify-center hover:k-bg-alt"
        >
          🙂
        </button>
        <button
          type="button"
          class="w-7 h-7 rounded-full flex items-center justify-center hover:k-bg-alt"
        >
          📎
        </button>
        <button
          type="button"
          class="w-7 h-7 rounded-full flex items-center justify-center hover:k-bg-alt"
        >
          B
        </button>
      </div>

      <!-- Text area + send button -->
      <div class="flex gap-2 items-end">
        <TextArea
          class="flex-1"
          :rows="2"
          v-model="draft"
          placeholder="Type a new message"
          :auto-size="false"
        />

        <Button
          :primary="true"
          :disabled="!draft.trim() || sending"
          @click="doSend"
        >
          <span v-if="!sending">Send</span>
          <span v-else>Sending…</span>
        </Button>
      </div>
    </div>
  </Card>
</template>

<style scoped>
.k-bg-base {
  background-color: var(--kendo-color-surface, #ffffff);
}
.k-bg-alt {
  background-color: var(--kendo-color-subtle, #f5f5f5);
}
.k-text-secondary {
  color: var(--kendo-color-neutral-40, #6b7280);
}
.k-border-color {
  border-color: var(--kendo-color-border, #e5e7eb);
}
.k-bg-primary {
  background-color: var(--kendo-color-primary, #2563eb);
}
.k-color-white {
  color: #ffffff;
}
</style>
