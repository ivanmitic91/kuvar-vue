<template>
  <div class="promenaSifre innerPannel">
    <h1>Promena sifre</h1>
    <div class="input">
      <br />
      <div class="kontejner">
        <div>
          <input class="unos" type="password" v-model="staraSifra" placeholder="Stara sifra" />
        </div>
        <br />
        <div>
          <input class="unos" type="password" v-model="novaSifra" placeholder="Nova sifra" />
        </div>
        <br />
        <div>
          <input
            class="unos"
            type="password"
            v-model="novaSifraProvera"
            placeholder="Ponovite novu sifru"
          />
        </div>
        <br />
        <input class="btn" type="button" value="Promeni sifru" @click="promenaSifreBtn()" />

        <!-- poruka za pogresan unos pri promeni sifre -->
        <p class="spam">{{this.$store.state.Info}}</p>
        <br />
      </div>
    </div>
  </div>
</template>

<script>
import $api from "@/api.js";

export default {
  data() {
    return {
      staraSifra: "",
      novaSifra: "",
      novaSifraProvera: "",
      korisnickoIme: "",
      sid: window.localStorage.getItem("sid")
    };
  },
  mounted() {
    this.$store.state.Info = "";
  },
  methods: {
    promenaSifreBtn() {
      if (
        this.staraSifra == "" ||
        this.staraSifra == null ||
        this.novaSifra == "" ||
        this.novaSifra == null ||
        this.novaSifraProvera == "" ||
        this.novaSifraProvera == null
      ) {
        this.$store.commit("INFO", "Popunite sva polja!");
      } else if (this.novaSifra !== this.novaSifraProvera) {
        this.$store.commit("INFO", "Nove sifre Vam se ne poklapaju !");
      } else {
        $api
          .promenaSifre({
            staraSifra: this.staraSifra,
            novaSifra: this.novaSifra,
            sid: this.sid,
            korisnickoIme: this.$store.state.PodaciKorisnika.username
          })
          .then(response => {
            this.$store.state.ServerMessage = response.data.promenaSifreMessage; //poruka sa servera-samo ako sifre se ne poklapaju
            this.$store.commit("INFO", this.$store.state.ServerMessage); // poruka za unetu pogresnu staru lozinku

            console.log(response);

            this.$store.state.PromenaSifreInfo = response.data.Success; // poruka posle uspesne promene sifre

            if (!response.data.promenaSifreMessage) {
              this.$store.dispatch("actionLogout"); // izloguj korisnika posle promene sifre
            }
          })
          .catch(error => {
            console.log("action PromenaSifre ERROR", error);
          });
      }
    }
  }
};
</script>

<style scoped>
.kontejner {
  width: 80%;
  height: 80%;
  padding: inherit;
  margin: auto;
  text-align: center;
}

.unos {
  width: 400px;
  height: 50px;
  border: 0px;
  text-align: center;
}

.promenaSifre h1 {
  font-size: 38px;
  font-weight: 600;
  text-align: center;
  padding-bottom: 30px;
  color: orange;
}

.btn {
  height: 55px;
  background: linear-gradient(orange, #f07305);
  padding: 15px;
  color: white;
}

.spam {
  color: red;
  text-align: center;
  font-size: 25px;
}
</style>
