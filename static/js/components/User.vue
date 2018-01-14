<template>
    <li>
      {{ user.name }} <span v-on:click="vote">💜</span> <span v-if="user.votes > 0">({{ user.votes }})</span>
    </li>
</template>

<script>
  export default {
    name: 'user',

    props: ['user'],

    methods: {
      vote() {
        this.$emit('vote', this.user);
      }
    }
  }
</script>

<style scoped>

</style>
