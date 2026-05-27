<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue';
import type { Ref } from 'vue';

/** Props */
interface Props {
  /** Full URL of the bridge page (must be in validDomains) */
  bridgeUrl: string;
  /** Optional CSS height – defaults to 600px */
  height?: string;
  /** Optional CSS width – defaults to 100% */
  width?: string;
}
const props = withDefaults(defineProps<Props>(), {
  height: '600px',
  width: '100%',
});

/** Emits */
const emit = defineEmits<{
  (e: 'ready'): void;
  (e: 'error', err: any): void;
}>();

/** Internal */
const iframeRef: Ref<HTMLIFrameElement | null> = ref(null);
let messageHandler: ((e: MessageEvent) => void) | null = null;

/** Post a message to the iframe (used later for theme sync, etc.) */
const post = (data: any) => {
  iframeRef.value?.contentWindow?.postMessage(data, new URL(props.bridgeUrl).origin);
};

/** Listen for bridge → parent messages */
const setupListener = () => {
  messageHandler = (e: MessageEvent) => {
    if (e.origin !== new URL(props.bridgeUrl).origin) return;
    const { type, payload } = e.data ?? {};

    if (type === 'TEAMS_CHAT_READY') emit('ready');
    if (type === 'TEAMS_CHAT_ERROR') emit('error', payload);
  };
  window.addEventListener('message', messageHandler);
};

/** Cleanup */
onUnmounted(() => {
  if (messageHandler) window.removeEventListener('message', messageHandler);
});

/** Mount iframe */
onMounted(() => {
  setupListener();
  // Optional: forward Teams theme changes
  watch(() => props.bridgeUrl, () => post({ type: 'RELOAD' }));
});
</script>

<template>
  <iframe
    ref="iframeRef"
    :src="bridgeUrl"
    :style="{ width: width, height: height, border: 'none' }"
    sandbox="allow-scripts allow-same-origin allow-forms allow-modals allow-popups"
    loading="lazy"
    title="Microsoft Teams Channel Chat"
  ></iframe>
</template>

<style scoped>
/* you can add a subtle border or shadow here */
iframe {
  display: block;
  border: 1px solid #e1e1e1;
  border-radius: 4px;
}
</style>