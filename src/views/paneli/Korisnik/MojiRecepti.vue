<template>
  <div id="moji-recepti" class="contaktFormREcepti">
    <div class="form-group">
      <input
        v-model="nazivRecepta"
        type="text"
        class="form-control"
        placeholder="Unesite naziv recepta ovde"
        required
        :error-messages="receptGreske"
        @input="$v.nazivRecepta.$touch()"
        @blur="$v.nazivRecepta.$touch()"
      />
    </div>
    <p class="text-danger">{{ receptGreske[0] }}</p>
    <div class="form-group receptTekst">
      <textarea
        required
        v-model="opisRecepta"
        placeholder="Unesite opis pripreme ovde"
        :error-messages="receptGreskeOpis"
        @input="$v.opisRecepta.$touch()"
        @blur="$v.opisRecepta.$touch()"
        cols="80"
        rows="10"
        class="form-control"
      ></textarea>
    </div>
    <p class="text-danger">{{ receptGreskeOpis[0] }}</p>

    <div class="pretragaNamirnica">
      <div class="form-group">
        <label class="text-info">Pritisnite "enter" za dodavanje nove namirnice!</label>

        <input
          @keyup="pokreniPretraguNamirnica()"
          @keypress.enter="addToOdabranoText"
          v-model="search"
          type="text"
          class="form-control pretrazi"
          placeholder="Unesite namirnicu"
        />
      </div>
      <p v-if="brojNamirnicaGreska !== true" class="text-danger">{{ brojNamirnicaGreska }}</p>

      <div class="trazeneNamirnice">
        <div v-show="this.search !=''">
          <div
            v-for="(namirnica,index) in namirnice"
            :key="namirnica.nam_id"
            class="prikaziNamirnice"
          >
            <div class="form-check">
              <label class="form-check-label">
                <input
                  required
                  :value="namirnica.nam_id"
                  type="checkbox"
                  data-toggle="modal"
                  data-target=".bd-example-modal-sm"
                  class="form-check-input probaZaUncheck"
                  @change="addToOdabrano(index,namirnica.nam_id, namirnica.nam_naziv)"
                />
                {{ namirnica.nam_naziv }}
              </label>
            </div>
          </div>
        </div>
      </div>

      <div class="odabraneNamirnice mb-4 float-right d-block">
        <h3 v-show="this.namirniceKolicina != ''" class="text-center mb-3">Odabrane namirnice</h3>
        <div v-for="(odabranaNamirnica, index) in this.odabrano" :key="index">
          <p>
            <span class="mr-2">
              <b>Ime:</b>
              {{ odabranaNamirnica.name }}
              {{ odabranaNamirnica.imeNamirnice }}
            </span>

            <span>
              <b>Kolicina:</b>
              {{ odabranaNamirnica.kolicina }}
            </span>
            <span
              @click="ukloniNamirnicu(index)"
              class="text-danger ml-2 ukloniNamirnicuDugme"
            >Ukloni</span>
          </p>
        </div>
      </div>

      <div class="form-group">
        <label>Unesite sliku jela</label>
        <input
          class="form-control-file"
          type="file"
          id="file"
          ref="file"
          v-on:change="handleFileUpload()"
        />
        <p class="text-danger">{{ fajlPoruka }}</p>
      </div>
      <div class="form-group vremePripremeInput">
        <input
          v-model="vremePripreme"
          type="number"
          required
          class="form-control"
          placeholder="Vreme pripreme recepta"
          :error-messages="receptGreskeVremePripreme"
          @input="$v.vremePripreme.$touch()"
          @blur="$v.vremePripreme.$touch()"
        />
        <p class="text-danger">{{ receptGreskeVremePripreme[0] }}</p>
      </div>

      <div class="form-group zaKolikoOsobaInput">
        <input
          required
          v-model="zaKolikoOsoba"
          type="number"
          class="form-control"
          placeholder="Za koliko osoba"
          :error-messages="receptGreskeZakolikoOsoba"
          @input="$v.zaKolikoOsoba.$touch()"
          @blur="$v.zaKolikoOsoba.$touch()"
        />
        <p class="text-danger">{{ receptGreskeZakolikoOsoba[0] }}</p>
      </div>
      <div class="form-check mr-4 posnoCheckbox clear">
        <label class="form-check-label">
          <input v-model="posno" type="checkbox" class="form-check-input" value="checkedValue" />
          Posno?
        </label>
      </div>

      <div class="form-group kategorijaInput">
        <label class="mr-2">Kategorija</label>
        <select
          v-model="kat_id"
          class="form-control"
          :error-messages="receptGreskeKategorija"
          @change="$v.kat_id.$touch()"
          @blur="$v.kat_id.$touch()"
          required
        >
          <option
            :value="kategorije[index].vrs_id"
            v-for="(kategorija, index) in kategorije"
            :key="index"
          >{{ kategorije[index].vrs_naziv }}</option>
        </select>
        <p class="text-danger">{{ receptGreskeKategorija[0] }}</p>
      </div>

      <div class="form-group obrokInput">
        <label class="mr-2">Obrok</label>
        <select
          v-model="id_obrok"
          class="form-control"
          :error-messages="receptGreskeObrok"
          @change="$v.id_obrok.$touch()"
          @blur="$v.id_obrok.$touch()"
          required
        >
          <option :value="1">Dorucak</option>
          <option :value="2">Uzina</option>
          <option :value="3">Rucak</option>
          <option :value="4">Vecera</option>
          <option :value="5">Obrok za poneti</option>
        </select>
        <p class="text-danger">{{ receptGreskeObrok[0] }}</p>
      </div>
      <button @click="unosRecepta()" class="btn btn-warning">Unesite recept</button>
    </div>

    <div class="modalWrapper" id="modalUnesiNamirnice">
      <div class="mojModal">
        <button @click="ukloniOdabranoText()" type="button">X</button>
        <p>Unesite kolicinu za odabrani sastojak</p>
        <div class="form-group">
          <input v-model="kolicinaPopup" type="text" class="form-control" aria-describedby="helpId" />
        </div>

        <button @click="addToOdabranoText()" class="btn btn-secondary">Potvrdi</button>
      </div>
    </div>

    <div class="modalWrapperCheckbox" id="modalUnesiNamirniceCheckbox">
      <div class="mojModal">
        <button @click="ukloniOdabrano()" type="button">X</button>
        <p>Unesite kolicinu za odabrani sastojak</p>
        <div class="form-group">
          <input v-model="kolicina" type="text" class="form-control" placeholder="kolicina" />
        </div>
        <button @click="potvrdiNamirnicu()" class="btn btn-secondary">Potvrdi</button>
      </div>
    </div>
    <h2 class="text-center text-info">{{ this.$store.state.Info }}</h2>
  </div>
