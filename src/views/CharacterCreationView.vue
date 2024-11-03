<script setup lang="ts">
import CharacterCreationForm from '@/components/CharacterCreationForm.vue'
import LoaderIcon from '@/components/LoaderIcon.vue';
</script>

<template>
  <main>
    <Suspense>

      <CharacterCreationForm />
      <template #fallback>
        <LoaderIcon />
      </template>
    </Suspense>
  </main>
</template>
