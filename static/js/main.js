import $ from 'jquery';
import axios from 'axios';

const baseUrl = 'https://mhwx6ohouj.execute-api.eu-west-1.amazonaws.com/dev';
const endpointConfigSet = '/config';
const configKey = 'fbUserToken';

window.saveUserAccessToken = function saveUserAccessToken() {
  FB.getLoginStatus(function(response) {
    const { authResponse: { accessToken } } = response;

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
