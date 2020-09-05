class LoginService {
  constructor($http, env) {
    this.$http = $http;

    this.authTokenUrl = `${env.getApiUrl()}/user_token`;
    this.redirectToUrl = null;
  }

  signin(email, password, successCallback, errorCallback){
    const request = { auth: { email, password } };
    this.$http.post(this.authTokenUrl, request).then(response => successCallback(response.data), response => errorCallback(response.data, response.status));
  }
}

export default LoginService