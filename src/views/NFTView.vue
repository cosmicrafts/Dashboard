<template>
  <div class="container">
    <h2>NFTs</h2>
    <div class="nft-grid">
      <div v-for="(tokens, canisterId) in nftStore.icrc7Tokens" :key="canisterId" class="canister-section">
        <div v-if="nftStore.collectionMetadata[canisterId]" class="metadata-card">
          <h3>Collection Metadata</h3>
          <MetadataItem :label="canisterId" :value="nftStore.collectionMetadata[canisterId]" />
        </div>
        <div v-for="token in tokens" :key="token" class="nft-card">
          <h3>NFT ID: {{ token }}</h3>
          <div v-if="nftStore.metadata[canisterId] && nftStore.metadata[canisterId][token.toString()]">
            <MetadataItem :label="token.toString()" :value="nftStore.metadata[canisterId][token.toString()]" />
          </div>
          <div v-else>
            <p>Loading metadata...</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useNFTStore } from '@/store/nftStore';
import { useAuthStore } from '@/store/auth';
import MetadataItem from '@/components/MetadataItem.vue';

const nftStore = useNFTStore();
const authStore = useAuthStore();

onMounted(async () => {
  const principalIdString = authStore.principalId;
  if (!principalIdString) {
    console.error('Principal ID is not set');
    return;
  }

  try {
    const canisterIds = ['phgme-naaaa-aaaap-abwda-cai', 'w4fdk-fiaaa-aaaap-qccgq-cai'];
    for (const canisterId of canisterIds) {
      await nftStore.fetchICRC7Tokens(canisterId);
      await nftStore.fetchICRC7CollectionMetadata(canisterId);
    }
  } catch (error) {
    console.error('Error fetching NFTs:', error);
  }
});
</script>

<style scoped>
.container {
  padding: 20px;
}

h2 {
  color: #2c3e50;
  margin-bottom: 1em;
  font-size: 2em;
  font-weight: bold;
}

.nft-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.canister-section {
  background: #f9f9f9;
  border-radius: 8px;
  padding: 15px;
}

.metadata-card {
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.nft-card {
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.nft-card h3 {
  color: #34495e;
  margin-bottom: 0.5em;
  font-size: 1.2em;
  font-weight: bold;
}

.nft-card p {
  font-size: 0.9em;
  color: #888;
}

@media (max-width: 600px) {
  .nft-grid {
    grid-template-columns: 1fr;
  }
}
</style>
