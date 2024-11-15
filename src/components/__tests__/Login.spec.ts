import { describe, it, expect, beforeEach } from 'vitest'

import { mount } from '@vue/test-utils'
import LoginView from '../../views/LoginView.vue'

import { createPinia, setActivePinia } from 'pinia'

describe('Login', () => {
  beforeEach(() => {
    const pinia = createPinia()
    setActivePinia(pinia)
  })
  it('renders login form', () => {
    const wrapper = mount(LoginView)
    expect(wrapper.find('form').exists()).toBe(true)
  })

  it('has a email field', () => {
    const wrapper = mount(LoginView)
    expect(wrapper.find('input[type="email"][name="email"]').exists()).toBe(
      true,
    )
  })

  it('has a password field', () => {
    const wrapper = mount(LoginView)
    expect(
      wrapper.find('input[type="password"][name="password"]').exists(),
    ).toBe(true)
  })

  it('submits the form', async () => {
    const wrapper = mount(LoginView)
    await wrapper
      .find('input[type="email"][name="email"]')
      .setValue('test@example.com')
    await wrapper
      .find('input[type="password"][name="password"]')
      .setValue('password')
    await wrapper.find('form').trigger('submit.prevent')
    expect(wrapper.emitted('submit')).toBeTruthy()
  })

  it('has a register link', () => {
    const wrapper = mount(LoginView)
    const registerLink = wrapper.find('#signup-link')

    expect(registerLink.exists()).toBe(true)
    expect(registerLink.text()).toBe('Cadastre-se')
  })

  it('redirects to register page', async () => {
    const wrapper = mount(LoginView, {
      global: {
        mocks: {
          $route: {
            path: '/signup',
          },
        },
      },
    })
    const registerLink = wrapper.find('#signup-link')
    await registerLink.trigger('click')
    expect(wrapper.vm.$route.path).toBe('/signup')
  })
})
