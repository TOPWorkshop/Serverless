<template>
  <div>
    <span
      v-if="!accessToken"
      @click="doFacebookLogin">🔒</span>
    <span
      v-if="accessToken"
      @click="fetchConfig">🔓</span>
  </div>
</template>

<script>
  import axios from 'axios';

  export default {
    name: 'ConfigButtons',

    data() {
      return {
        accessToken: '',
      };
    },

    methods: {
      fetchConfig() {
        axios.get(ENDPOINTS['config-get'].replace('{{configKey}}', 'fbUserId'), {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        })
          .then(({ data }) => {
            alert(data);
          });
      },

      doFacebookLogin() {
        window.FB.login(({ authResponse: { accessToken } }) => this.accessToken = accessToken);
      }
    },
  }
</script>

<style scoped>

</style>
