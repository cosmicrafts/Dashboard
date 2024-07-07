<template>
  <div>
    <UserInfo />
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { usePlayerStore } from '@/store/playerStore';

const playerStore = usePlayerStore();

onMounted(() => {
  playerStore.fetchUserDetails('<canister-id>', '<user-id>');
});
</script>