</template>

<script>
import api from "@/api.js";
import { required, minLength } from "vuelidate/lib/validators";

export default {
  data() {
    return {
      namirnice: [], // lista namirnica iz baze
      search: "", // sta je upisano za pretragu
      odabrano: [], // dodaj ovde namirnicu pri cekiranju, salje se serveru
      kolicina: "", // koliko gr, kg namirnica
      namirniceKolicina: [], // dodaje se kolicina za svaku odabranu namirnicu
      nazivRecepta: "", // kako se zove recept OBAVEZNO
      opisRecepta: "", // kako se pravi recept OBAVEZNO
      vremePripreme: "", // koliko se pece, kuva OBAVEZNO
      posno: "", // da li je samo za slave?
      zaKolikoOsoba: [], // koliko je tanjira potrebno na stolu OBAVEZNO
      file: "",
      kat_id: null, //koja je kategorija recepta OBAVEZNO
      indexCekirano: "",
      id_obrok: null, //vrsta obroka OBAVEZNO

      kolicinaPopup: "", // modal za unos kolicine pri rucnom unosu imena namirnice
      kategorije: "",

      odabranaNamId: "",
      odabranaNamName: "",
      fajlPoruka: "",
      brojNamirnicaGreska: ""
    };
  },
  mounted() {
    this.$store.state.Info = "";
    this.prikaziNamirnice();
    this.prikaziKategorije();
  },
  computed: {
    // prikazi greske ako polja nisu popunjena
    receptGreske() {
      const errors = [];

      if (!this.$v.nazivRecepta.$dirty) return errors;

      !this.$v.nazivRecepta.required && errors.push("Polje je obavezno!");

      return errors;
    },
    receptGreskeOpis() {
      const errors = [];

      if (!this.$v.nazivRecepta.$dirty) return errors;

      !this.$v.opisRecepta.required && errors.push("Polje je obavezno!");

      return errors;
    },
    receptGreskeVremePripreme() {
      const errors = [];

      if (!this.$v.vremePripreme.$dirty) return errors;

      !this.$v.vremePripreme.required && errors.push("Polje je obavezno!");
      return errors;
    },
    receptGreskeZakolikoOsoba() {
      const errors = [];

      if (!this.$v.zaKolikoOsoba.$dirty) return errors;

      !this.$v.zaKolikoOsoba.required && errors.push("Polje je obavezno!");
      return errors;
    },
    receptGreskeKategorija() {
      const errors = [];

      if (!this.$v.kat_id.$dirty) return errors;

      !this.$v.kat_id.required && errors.push("Polje je obavezno!");
      return errors;
    },
    receptGreskeObrok() {
      const errors = [];

      if (!this.$v.id_obrok.$dirty) return errors;

      !this.$v.id_obrok.required && errors.push("Polje je obavezno!");
      return errors;
    }
  },
  // validacija za polja
  validations: {
    nazivRecepta: {
      required,
      minLength: minLength(4)
    },
    opisRecepta: {
      required
    },
    vremePripreme: {
      required
    },
    zaKolikoOsoba: {
      required
    },
    kat_id: {
      required
    },
    id_obrok: {
      // between: between(20, 30),
      required
    }
  },
  methods: {
    // prikazi namirnice iz baze
    prikaziNamirnice() {
      let params = {
        sid: window.localStorage.getItem("sid"),
        search: this.search
      };

      let ListaNamirnica = { params: params };
      api.sveNamirnice(ListaNamirnica).then(response => {
        console.log("VRACENE NAMIRNICE", response);
        this.namirnice = response.data.showQuery;
      });
    },

    //dodaj sastojak u odabrane
    addToOdabrano(index, namirnica_id, naziv_namirnice) {
      let myModal = document.getElementById("modalUnesiNamirniceCheckbox");
      myModal.style.display = "block";
      this.odabranaNamId = namirnica_id;
      this.odabranaNamName = naziv_namirnice;
      console.log("ODABRAN ID JE", namirnica_id);
      console.log("ODABRAN NAZIV JE", naziv_namirnice);
    },
    ukloniOdabrano() {
      (this.odabranaNamId = ""), (this.odabranaNamName = "");
      let myModal = document.getElementById("modalUnesiNamirniceCheckbox");
      myModal.style.display = "none";
      console.log("uklanjam");
    },
    //dodaj u odabrane runo  uneto ime namirnice
    addToOdabranoText() {
      let myModal = document.getElementById("modalUnesiNamirnice");

      myModal.style.display = "block";

      let newOBText = new Object();
      newOBText.name = this.search;
      newOBText.kolicina = this.kolicinaPopup;

      console.log("NOVI OBJ", newOBText);

      if (this.namirnice.length > 0) {
        let pronadjeno = false;
        var pronadjenIndeks;
        for (let i = 0; i < this.namirnice.length; i++) {
          console.log("111", this.namirnice[i].nam_naziv);
          console.log("222", this.search + "");
          if (this.namirnice[i].nam_naziv.trim() == this.search.trim()) {
            pronadjeno = true;
            pronadjenIndeks = i;
          }
        }

        if (pronadjeno && this.kolicinaPopup != "") {
          let newObjNamO = new Object();
          newObjNamO.id = this.namirnice[pronadjenIndeks].nam_id;
          newObjNamO.imeNamirnice = this.namirnice[pronadjenIndeks].nam_naziv;
          newObjNamO.kolicina = this.kolicinaPopup;
          console.log("KAKAV JE OBJ", newObjNamO);
          this.odabrano.push(newObjNamO);
          this.kolicinaPopup = "";

          let myModal = document.getElementById("modalUnesiNamirnice");
          myModal.style.display = "none";
        } else {
          if (this.kolicinaPopup != "" && this.search != "") {
            this.odabrano.push(newOBText);
            this.kolicinaPopup = "";
            let myModal = document.getElementById("modalUnesiNamirnice");
            myModal.style.display = "none";
            console.log("KAKAV JE OBJ 2", newOBText);
          }
        }
      } else {
        if (this.kolicinaPopup != "" && this.search != "") {
          this.odabrano.push(newOBText);
          this.kolicinaPopup = "";
          let myModal = document.getElementById("modalUnesiNamirnice");
          myModal.style.display = "none";
          console.log("KAKAV JE OBJ 2", newOBText);
        }
      }
      this.brojNamirnicaZaSlanje();
    },
    // ukloni iz odabrano rucno uneto ime sastojka
    ukloniOdabranoText() {
      let myModal = document.getElementById("modalUnesiNamirnice");
      myModal.style.display = "none";
      console.log("uklanjam", this.odabrano);
    },

    // za unos sliek recepta
    handleFileUpload() {
      this.file = this.$refs.file.files[0];
    },

    potvrdiNamirnicu() {
      if (this.odabranaNamId != "" && this.kolicina != "") {
        let newObjNam = new Object();
        newObjNam.id = this.odabranaNamId;
        newObjNam.imeNamirnice = this.odabranaNamName;
        newObjNam.kolicina = this.kolicina;
        this.odabrano.push(newObjNam);
        let myModal = document.getElementById("modalUnesiNamirniceCheckbox");
        myModal.style.display = "none";
        this.brojNamirnicaZaSlanje();
      }
    },

    // api: unesiRecept
    // unesi recept u bazu
    unosRecepta() {
      console.log("SALJE SE SERVERU", this.odabrano);

      this.brojNamirnicaZaSlanje();

      let slika = this.velicinaFajla();

      this.$v.$touch();

      console.log("BROJ NAMIRNICA ZA SLANJE", this.odabrano.length);

      if (
        this.$v.$error === false &&
        slika === true &&
        this.brojNamirnicaGreska === true
      ) {
        let kolicina = [];

        for (let i = 0; i < this.odabrano.length; i++) {
          if (this.odabrano[i].kolicina != undefined) {
            kolicina.push(this.odabrano[i].kolicina);
          }
        }

        console.log(kolicina);

        let obj = {
          receptNaziv: this.nazivRecepta,
          sid: window.localStorage.getItem("sid"),
          receptVreme: this.vremePripreme,
          receptSadrzaj: this.opisRecepta,
          rec_posno: +this.posno,
          namirnice: this.odabrano,
          kolicina: kolicina,
          idObrok: this.id_obrok,
          kat_id: this.kat_id
        };
        api
          .unesiRecept(obj)
          .then(response => {
            console.log("STA MI PORUCUJE SERVER?", response.data.Poruka);
            this.$store.state.Info = response.data.Poruka;
            this.unesiSliku(response.data.insertQuery[0].id);
          })
          .catch(function() {
            console.log("NEKA GRESKA UHVACENA!!!");
          });
      }
    },
    // unesi sliku u bazu
    unesiSliku(receptId) {
      console.log("SLIKA KOJU UNOSIM", this.file);
      let unosSlike = new FormData();
      unosSlike.append("file", this.file);
      unosSlike.append("rec_id", receptId);
      unosSlike.append("sid", window.localStorage.getItem("sid"));

      let config = {
        header: {
          "Content-Type": "multipart/form-data"
        }
      };
      api.unesiSliku(unosSlike, config).then(response => {
        console.log("UNOS SLIKE RECEPTA", response);
      });
    },

    // proveri velicinu fajla
    velicinaFajla() {
      if (!this.file) {
        this.fajlPoruka = "Polje je obavezno!";
        return false;
      } else if (this.file.size > 200000) {
        this.fajlPoruka =
          "Vasa slika velicine " +
          this.bytesToSize(this.file.size) +
          " prelazi ogranicenje od 25KB!";
        return false;
      } else {
        this.fajlPoruka = "";
        return true;
      }
    },

    // minumum namirnica za slanje
    brojNamirnicaZaSlanje() {
      if (this.odabrano.length < 3) {
        this.brojNamirnicaGreska =
          "Minimum namirnica preostalo: " + (3 - this.odabrano.length);
        return false;
      } else {
        this.brojNamirnicaGreska = true;
      }
    },

    // pretvori bajtove u kb
    bytesToSize(bytes) {
      var sizes = ["Bytes", "KB", "MB", "GB", "TB"];
      if (bytes == 0) return "0 Byte";
      var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
      return Math.round(bytes / Math.pow(1024, i), 2) + " " + sizes[i];
    },

    // prikazi kategorije iz baze
    prikaziKategorije() {
      let params = {
        sid: window.localStorage.getItem("sid")
      };

      let ListaKategorija = { params: params };
      api.receptiKategorije(ListaKategorija).then(response => {
        this.kategorije = response.data.showQuery;

        console.log("VRACENE KATEGORIJE", this.kategorije[0].vrs_naziv);
      });
    },

    // ukloni namirnicu iz odabrano
    ukloniNamirnicu(index) {
      this.odabrano.splice(index, 1);

      console.log("POSLE BRISANJA NAMIRNICE", this.odabrano);
      console.log("POSLE BRISANJA KOLICINE", this.namirniceKolicina);
    },

    // pretrazi namirnice
    pokreniPretraguNamirnica() {
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
      }
      this.timeoutId = setTimeout(() => {
        this.prikaziNamirnice();
      }, 500);
    },

    // 'uncekiraj' 'checkbox'
    uncheck() {
      let cekirano = document.getElementsByClassName("probaZaUncheck");
      console.log(cekirano[0]);
      cekirano[this.indexCekirano].checked = false;
    }
  }
};
</script>

