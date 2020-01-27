<template>
  <div class="register">
    <NavigationLogin />
    <div class="registerB">
      <h2>Registracija</h2>

      <div class="form-group">
        <label for="first_name">Ime</label>
        <input type="text" v-model="ime" id="first_name" class="form-control" />
      </div>
      <div class="form-group">
        <label for="last_name">Prezime</label>
        <input type="text" v-model="prezime" id="last_name" class="form-control" />
      </div>
      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" v-model="email" id="email" class="form-control" />
      </div>
      <div class="form-group">
        <label for="username">Korisnicko ime</label>
        <input type="text" v-model="username" id="username" class="form-control" />
      </div>
      <div class="form-group">
        <label for="password">Sifra</label>
        <input type="password" v-model="password" id="password" class="form-control" />
      </div>
      <div class="form-group">
        <label for="password_check">Ponovljena sifra</label>
        <input type="password" v-model="password_check" id="password_check" class="form-control" />
      </div>
      <button @click="register" class="btn btn-warning">Registruj se</button>
      <p class="text-center text-danger mt-3">{{ this.$store.state.Info }}</p>
    </div>
  </div>
</template>

<script>
import NavigationLogin from "../components/NavigationLogin.vue";
/* eslint-disable */
export default {
  data() {
    return {
      ime: "",
      prezime: "",
      email: "",
      username: "",
      password: "",
      password_check: ""
    };
  },
  mounted() {
    this.$store.state.Info = "";
    //this.$store.state.InfoSuccess = "";
  },
  components: {
    NavigationLogin
  },
  methods: {
    // pozovi u 'vuex-u' 'register' metod
    register() {
      let userRegisterObj = {
        ime: this.ime,
        prezime: this.prezime,
        email: this.email,
        username: this.username,
        password: this.password,
        password_check: this.password_check
      };
      console.log("STA SALJE", userRegisterObj.ime);
      this.$store.dispatch("actionRegister", userRegisterObj);
    }
  }
};
</script>
 
<style scoped>
.registerB {
  width: 400px;
  margin: 0 auto;
  padding-top: 150px;
  text-align: center;
}

.registerB .form-control:focus {
  border-color: #ffde80;
  box-shadow: 0 0 0 0.2rem rgba(255, 150, 0, 0.25);
}
.registerB {
  padding-top: 75px;
}
</style>