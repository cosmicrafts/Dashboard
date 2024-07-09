<template>
  <div class="container">
    <h2>Tokens</h2>
    <div v-if="Object.keys(tokenStore.icrc1Tokens).length">
      <div v-for="(balance, canisterId) in tokenStore.icrc1Tokens" :key="canisterId" class="token-card">
        <h3>{{ tokenStore.name[canisterId] }} ({{ tokenStore.symbol[canisterId] }})</h3>
        <p>Balance: {{ formatBalance(balance, tokenStore.decimals[canisterId]) }}</p>
        <p>Decimals: {{ tokenStore.decimals[canisterId] }}</p>
        <p>Fee: {{ formatBalance(tokenStore.fee[canisterId], tokenStore.decimals[canisterId]) }}</p>
        <p>Metadata:</p>
        <ul>
          <li v-for="([key, value], index) in tokenStore.metadata[canisterId]" :key="index">
            {{ key }}: {{ formatMetadataValue(value) }}
          </li>
        </ul>
        <form v-if="transferData[canisterId]" @submit.prevent="handleTransfer(canisterId)">
          <label>
            To:
            <input v-model="transferData[canisterId].to" type="text" required />
          </label>
          <label>
            Amount:
            <input v-model.number="transferData[canisterId].amount" type="number" required />
          </label>
          <button type="submit">Transfer</button>
        </form>
      </div>
    </div>
    <div v-else>
      <p>Loading tokens...</p>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue';
import { useTokenStore } from '@/store/tokenStore';
import { useAuthStore } from '@/store/auth';
import { customStringify } from '@/utils/customStringify';
import { parseMetadata } from '@/utils/metadataParser';

const tokenStore = useTokenStore();
const authStore = useAuthStore();

const transferData = reactive({});

onMounted(async () => {
  await authStore.initializeStore();

  const principalId = authStore.principalId;
  if (!principalId) {
    console.error('Principal ID is not set');
    return;
  }

  const canisterIds = ['svcoe-6iaaa-aaaam-ab4rq-cai', 'plahz-wyaaa-aaaam-accta-cai'];
  for (const canisterId of canisterIds) {
    transferData[canisterId] = { to: '', amount: 0 };
    await tokenStore.fetchICRC1TokenInfo(canisterId);
  }
});

const formatBalance = (balance, decimals) => {
  if (!balance || !decimals) return 'Loading...';
  return (balance / BigInt(10 ** decimals)).toString();
};

const formatMetadataValue = (value) => {
  if (typeof value === 'object') {
    if ('Int' in value) return value.Int.toString();
    if ('Nat' in value) return value.Nat.toString();
    if ('Blob' in value) return new TextDecoder().decode(new Uint8Array(value.Blob));
    if ('Text' in value) return value.Text;
    if ('MetadataArray' in value) return customStringify(value.MetadataArray.map(formatMetadataValue));
  }
  if (typeof value === 'bigint') return value.toString();
  return JSON.stringify(value);
};

const handleTransfer = async (canisterId) => {
  const { to, amount } = transferData[canisterId];
  if (!to || !amount) return;

  try {
    const transferAmount = BigInt(amount * 10 ** tokenStore.decimals[canisterId]);
    await tokenStore.transferICRC1Token(canisterId, to, transferAmount);
    transferData[canisterId].to = '';
    transferData[canisterId].amount = 0;
  } catch (error) {
    console.error('Error transferring tokens:', error);
  }
};
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

.token-card {
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

h3 {
  color: #34495e;
  margin-bottom: 0.5em;
  font-size: 1.2em;
  font-weight: bold;
}

p {
  font-size: 0.9em;
  color: #555;
  margin: 0.5em 0;
}

ul {
  list-style-type: none;
  padding: 0;
}

ul li {
  font-size: 0.9em;
  color: #555;
}

.transfer-form {
  margin-top: 10px;
}

.transfer-form label {
  display: block;
  margin-bottom: 5px;
  font-size: 0.9em;
  color: #555;
}

.transfer-form input {
  width: calc(100% - 20px);
  padding: 5px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.transfer-form button {
  padding: 10px 15px;
  background-color: #2c3e50;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9em;
}

.transfer-form button:hover {
  background-color: #34495e;
}
</style>
