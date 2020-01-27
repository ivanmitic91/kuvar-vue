<template>
  <div class>
    <!-- ucitaj navigaciju za login -->
    <NavigationLogin />

    <div class="loginB">
      <h2 class="mb-4">Login panel</h2>
      <div class="form-group">
        <label for="username">Korisnicko ime</label>
        <input type="text" v-model="username" class="form-control" id="username" />
      </div>
      <div class="form-group">
        <label for="password">Sifra</label>
        <input v-model="password" type="password" class="form-control" id="password" />
      </div>
      <!-- poruka za pogresan unos pri logovanju -->
      <h2 class="text-center text-info">{{ this.$store.state.Info }}</h2>

      <!-- poruka za uspesnu promenu sifre -->
      <h2 class="text-center text-info">{{ this.$store.state.PromenaSifreInfo }}</h2>
      <br />
      <br />
      <button @click="login1()" type="submit" class="btn btn-warning">Uloguj se</button>
      <h3 class="pt-5 pb-3 text-info">Nemate nalog? Kliknite dole da se registrujete</h3>
      <button type="submit" @click="RouterRegister()" class="btn btn-warning">Registracija</button>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import NavigationLogin from "../components/NavigationLogin.vue";

export default {
  components: {
    NavigationLogin
  },
  data() {
    return {
      username: "",
      password: "",
      userInfo: Object
    };
  },
  mounted() {},
  methods: {
    // pozovi u 'vuex-u' login metod
    login1() {
      let userLoginObj = {
        username: this.username,
        password: this.password
      };
      console.log("podaci ka vuex-u" + userLoginObj.password);
      this.$store.dispatch("actionLogin", userLoginObj);
    },
    // redirektuj na 'register' stranu
    RouterRegister() {
      this.$router.push("Register");
    }
  }
};
</script>

<style scoped>
.loginB {
  width: 400px;
  margin: 0 auto;
  padding-top: 75px;
  text-align: center;
}

.loginB .form-control:focus {
  border-color: #ffde80;
  box-shadow: 0 0 0 0.2rem rgba(255, 150, 0, 0.25);
}
</style>