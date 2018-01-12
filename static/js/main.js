import $ from 'jquery';
import 'bootstrap';
import Vue from 'vue';
import axios from 'axios';

import App from './App';

const baseUrl = 'https://mhwx6ohouj.execute-api.eu-west-1.amazonaws.com/dev';
const endpointConfigSet = '/config';
const configKey = 'fbUserToken';

window.saveUserAccessToken = function saveUserAccessToken() {
  FB.getLoginStatus(function(response) {
    const { authResponse: { accessToken } } = response;

    console.log(accessToken);

    axios
      .post(`${baseUrl}${endpointConfigSet}`, {
        [configKey]: accessToken,
      })
      .then(() => {
        $('.fb_iframe_widget').hide();
      })
      .catch(error => console.error(error));
  });
};

new Vue({
  el: '#app',
  template: '<App/>',
  components: { App },
});
