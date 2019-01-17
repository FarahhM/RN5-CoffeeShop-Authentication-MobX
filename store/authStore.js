import { decorate, observable, action, computed } from "mobx";
import axios from "axios";
import { AsyncStorage } from "react-native";
import jwt_decode from "jwt-decode";
class authStore {
  constructor() {
    this.user = null;
    this.isAuthenticated = false;
  }

  setAuthToken(token) {
    if (token) {
      AsyncStorage.setItem("myToken", token).then(() => {
        axios.defaults.headers.common.Authorization = `jwt ${token}`;
        this.user = jwt_decode(token);
        this.isAuthenticated = true;
      });
    } else {
      AsyncStorage.removeItem("myToken");
      delete axios.defaults.headers.common.Authorization;
      this.user = null;
      this.isAuthenticated = false;
    }
  }
  setCurrentUser(decodedUser) {
    this.user = decodedUser;
  }
  loginUser(userData, navigation) {
    console.log(userData);

    axios
      .post("http://coffee.q8fawazo.me/api/login/", userData)
      .then(res => res.data)
      .then(user => {
        const decodedUser = jwt_decode(user.token);
        this.setCurrentUser(decodedUser);
        navigation.replace("CoffeeList");
      })
      .catch(err => console.error(err.response.data));
  }
  signupUser(userData, navigation) {
    axios
      .post("http://coffee.q8fawazo.me/api/register/", userData)
      .then(res => res.data)
      .then(user => {
        console.log("signup");

        this.loginUser(userData, navigation);
      })
      .catch(err => console.error(err.response));
  }
  checkForToken() {
    const token = AsyncStorage.getItem("myToken");
    if (token) {
      const user = jwt_decode(token);
      if (user.exp > Date.now() / 1000) {
        this.setAuthToken(token);
      } else {
        this.setAuthToken();
      }
    }
  }
  logoutUser() {
    this.setAuthToken();
  }
}

decorate(authStore, {
  user: observable,
  isAuthenticated: observable
});

export default new authStore();
