<template>
  <div class="container">
    <ol>
      <User v-for="user in sortedUsersByVote" :user="user" @vote="voteUser" v-bind:key="user.userId"/>
    </ol>
  </div>
</template>

<script>
  import axios from 'axios';

  import config from '../config';

  import User from './User';

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
        axios.get(`${config.lambda.baseUrl}/${config.lambda.endpoints.users_list}`)
          .then(({ data: users }) => this.users = users);
      },

      voteUser(user) {
        axios.put(`${config.lambda.baseUrl}/${config.lambda.endpoints.users_vote.replace('{userId}', user.userId)}`)
          .then(() => this.fetchUsers());
      },
    },

    computed: {
      sortedUsersByVote() {
        return this.users.sort((a, b) => {
          if (a.votes !== b.votes) {
            return b.votes - a.votes;
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
      clearInterval(this.interval);
    },
  }
</script>

<style scoped>

</style>
