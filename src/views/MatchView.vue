<script setup lang="ts">
import MatchInterface from '@/components/MatchInterface.vue'
import LoaderIcon from '@/components/LoaderIcon.vue';
</script>

<template>
  <main>
    <Suspense>

      <MatchInterface />

      <template #fallback>
        <LoaderIcon />
      </template>
    </Suspense>
  </main>
</template>
