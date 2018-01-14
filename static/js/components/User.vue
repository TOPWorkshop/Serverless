<template>
  <li>
    {{ user.name }} <span @click="vote">💜</span> <span v-if="user.votes > 0">({{ user.votes }})</span>
  </li>
</template>

<script>
  export default {
    name: 'User',

    props: {
      user: {
        type: Object,
        default: () => ({
          userId: '',
          name: '',
          votes: 0,
          createdAt: '',
          updatedAt: '',
        }),
      },
    },

    methods: {
      vote() {
        this.$emit('vote', this.user);
      }
    }
  }
</script>

<style scoped>

</style>
