<template>
    <li>
      {{ user.name }} ({{ user.votes || 0}}) <span v-on:click="vote">VOTE</span>
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
