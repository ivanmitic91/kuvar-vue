<template>
  <div>
    <section id="aboutPage" class="pt-4">
      <h2 class="text-center">Promena 'O nama'</h2>
      <div class="insert-slika1">
        <div class="form-group">
          <label>Veca slika</label>
          <input
            type="file"
            class="form-control-file"
            id="file1"
            ref="file1"
            v-on:change="handleFileUploadSlika1()"
          />
        </div>
      </div>
      <div class="aboutTex">
        <div class="form-group">
          <label>Naslov</label>
          <input type="text" v-model="about_naziv" class="form-control" />
        </div>
      </div>
      <div class="sadrzaj">
        <div class="form-group">
          <label>Sadrzaj</label>
          <textarea class="form-control" v-model="about_sadrzaj" rows="12" cols="10"></textarea>
        </div>
      </div>
      <div class="insert-slika1">
        <div class="form-group">
          <label>Manja slika</label>
          <input
            type="file"
            class="form-control-file"
            id="file2"
            ref="file2"
            v-on:change="handleFileUploadSlika2()"
          />
        </div>
      </div>
      <div class="dugme-snimi text-center">
        <button class="btn btn-warning mt-3" @click="SnimiPromene">Snimi promene</button>
      </div>
    </section>
    <h2 class="text-info mt-4 text-center">{{ this.$store.state.Info }}</h2>
  </div>
</template>

<script>
import api from "@/api.js";
export default {
  data() {
    return {
      about_naziv: "",
      about_sadrzaj: "",
      ab_slika_veca: "",
      ab_slika_manja: "",
      slika_veca: "",
      slika_manja: "",
      opcija: 0
    };
  },
  mounted() {
    this.aboutPrikaz();
    this.$store.state.Info = "";
  },
  methods: {
    // prikazi iz baze podatke za 'about' stranu
    aboutPrikaz() {
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
    },
    // unos vece slike u bazu
    handleFileUploadSlika1() {
      this.slika_veca = this.$refs.file1.files[0];
    },
    // unos manje slike u bazu
    handleFileUploadSlika2() {
      this.slika_manja = this.$refs.file2.files[0];
    },

    // unesi u bazu sve
    SnimiPromene() {
      let aboutPodaci = new FormData();
      aboutPodaci.append("slika_veca", this.slika_veca);
      aboutPodaci.append("naziv", this.about_naziv);
      aboutPodaci.append("sadrzaj", this.about_sadrzaj);
      aboutPodaci.append("slika_manja", this.slika_manja);

      let config = {
        header: {
          "Content-Type": "multipart/form-data"
        }
      };

      api.aboutPost(aboutPodaci, config).then(response => {
        console.log("UNOS ABOUT INFORMACIJA", response);
        console.log("slika_veca", this.slika_veca);
        console.log("naziv", this.about_naziv);
        console.log("sadrzaj", this.ab_sadrzaj);
        console.log("slika_manja", this.slika_manja);
        this.$store.state.Info = response.data.Success;
      });
    }
  }
};
</script>

<style>
#aboutPage {
  width: 500px;
  margin: 0 auto;
}
</style>