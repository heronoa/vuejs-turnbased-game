<script setup lang="ts">
import LoaderIcon from '@/components/LoaderIcon.vue';
import SignupForm from '../components/SignupForm.vue'
</script>

<template>
  <main>
    <Suspense>
      <SignupForm />

      <template #fallback>
        <LoaderIcon />
      </template>
    </Suspense>
  </main>
</template>
