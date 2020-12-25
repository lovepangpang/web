<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>

export default {
  name: 'App',
  created() {
    console.log('开始喽！')
    this.$store.dispatch('user/initSession')
  }
}
</script>
