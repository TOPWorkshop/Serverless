<template>
  <div class="container">
    <ol>
      <User
        v-for="user in sortedUsersByVote"
        @vote="voteUser"
        :user="user"
        :key="user.userId"/>
    </ol>
  </div>
</template>

<script>
  import axios from 'axios';

  import config from '../config';

  import User from './User';

  export default {
    name: 'UsersList',
    components: { User },

    data() {
      return {
        users: [],
        interval: null,
      };
    },

    computed: {
      sortedUsersByVote() {
        return this.users.slice(0).sort((a, b) => {
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
  }
</script>

<style scoped>

</style>
