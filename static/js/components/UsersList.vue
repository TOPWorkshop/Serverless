<template>
  <div class="container">
    <ol>
      <User v-for="user in sortedUsersByVote" :user="user" @vote="voteUser" v-bind:key="user.userId"/>
    </ol>
  </div>
</template>

<script>
  import axios from 'axios';

  import User from './User';

  const baseUrl = 'https://n8avbibtf8.execute-api.eu-west-1.amazonaws.com/dev/users';

  export default {
    name: 'users-list',
    components: { User },

    data() {
      return {
        users: [],
        interval: null,
      };
    },

    methods: {
      fetchUsers() {
        axios.get(baseUrl)
          .then(({ data: users }) => this.users = users);
      },

      voteUser(user) {
        axios.put(`${baseUrl}/${user.userId}/vote`)
          .then(() => this.fetchUsers());
      },
    },

    computed: {
      sortedUsersByVote() {
        return this.users.sort((a, b) => {
          if (a.votes !== b.votes) {
            return a.votes - b.votes;
          }

          return a.name < b.name ? -1 : 1;
        });
      }
    },

    mounted() {
      this.fetchUsers();

      this.interval = setInterval(() => this.fetchUsers(), 5000);
    },

    beforeDestroy() {
      console.log('beforeDestroy');

      clearInterval(this.interval);
    },
  }
</script>

<style scoped>

</style>
