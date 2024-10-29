<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
      <h2 class="text-2xl font-bold text-center">Login</h2>
      <form @submit.prevent="onSubmit">
        <div class="">
          <label class="block text-sm">Name</label>
          <input
            v-model="name"
            type="text"
            required
            class="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label class="block text-sm">Class</label>
          <select
            v-model="classHero"
            v-on:change="changeAttributes"
            required
            class="w-full px-3 py-2 border rounded"
          >
            <option
              v-for="item in ['Warrior', 'Mage', 'Scout']"
              :value="item.toLowerCase()"
              :key="item"
            >
              {{ item }}
            </option>
          </select>
        </div>
        <div class="grip grid-cols-2 grid-flow-row">
          <div
            class=""
            v-for="[attrName, attrValue] in Object.entries(classAttributes)"
            :key="attrName"
            :value="{ attrName, attrValue }"
          >
            {{ attrName }}: {{ attrValue }}
          </div>
        </div>

        <button
          type="submit"
          class="w-full py-2 mt-4 text-white bg-blue-500 rounded"
        >
          Criar
        </button>
      </form>
      <p class="text-center">
        Não tem uma conta?
        <router-link to="/signup" class="text-blue-500"
          >Cadastre-se</router-link
        >
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
// import { useRouter } from 'vue-router'
// import { useAuthStore } from '../stores/auth'
import { InitialAttributesByClass } from '@/utils/consts'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

export default defineComponent({
  setup() {
    const name = ref('')
    const classHero = ref('Warrior')
    const classAttributes = ref(InitialAttributesByClass['warrior'])
    const authStore = useAuthStore()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const changeAttributes = (event: any) => {
      const value = event.target.value
      console.log({ value })
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

    return {
      name,
      classHero,
      classAttributes,
      changeAttributes,
      onSubmit,
    }
  },
})
</script>
