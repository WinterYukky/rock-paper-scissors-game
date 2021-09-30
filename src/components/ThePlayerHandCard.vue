<script setup lang="ts">
import VCard from './VCard.vue'
</script>

<template>
  <v-card class="m-4 flex-1 flex flex-col justify-center text-center">
    <div class="pb-3"><slot name="player"></slot></div>
    <div class="font-bold lg:text-5xl text-xl">
      <slot></slot>
    </div>
  </v-card>
</template>
