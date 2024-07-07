<template>
  <div>
    <h2>NFTs</h2>
    <NFTList />
    <NFTDetails />
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useNFTStore } from '@/store/nftStore';
import { useAuthStore } from '@/store/auth';

const nftStore = useNFTStore();
const authStore = useAuthStore();

onMounted(() => {
  const account = authStore.principalId;
  nftStore.fetchNFTs('w4fdk-fiaaa-aaaap-qccgq-cai', account);
});
</script>