<style scoped>
#moji-recepti {
  width: 665px;
  margin: 0 auto;
}

.trazeneNamirnice {
  width: 250px;
  padding-left: 20px;
  position: absolute;
  top: 70px;
  left: 0px;
  background-color: #fff;
  z-index: 100;
}

#moji-recepti h1,
h2 {
  text-align: center;
}

.kolicina p {
  padding: 15px;
}

.kolicina input {
  width: 50%;
  margin: 0 auto;
}

.kolicina button {
  width: 40%;
  margin: 0 auto;
  margin-bottom: 5px;
}
.odabraneNamirnice {
  width: 100%;
  float: left;
  margin-left: 400px;
}

.odabraneNamirnice p {
  text-align: left;
  width: 60%;
  background-color: linen;
  display: inline-block;
  float: right;
}

.pretragaNamirnica {
  position: relative;
}
.form-control-file,
.form-control-range {
  width: 200px;
}

.form-check {
  display: inline-block;
}

.popupKolicina {
  width: 298px;
  height: 165px;
  background-color: #fff;
  opacity: 1;
  margin: 0 auto;
  margin-top: 50px;
}

.modalNamIme {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgb(0, 0, 0);
  opacity: 0.6;
  z-index: 2222;
}

.closeModalNamText {
  cursor: pointer;
  font-size: 20px;
}

.ukloniNamirnicuDugme {
  cursor: pointer;
}
.receptTekst {
  width: 100%;
}

.posnoCheckbox {
  display: block;
  margin-bottom: 15px;
}

.contaktFormREcepti {
  padding-top: 40px;
}

.contaktFormREcepti .form-control:focus {
  border-color: #ffde80;
  box-shadow: 0 0 0 0.2rem rgba(255, 150, 0, 0.25);
}

.kategorijaInput,
.obrokInput,
.zaKolikoOsobaInput,
.vremePripremeInput {
  width: 45%;
  float: left;
}
.obrokInput,
.zaKolikoOsobaInput {
  float: right;
}
.modalWrapper,
.modalWrapperCheckbox {
  display: none;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2000;
  background-color: rgba(0, 0, 0, 0.38);
}
.mojModal {
  width: 300px;
  background-color: #dec376;
  margin: 0 auto;
  padding: 20px;
  margin-top: 300px;
}
</style>
