<script setup lang="ts">
import VCard from './components/VCard.vue'
import { useHandClassification } from './useHandClassification'
import { useRandomHand } from './useRandomHand'
import ThePlayerHandCard from './components/ThePlayerHandCard.vue'
import { computed } from 'vue'

const { hands, highestHand, canvas, err, loading, ready, start } =
  useHandClassification('2Noi5kfjA')
const { currentHand: enemyHand } = useRandomHand()
const isWin = computed(() => {
  switch (highestHand.value.name) {
    case 'グー':
      return enemyHand.value === 'チョキ'
    case 'チョキ':
      return enemyHand.value === 'パー'
    case 'パー':
      return enemyHand.value === 'グー'
    default:
      return false
  }
})
</script>

<template>
  <div class="container mx-auto">
    <div class="lg:grid grid-cols-4 hidden">
      <v-card v-for="hand in hands" :key="hand.name" class="flex-1 m-4">
        <div class="font-bold">{{ hand.name }}</div>
        <div>{{ (hand.score * 100).toFixed(0) }}%</div>
      </v-card>
    </div>
    <canvas class="m-4 rounded-md flex-1" ref="canvas"></canvas>
    <!-- ロード中画面 -->
    <div v-if="loading" class="flex justify-center text-xl">準備中...</div>
    <!-- 開始ボタン画面 ※IOSではユーザー操作で開始しないとカメラが起動できない -->
    <div v-else-if="ready" class="flex justify-center text-xl">
      <button
        class="
          bg-blue-400
          hover:bg-blue-300
          text-white
          font-bold
          py-2
          px-4
          rounded
        "
        @click="start()"
      >
        開始
      </button>
    </div>
    <!-- ゲーム画面 -->
    <div v-else div class="flex">
      <the-player-hand-card
        :class="{
          'bg-blue-200': !isWin,
          'bg-red-300': isWin,
        }"
      >
        <template #player>あなた</template>
        {{ highestHand.name }}
      </the-player-hand-card>
      <div class="font-bold flex flex-col justify-center">VS</div>
      <the-player-hand-card
        :class="{
          'bg-blue-200': isWin,
          'bg-red-300': !isWin,
        }"
      >
        <template #player>エネミー</template>
        {{ enemyHand }}
      </the-player-hand-card>
    </div>
  </div>
  <div>{{ err }}</div>
</template>
