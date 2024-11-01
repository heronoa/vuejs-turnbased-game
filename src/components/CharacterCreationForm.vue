<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
      <h2 class="text-2xl font-bold text-center">Login</h2>
      <form @submit.prevent="onSubmit">
        <div class="">
          <label class="block text-sm">Name</label>
          <input v-model="name" type="text" required class="w-full px-3 py-2 border rounded" />
        </div>
        <div>
          <label class="block text-sm">Class</label>
          <select v-model="classHero" v-on:change="changeAttributes" required class="w-full px-3 py-2 border rounded">
            <option v-for="item in ['Warrior', 'Mage', 'Scout']" :value="item.toLowerCase()" :key="item">
              {{ item }}
            </option>
          </select>
        </div>
        <div class="grip grid-cols-2 grid-flow-row">
          <div class="" v-for="[attrName, attrValue] in Object.entries(classAttributes)" :key="attrName"
            :value="{ attrName, attrValue }">
            {{ attrName }}: {{ attrValue }}
          </div>
        </div>

        <button type="submit" class="w-full py-2 mt-4 text-white bg-blue-500 rounded">
          Criar
        </button>
        <button v-on:click="back" class="w-full py-2 mt-4 text-white bg-blue-500 rounded">
          Back
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
// import { useRouter } from 'vue-router'
// import { useAuthStore } from '../stores/auth'
import { InitialAttributesByClass } from '@/utils/consts'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const name = ref('')
const classHero = ref('Warrior')
const classAttributes = ref(InitialAttributesByClass['warrior'])
const authStore = useAuthStore()

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const changeAttributes = (event: any) => {
  const value = event.target.value
  classAttributes.value =
    InitialAttributesByClass[value as 'warrior' | 'mage' | 'scout']
}

const router = useRouter()

const onSubmit = async () => {
  const success = await authStore.createCharacter(
    name.value,
    classHero.value,
  )

  console.log({ success })

  if (success) {
    try {
      await authStore.loadUser()
      router.push('/profile')
    } catch (err) {
      console.log(err)
    }
  }
}

const back = () => {
  router.push('/profile')
}


</script>
