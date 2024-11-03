<script setup lang="ts">
import CharacterDashboard from '@/components/CharacterDashboard.vue'
import LoaderIcon from '@/components/LoaderIcon.vue';
</script>

<template>
  <main>
    <Suspense>

      <CharacterDashboard />
      <template #fallback>
        <LoaderIcon />
      </template>
    </Suspense>
  </main>
</template>
