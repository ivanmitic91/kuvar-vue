import Vuex from 'vuex'
import Vue from 'vue'
import createPersistedState from 'vuex-persistedstate';
import router from '@/router/index'
import $api from '@/api.js'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isLoggedIn: false,
    PodaciKorisnika: Object, // podaci za ulogovanog korisnika
    Info: "",
    InfoSuccess: "", // uspesno poslata poruka preko kontakt forme u 'home'
    PromenaSifreInfo: "", // poruka za uspesnu promenu sifre
    ServerMessage: "",
    PopularRecipes: "", // popularni recepti iz baze
    putanjaDoSlike: 'http://018t122.mars-e1.mars-hosting.com' // putanja slike, promeniti prilikom promene pristupnih podataka ka serveru!, dostupno globalno
  },
  plugins: [createPersistedState()],

  getters: {

  },
  // menja vrednost u 'state'
  mutations: {
    SET_IS_LOGGED_IN(state, payload) {
      state.isLoggedIn = payload
    },
    PRIMLJENI_PODACI_KORISNIKA(state, payload) {
      state.PodaciKorisnika = payload
    },
    INFO(state, payload) {
      state.Info = payload // koristi se za ispis poruka sa servera
    }
    ,
    INFOSUCCESS(state, payload) {
      state.InfoSuccess = payload //obrisi ispis poruke  uspesne registracije sa servera
    },
    OBRISI_GRESKU(state, payload) {
      state.PromenaSifreInfo = payload //obrisi ispis poruke  greske sa servera za logovanje
    }
  },
  // metode u 'vuex-u'
  actions: {
    // metod za logovanje korisnika, dostupan globalno
    actionLogin(context, payload) {

      console.log("provera da li ide do servera, password je: " + payload.password); //payload je userObj iz login.vue
      $api.login({
        username: payload.username,
        password: payload.password
      })
        .then(response => {

          this.state.ServerMessage = response.data.Error;
          this.state.InfoSuccess = ""
          context.commit("INFO", this.state.ServerMessage);
          console.log("da li ima errora? " + this.state.ServerMessage + " !!!!!!!!!!!!!!!!!");
          console.log("PORUKA ZA LOGIN", response);
          context.commit("OBRISI_GRESKU", "");

          if (!response.data.Error) {
            context.commit("SET_IS_LOGGED_IN", true);
            console.log("da li si login " + this.state.isLoggedIn);
            let sid = response.data.sid;
            window.localStorage.setItem("sid", sid);
            var userInfo = response.data.userObject;
            context.commit("PRIMLJENI_PODACI_KORISNIKA", userInfo);
            context.commit("OBRISI_GRESKU", "");
            console.log("podaci sa servera 1");
            console.log(response.data.userObject);
            router.push({
              name: 'home'
            });
          }

          console.log("podaci sa servera 2");

        })
        .catch(error => {
          console.log('actionLogin ERROR', error);
        });
    },
    // metod za registraciju korisnika, dostupan globalno
    actionRegister(context, payload) {
      $api.user({
        ime: payload.ime,
        prezime: payload.prezime,
        email: payload.email,
        username: payload.username,
        password: payload.password,
        password_check: payload.password_check
      })
        .then(response => {
          this.ServerMessage = response.data.Error;
          context.commit("INFO", this.ServerMessage);

          if (this.ServerMessage == null) {
            console.log("PORUKA ZA REGISTRACIJU", response.data.Success);

            context.commit("INFO", response.data.Success);

            setTimeout(() => router.push("/Login"), 3000);
          }
        })
        .catch(Error => {
          console.log(Error);
        });
    },
    // metod za izlogovanje korisnika, dostupan globalno
    actionLogout(context) {
      $api.logout({
        sid: window.localStorage.getItem("sid")
      })
        .then(response => {
          console.log("prolazi")
          context.commit("SET_IS_LOGGED_IN", false);
          this.ServerMessage = response.data.message;
          context.commit("INFO", this.ServerMessage);
          localStorage.removeItem('sid');
          context.commit("PRIMLJENI_PODACI_KORISNIKA", null);
          console.log("message");
          router.push("/Login");
        })
    }
  }
})