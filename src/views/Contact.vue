<template>
  <section id="contactPage" class="contactPage">
    <h1>Kontakt</h1>
    <!-- <h4>{{this.poslato}}</h4> -->
    <div class="contactForm">
      <div class="form-group">
        <label>Ime i prezime</label>
        <input type="text" class="form-control" v-model="ime_i_prezime" />
      </div>
      <div class="form-group">
        <label>Email</label>
        <input type="email" class="form-control" v-model="email" />
      </div>
      <div class="form-group">
        <label>Naslov poruke</label>
        <input type="text" class="form-control" v-model="naslov_poruke" />
      </div>
      <div class="form-group">
        <label>Poruka</label>
        <textarea class="form-control" rows="7" v-model="poruka"></textarea>
      </div>
      <button class="btn btn-warning" @click="posaljiMail">Posalji</button>
      <!-- obavestenje da je poruka uspesno poslata -->
      <h2 class="text-center text-info">{{ this.$store.state.InfoSuccess }}</h2>

      <!-- obavestenje da polja nisu dobro popunjena -->
      <h2 class="text-center text-danger">{{ this.$store.state.Info }}</h2>
    </div>
  </section>
</template>

<script>
import api from "@/api.js";
export default {
  data() {
    return {
      ime_i_prezime: "",
      email: "",
      naslov_poruke: "",
      poruka: ""
    };
  },
  mounted() {
    this.$store.state.Info = "";
    this.$store.state.InfoSuccess = "";
  },
  methods: {
    // metod za slanje podataka iz kontakt forme u mejl
    posaljiMail() {
      let params = {
        ime_i_prezime: this.ime_i_prezime,
        email: this.email,
        naslov_poruke: this.naslov_poruke,
        poruka: this.poruka
      };
      console.log("params", params);
      api.posaljiPoruku(params).then(response => {
        console.log("sa backa", response.data.Error);
        this.$store.state.Info = response.data.Error;
        this.$store.state.InfoSuccess = response.data.Success;
      });
    }
  }
};
</script>


<style>
.contactPage {
  width: 1200px;
  padding-top: 100px;
  margin-bottom: 100px;
}

.contactPage h1 {
  text-align: center;
}

.contactForm {
  width: 50%;
  text-align: center;
  margin: 0 auto;
  margin-top: 70px;
}

.contactForm .form-control:focus {
  border-color: #ffde80;
  box-shadow: 0 0 0 0.2rem rgba(255, 150, 0, 0.25);
}

@media only screen and (max-width: 600px) {
  .contactForm {
    width: 90%;
  }
}

@media only screen and (min-width: 600px) and (max-width: 767px) {
  .contactForm {
    width: 100%;
  }
}
@media only screen and (min-width: 768px) and (max-width: 991px) {
  .contactForm {
    width: 70%;
  }
}
</style>