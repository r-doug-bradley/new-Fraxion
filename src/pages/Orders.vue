<template>
  <TeamsChatEmbed
    bridge-url="http://localhost:5173/teams-chat-bridge.html"
    height="720px"
    @ready="onChatReady"
    @error="onChatError"
  />
</template>

<script setup lang="ts">
import TeamsChatEmbed from '@/components/TeamsChatEmbed.vue';
const onChatReady = () => console.log('Chat iframe ready');
const onChatError = (err: any) => console.error('Chat error', err);
</script>