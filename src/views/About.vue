<template>
  <!-- prikazano na 'home' strani -->
  <section class="aboutPage" id="aboutPageLink">
    <h1>O nama</h1>
    <div class="aboutWrapper">
      <div id="aboutImage">
        <img
          width="70%"
          class="AboutTextImage"
          v-bind:src="'data:image/jpeg;base64,'+ab_slika_veca"
          alt="slika veca1"
        />
      </div>
      <div class="aboutTex">
        <h2 class="text-center">{{about_naziv}}</h2>
        <p>
          {{about_sadrzaj}}
          <img
            width="100%"
            class="AboutTextImageSmall float-right mt-5"
            v-bind:src="'data:image/jpeg;base64,'+ab_slika_manja"
            alt="slika manja2"
          />
        </p>
      </div>
    </div>
  </section>
</template>


<script>
import api from "@/api.js";
export default {
  data() {
    return {
      about_naziv: "",
      about_sadrzaj: "",
      ab_slika_veca: "",
      ab_slika_manja: ""
    };
  },
  mounted() {
    this.about();
  },
  methods: {
    //metod za prikaz 'about' strane
    about() {
      api.aboutGet().then(response => {
        this.about_naziv = response.data.about.ab_naziv;
        this.about_sadrzaj = response.data.about.ab_sadrzaj;
        this.ab_slika_veca = response.data.about.ab_slika_veca;
        this.ab_slika_manja = response.data.about.ab_slika_manja;
      });
      console.log("ab_naziv", this.about_naziv);
      console.log("ab_sadrzaj", this.ab_sadrzaj);
      console.log("ab_sadrzaj", this.ab_slika_veca);
      console.log("ab_sadrzaj", this.ab_slika_manja);
    }
  },
  name: ""
};
</script>


<style>
.aboutPage {
  width: 1200px;
  padding-top: 110px;
}

.aboutPage h1 {
  margin-bottom: 15px;
  text-align: center;
}

#aboutImage {
  text-align: center;
}
.aboutTex h2 {
  text-align: left;
  margin-top: 20px;
  margin-bottom: 20px;
}

.aboutTex {
  padding: 10%;
  padding-top: 2%;
}

.aboutTex p {
  text-align: justify;
  font-size: 18px;
}

@media only screen and (max-width: 600px) {
  .aboutPage {
    padding: 10px;
  }

  .AboutTextImage {
    float: none;
    padding: 10px 0;
  }

  .aboutImage {
    height: 300px;
    background-image: url(../assets/about_me.jpg);
    background-repeat: no-repeat;
    background-size: cover;
  }
}

@media only screen and (min-width: 600px) and (max-width: 767px) {
  .aboutImage {
    height: 400px;
    background-image: url(../assets/about_me.jpg);
    background-repeat: no-repeat;
    background-size: cover;
  }
}

@media only screen and (min-width: 768px) and (max-width: 991px) {
  .aboutImage {
    height: 500px;
  }
}

@media only screen and (min-width: 1200px) and (max-width: 1600px) {
  .aboutPage {
    padding: 20px;
  }

  .aboutImage {
    height: 500px;
  }
}
</style>