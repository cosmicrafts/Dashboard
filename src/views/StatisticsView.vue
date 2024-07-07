<template>
  <div>
    <h2>Statistics</h2>
    <div v-if="playerStats">
      <p>Total Games Played: {{ playerStats.totalGamesPlayed }}</p>
      <p>Total Damage Dealt: {{ playerStats.totalDamageDealt }}</p>
      <!-- Add more statistics as needed -->
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useStatisticsStore } from '@/store/statisticsStore';

const statisticsStore = useStatisticsStore();

onMounted(() => {
  statisticsStore.fetchPlayerStats('<canister-id>', '<principal>');
});

const playerStats = statisticsStore.playerStats;
</script>
