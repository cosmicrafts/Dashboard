<template>
  <div>
    <h2>Tokens</h2>
    <TokenList />
    <TokenDetails />
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useTokenStore } from '@/store/tokenStore';

const tokenStore = useTokenStore();

onMounted(() => {
  tokenStore.fetchICRC1Tokens('<canister-id>', '<account>');
  tokenStore.fetchICRC7Tokens('<canister-id>', '<account>');
});
</script>
