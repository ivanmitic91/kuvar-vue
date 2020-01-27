<template>
  <div class="receptiOdobri">
    <div class="receptiInputEdit">
      <div class="form-group d-inline-block">
        <label class="mr-sm-2" for="inlineFormCustomSelect">Pretraga po imenu</label>
        <input
          @keyup="pokreniPretragu()"
          type="text"
          v-model="search"
          class="form-control"
          placeholder="Pretraga recepta"
        />
      </div>
      <div class="col-auto pretragaPoRoli pr-0">
        <label class="mr-sm-2" for="inlineFormCustomSelect">Objavljeno</label>
        <select
          @change="postaviRoluPretraga($event)"
          class="custom-select mr-sm-2"
          id="inlineFormCustomSelect"
        >
          <option value="0" selected>Svi recepti</option>
          <option value="1">Objavljeni recepti</option>
          <option value="2">Neobjavljeni recepti</option>
        </select>
      </div>
    </div>
    <p class="brisanjeReceptaInfo">{{ this.$store.state.ServerMessage }}</p>
    <div v-for="(recept, index) in recepti" :key="index" class="recepti mb-2">
      <p class="d-inline-block m-0 mr-4">
        <img height="79px" width="100px" v-bind:src="$store.state.putanjaDoSlike+recept.img_link" />
      </p>
      <p class="d-inline-block mr-4">
        <b>Naslov:</b>
        {{ recept.rec_naziv }}
      </p>

      <p class="d-inline-block">
        <b>Datum objave</b>
        {{ recept.rec_uneto_datuma }}
      </p>

      <div class="dugmiciOdobri float-right mt-4">
        <button
          @click="modalOdobri(recept.rec_id)"
          data-toggle="modal"
          data-target="#exampleModalCenter"
          class="btn btn-success mr-3"
        >Vise detalja</button>
        <button
          @click="modalIzmeni(recept)"
          data-toggle="modal"
          data-target="#modalEdit"
          class="btn btn-secondary"
        >Izmeni</button>
      </div>
    </div>

    <Pagination
      @prikazi="prikaziRecepte"
      v-bind:items="recepti"
      v-bind:number_of_items="broj_recepata"
      v-bind:number_per_page="broj_po_stranici"
    />

    <!-- Modal ODOBRI -->
    <div
      class="modal fade"
      id="exampleModalCenter"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalCenterTitle"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered text-center" role="document">
        <div v-if="receptPojedinacno[0]" class="modal-content">
          <div class="modal-header d-block">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <div aria-hidden="true">&times;</div>
            </button>
            <div>
              <h2>{{ receptPojedinacno[0].rec_naziv }}</h2>
            </div>
          </div>
          <div class="modal-body">
            <p class="numColor p-3">{{ receptPojedinacno[0].rec_opis_recepta }}</p>
            <p>
              <img
                width="290px"
                height="200px"
                v-bind:src="$store.state.putanjaDoSlike+receptPojedinacno[0].img_link"
              />
            </p>
            <p>
              <b>Datum objave:</b>
              <span class="ml-2 numColor p-1">{{ receptPojedinacno[0].rec_uneto_datuma }}</span>
            </p>
            <p>
              <b>Odobreno?:</b>
              <span
                class="ml-2 numColor p-1"
              >{{ receptPojedinacno[0].rec_odobreno === 1 ? 'Da' : 'Ne' }}</span>
            </p>
            <p>
              <b>Vreme pripreme:</b>
              <span class="ml-2 numColor p-1">{{ receptPojedinacno[0].rec_vreme_pripreme }} minuta</span>
            </p>
            <p>
              <b>Kategorija:</b>
              <span class="ml-2 numColor p-1">{{ kategorijaRecepta }}</span>
            </p>
            <p>
              <b>Posno?:</b>
              <span class="ml-2 numColor p-1">{{ posno == 1 ? 'Da' : 'Ne' }}</span>
            </p>

            <div>
              <b>Namirnice:</b>
              <ul
                class="list-unstyled"
                v-for="(namirnice, index) in receptPojedinacno"
                :key="index"
              >
                <li class="prikaziNamirnice">
                  <span class="mr-3 ml-4">{{ namirnice.nam_naziv }} {{ namirnice.kolicina }}</span>
                  <img
                    width="60px"
                    class="mr-2 float-right"
                    v-bind:src="$store.state.putanjaDoSlike+namirnice.nam_link"
                  />
                </li>
              </ul>
            </div>
            <!-- <p class="text-info">{{ recInfo }}</p> -->
          </div>

          <div class="modal-footer">
            <div class="dugmiciRecept">
              <button
                v-if="receptPojedinacno[0].rec_odobreno == 0"
                @click="odobriRecept(receptPojedinacno[0].rec_id)"
                type="button"
                class="btn btn-success mr-3"
              >Odobri</button>
              <button
                data-dismiss="modal"
                aria-label="Close"
                @click="obrisiRecept(receptPojedinacno[0].rec_id)"
                type="button"
                class="btn btn-danger"
              >Obrisi</button>
            </div>
            <h2 class="text-center text-info">{{ this.$store.state.Info }}</h2>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal EDIT -->
    <div
      class="modal fade"
      id="modalEdit"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalCenterTitle"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header d-block">
            <!------- IZMENA RECEPTA ---- -->
            <button
              @click="namirniceGreska = ''"
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <div aria-hidden="true">&times;</div>
            </button>
            <h2 class="text-center">Izmeni recept</h2>
          </div>
          <div class="modal-body">
            <div class="form-group" id="grupaImeRecepta">
              <label>Ime recepta</label>
              <input v-model="rec_naziv" type="text" class="form-control" placeholder />
            </div>
            <div class="form-group" id="grupaVremeRecepta">
              <label>Vreme pripreme</label>
              <input v-model="rec_vreme_pripreme" type="number" class="form-control" placeholder />
            </div>
            <div class="form-group uputstvoWrapper">
              <label>Uputstvo</label>
              <textarea v-model="opis_recepta" class="form-control" rows="7"></textarea>
            </div>
            <div class="form-check">
              <label class="form-check-label">
                <input
                  :checked="this.posno"
                  v-model="posno"
                  type="checkbox"
                  class="form-check-input"
                />
                Posno?
              </label>
            </div>

            <div class="form-group fileWrapper">
              <label>Slika recepta</label>
              <input
                type="file"
                class="form-control-file"
                id="file"
                ref="file"
                v-on:change="handleFileUpload()"
              />
            </div>

            <div class="form-check">
              <label class="form-check-label">
                <input
                  :checked="rec_odobreno"
                  type="checkbox"
                  class="form-check-input"
                  v-model="rec_odobreno"
                />
                Odobreno?
              </label>
            </div>

            <div v-if="rec_namirnice" class="namirniceWrapper">
              <p class="text-left mt-3">Namirnice</p>
              <p class="text-info">{{ deleteNamInfo}}</p>
              <p class="text-info">{{ insertNamInfo}}</p>
              <div class="namirniceLista">
                <div
                  v-for="(rec_namirnica, index) in rec_namirnice"
                  :key="index"
                  class="mt-2 dotateNamirnice"
                >
                  <div class="namirniceInput">
                    <p class="obrisiNamirnicuEdit">
                      <span @click="obrisiNamirnicuEditBaza(rec_namirnice[index].nam_id)">
                        <i class="fa fa-trash-o mr-3" aria-hidden="true"></i>
                      </span>
                      {{ rec_namirnice[index].nam_naziv }}
                    </p>

                    <p class="namirniceKolicina">{{rec_namirnice[index].kolicina}}</p>
                  </div>
                </div>

                <div
                  v-for="(namirnicaZaSlanje, index) in namirniceZaSlanje"
                  :key="index +rec_namirnice.length"
                  class="namirniceInput"
                >
                  <p @click="ukloniIzNizaNamirnicu(index)" class="obrisiNamirnicuEdit">
                    <i class="fa fa-trash-o mr-3" aria-hidden="true"></i>
                    {{ namirnicaZaSlanje.imeNamirnice }}
                  </p>
                  <p class="namirniceKolicina">{{ namirnicaZaSlanje.kolicina}}</p>
                </div>
              </div>
              <p>Dodaj novu namirnicu</p>
              <div class="form-group">
                <input
                  @keyup="pretraziNamirnice"
                  v-model="pretragaNamirnice"
                  type="text"
                  class="form-control unosNazivaNamirnice"
                  placeholder="pronadji namirnicu"
                />
              </div>
              <div class="form-group">
                <input
                  placeholder="kolicina"
                  v-model="kolicinaZaNamirnicu"
                  type="text"
                  class="form-control unosKolicineNamirnice"
                />
              </div>
              <p class="text-danger">{{ namirniceGreska }}</p>

              <div v-show="pretragaNamirnice !== ''" class="pronadjenaNamirnica">
                <button
                  class="btn btn-warning"
                  @click="dodajNamirnicuUOdabrane(pronadjenaNamirnicaId, kolicinaZaNamirnicu, pronadjenaNamirnicaIme)"
                >+</button>
                <span class="ml-4">{{ pronadjenaNamirnicaIme }}</span>
              </div>
            </div>

            <div v-if="kategorijaEdit" class="kategorijaWrapper">
              <label for>Kategorija</label>
              <div class="form-group">
                <select v-model="izmenjenaKategorija" class="form-control">
                  <option
                    :value="kategorija.vrs_id"
                    :selected="kategorijaEdit[0].vrs_naziv == kategorija.vrs_naziv"
                    v-for="(kategorija, index) in recipeCategories"
                    :key="index"
                  >{{ kategorija.vrs_naziv}}</option>
                </select>
              </div>
            </div>

            <div v-if="obrociEdit" class="obrokWrapper">
              <label>Obrok</label>
              <div class="form-group">
                <select v-model="izmenjenObrok" class="form-control">
                  <option
                    :value="obroci.obr_id"
                    :selected="obrociEdit[0].obr_naziv == obroci.obr_naziv "
                    v-for="(obroci, index) in obrociLista"
                    :key="index"
                  >{{ obroci.obr_naziv }}</option>
                </select>
              </div>
            </div>

            <button @click="promeniRecept(receptIzmeni.rec_id)" class="btn btn-warning mt-4">Promeni</button>
          </div>
          <h2 class="text-center text-info">{{ this.$store.state.Info }}</h2>
          <div class="modal-footer"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/api.js";
import Pagination from "../../../components/Pagination.vue";
export default {
  name: "home",
  components: {
    Pagination
  },
  data() {
    return {
      sid: window.localStorage.getItem("sid"),
      recepti: [],
      receptPojedinacno: "",
      broj_recepata: 0,
      receptIzmeni: "",
      rec_namirnice: "",
      kategorijaEdit: "",
      recipeCategories: "",
      obrociEdit: "",
      obrociLista: "",

      rec_naziv: "",
      file: null,
      rec_vreme_pripreme: "",
      rec_odobreno: null,

      opis_recepta: "",
      receptIzmeniOpis: "",
      posno: "",
      broj_po_stranici: 8,
      search: "",
      receptZaIzmenu: "",
      proba: false,

      izmenjenaKategorija: "",
      namirnice: [],
      izmenjenObrok: "",
      pretragaNamirnice: "",
      kolicinaZaNamirnicu: "",
      pronadjenaNamirnicaIme: "",
      pronadjenaNamirnicaId: "",
      namirniceZaSlanje: [],
      objavljenoPretraga: 0,

      // poruke za brisanje
      deleteNamInfo: "",
      insertNamInfo: "",
      kategorijaRecepta: "",
      namirniceGreska: ""
    };
  },
  mounted() {
    this.$store.state.Info = "";
    this.$store.state.ServerMessage = "";
    this.deleteNamInfo = "";
    this.insertNamInfo = "";
    this.namirniceGreska = "";

    this.prikaziRecepte();
    this.recipesCategories();
    this.recipesObroci();
    this.prikaziNamirnice();
    this.pretraziNamirnice();
  },
  methods: {
    // prikazi recepte iz baze
    prikaziRecepte(pageNumber = 0) {
      let params = {
        sid: window.localStorage.getItem("sid"),
        page: pageNumber,
        str: 8,
        search: this.search,
        isPublish: this.objavljenoPretraga
        // 0 sve
        // 1 objavljeni
        // 2 neobjavljeni
      };
      let ListaRecepata = { params: params };
      api.showRecipes(ListaRecepata).then(response => {
        this.recepti = response.data.showQuery;
        this.broj_recepata = response.data.countQuery[0].total_rec;
        console.log("DOBIJENI RECEPTI", this.recepti);
        console.log("DOBIJENI BROJ RECEPATA", this.broj_recepata);
      });
    },
    // modal za prikaz recepta za odobravanje
    modalOdobri(idRecept) {
      this.$store.state.ServerMessage = "";
      if (this.$store.state.Info != "") {
        this.$store.state.Info = "";
      }
      let params = {
        sid: window.localStorage.getItem("sid"),
        idRecept: idRecept
      };
      let paramsForRecipe = { params: params };
      api.receptiPojedinacno(paramsForRecipe).then(response => {
        console.log("PARAMETRI ZA RECEPT", paramsForRecipe);
        this.receptPojedinacno = response.data.showQuery;
        this.kategorijaRecepta = response.data.showCatQuery[0].vrs_naziv;

        console.log(
          "KATEGORIJA  RECEPT",
          response.data.showCatQuery[0].vrs_naziv
        );
        console.log("POJEDINACNI  RECEPT", this.receptPojedinacno);
      });
    },
    // modal za odobravanje recepta
    odobriRecept(recept_id) {
      let params = {
        sid: window.localStorage.getItem("sid"),
        idRecepta: recept_id,
        publish: 1
      };
      api.receptiOdobri(params).then(response => {
        console.log("RECEPTI ODOBRI RESPONSE", response);
        this.$store.state.Info = response.data.Success;
        this.prikaziRecepte();
      });
    },
    // obrisi recept iz baze
    obrisiRecept(idRecepta) {
      let params = {
        sid: window.localStorage.getItem("sid"),
        idRecepta: idRecepta
      };
      let receptObrisi = { params: params };

      api.showRecipesDelete(receptObrisi).then(response => {
        this.prikaziRecepte();
        this.$store.state.ServerMessage = response.data.Success;
        console.log("BRISANJE RESPONSE", response.data.Success);
        console.log("BRISANJE SALJEM PARAMETRE", receptObrisi);
      });
    },
    // modal za prikaz promene recepta
    modalIzmeni(recept) {
      this.$store.state.ServerMessage = "";
      this.$store.state.Info = "";
      this.deleteNamInfo = "";
      this.insertNamInfo = "";
      this.receptZaIzmenu = recept;
      let params = {
        sid: window.localStorage.getItem("sid"),
        idRecept: recept.rec_id
      };

      let paramsForRecipe = { params: params };
      api.receptiPojedinacno(paramsForRecipe).then(response => {
        console.log("SADSADSADASD", response.data.showQuery);
        console.log("KATEGORIJE", response.data.showCatQuery);

        if (this.proba === false) {
          (this.receptIzmeni = response.data.showQuery[0].rec_id),
            (this.rec_naziv = response.data.showQuery[0].rec_naziv),
            (this.rec_vreme_pripreme =
              response.data.showQuery[0].rec_vreme_pripreme);
          this.opis_recepta = response.data.showQuery[0].rec_opis_recepta;
          this.posno = response.data.showQuery[0].rec_posno;
          this.rec_odobreno = response.data.showQuery[0].rec_odobreno;
          this.rec_namirnice = response.data.showQuery;

          this.kategorijaEdit = response.data.showCatQuery;

          this.izmenjenaKategorija = response.data.showCatQuery[0].vrs_id;

          this.izmenjenObrok = response.data.showObrokQuery[0].obr_id;

          this.obrociEdit = response.data.showObrokQuery;
        } else {
          this.rec_namirnice = response.data.showQuery;
        }
        this.proba = false;

        this.namirniceZaSlanje = [];
      });
    },

    // unos slike recepta
    handleFileUpload() {
      this.file = this.$refs.file.files[0];
    },

    // metod za promenu recepta u bazi
    promeniRecept() {
      //API showRecipesEdit

      let izmenjeneNamirniceSlanje = [];
      for (let i = 0; i < this.rec_namirnice.length; i++) {
        console.log("IZNENJENE NAMIRNICE", this.rec_namirnice[i].nam_naziv);
        izmenjeneNamirniceSlanje.push(this.rec_namirnice[i].nam_naziv);
      }
      let obj = {
        receptName: this.rec_naziv,
        sid: window.localStorage.getItem("sid"),
        rec_id: this.receptIzmeni,
        rec_vreme_pripreme: this.rec_vreme_pripreme,
        rec_odobreno: this.rec_odobreno,
        rec_posno: +this.posno,
        rec_opis_recepta: this.opis_recepta,
        idObrok: this.izmenjenObrok,
        kat_id: this.izmenjenaKategorija
      };

      this.dodajNamirniceZaRecept();

      console.log("EDITOVANE NAMIRNICE ZA SLANJE", izmenjeneNamirniceSlanje);

      api.showRecipesEdit(obj).then(response => {
        console.log("EDIT RECEPTA", response);
        this.unesiSliku(this.receptIzmeni);
        this.modalIzmeni(this.receptZaIzmenu);
        this.$store.state.Info = response.data.PorukaEdit;
        this.prikaziRecepte();
      });
    },

    // metod za unos slike u bazu
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

    // priakzi kategorije iz baze
    recipesCategories() {
      let params = {
        sid: this.sid
      };
      let ListaKategorija = { params: params };
      api.receptiKategorije(ListaKategorija).then(response => {
        console.log("KATEGORIJE", response);
        console.log(ListaKategorija);
        this.recipeCategories = response.data.showQuery;
        console.log("KATEGORIJE", this.recipeCategories);
      });
    },
    // prikazi obroke iz baze
    recipesObroci(obrokId = 0) {
      let params = {
        sid: this.sid,
        idObrok: obrokId
      };
      let obroci = { params: params };
      api.prikaziObroke(obroci).then(response => {
        console.log("RECEPT OBROCI", response);
        this.obrociLista = response.data.showObrQuery;
        console.log("OBROCI LSTA", this.obrociLista);
      });
    },
    // dodajNoviInputForm() {
    //   this.namirniceUnos.push({
    //     naziv_namirnice: ""
    //   });
    // },

    // obrisiNamirnicuForm(index) {
    //   this.namirniceUnos.splice(index, 1);
    // },

    // obrisi namirnicu iz baze
    obrisiNamirnicuEditBaza(idNamirnice) {
      let params = {
        sid: window.localStorage.getItem("sid"),
        idNamirnice: idNamirnice,
        idRecept: this.receptIzmeni
      };
      let deleteParams = { params: params };
      api
        .obrisiNamirnicuIzRecepta(deleteParams)
        .then(response => {
          console.log(params);
          console.log(deleteParams);
          console.log(response.data.deleteNamQuery);
          this.deleteNamInfo = response.data.deleteNamQuery;

          this.proba = true;
          this.modalIzmeni(this.receptZaIzmenu);
        })
        .catch(error => {
          console.log("CATCH");
          console.log("Brisanje namirnice", error);
        });
    },

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
        console.log("NAMIRNICE", this.namirnice);
      });
    },

    // pretrazi namirnice
    pretraziNamirnice() {
      var foundValue = this.namirnice.filter(obj =>
        obj.nam_naziv.includes(this.pretragaNamirnice)
      );

      if (foundValue.length > 0) {
        console.log("PRONADJENO", foundValue[0].nam_naziv);
        this.pronadjenaNamirnicaIme = foundValue[0].nam_naziv;
        this.pronadjenaNamirnicaId = foundValue[0].nam_id;
      }
    },

    // dodaje namirnice u spisak
    dodajNamirnicuUOdabrane(idNamirnice, kolicinaZaNamirnicu, imeNamirnice) {
      let obj = new Object();
      obj.id = idNamirnice;
      obj.kolicina = kolicinaZaNamirnicu;
      obj.imeNamirnice = imeNamirnice;
      if (
        idNamirnice !== "" &&
        kolicinaZaNamirnicu !== "" &&
        imeNamirnice !== ""
      ) {
        this.namirniceZaSlanje.push(obj);
        this.namirniceGreska = "";
      } else {
        this.namirniceGreska = "Morate uneti naziv namirnice i njenu kolicinu!";
      }
      console.log("MOJ OBJEKAT SA ID NAMIRICAMA", this.namirniceZaSlanje);
    },

    //API ZA POST dodajNamirnicuURecept

    // unesi namirnicu za recept u bazu
    dodajNamirniceZaRecept() {
      let params = {
        sid: window.localStorage.getItem("sid"),
        namirniceNiz: this.namirniceZaSlanje,
        idRecept: this.receptIzmeni
      };
      api.dodajNamirnicuURecept(params).then(response => {
        console.log(
          "PORUKA SERVERA ZA UNOS NAMIRNICA",
          response.data.insertNamQuery
        );
        this.insertNamInfo = response.data.insertNamQuery;
      });
    },
    pokreniPretragu() {
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
      }
      this.timeoutId = setTimeout(() => {
        this.prikaziRecepte();
      }, 500);
    },
    // pretrazi po objavljeno/neobjavljeno
    postaviRoluPretraga(objavljeno) {
      (this.objavljenoPretraga = objavljeno.target.value),
        this.prikaziRecepte();
      console.log("Rola", this.objavljenoPretraga);
    },
    // ukloni namirnicu iz spisaka
    ukloniIzNizaNamirnicu(index) {
      this.namirniceZaSlanje.splice(index, 1);
    }
  }
};
</script>

<style>
.receptiOdobri {
  width: 940px;
  margin: 0 auto;
  padding-top: 30px;
  height: 500px;
}

.receptiOdobri p {
  text-align: center;
}

.recepti {
  border: 1px solid #ccc;
}

.receptiOdobri .opisRecepta {
  text-align: justify;
}

.dugmiciOdobri {
  width: 200px;
  margin: 0 auto;
}

.dugmiciRecept {
  margin: 0 auto;
}

.brisanjeReceptaInfo {
  color: green;
  font-size: 30px;
}

.namirniceInput {
  width: 90%;
  margin: 0 auto;
}

.obrisiNamirnicuEdit {
  width: 73%;
  float: left;
  /* font-size: 30px; */
  cursor: pointer;
}
.namirniceInput p {
  text-align: left;
}
.clear {
  clear: both;
}

.unosNazivaNamirnice {
  width: 70%;
  float: left;
  display: inline-block;
  margin-right: 5%;
}

.unosKolicineNamirnice {
  width: 25%;
  display: inline-block;
}

.modal-content {
  background-color: #dec376;
}

/* #grupaImeRecepta,
#grupaVremeRecepta {
  display: none;
} */

.namirniceLista {
  background-color: bisque;
  padding: 10px;
  margin-bottom: 15px;
}

.namirniceWrapper,
.fileWrapper,
.uputstvoWrapper {
  border: 1px solid #fff;
  margin-top: 10px;
  border-left: 0;
  border-right: 0;
}

.uputstvoWrapper {
  border-top: 0;
}

.fileWrapper,
.uputstvoWrapper {
  padding: 25px 0px;
}

.receptiOdobri .modal-body {
  padding: 40px;
}

.kategorijaWrapper,
.obrokWrapper {
  margin-top: 20px;
  width: 45%;
  float: left;
}

.obrokWrapper {
  float: right;
}

.namirniceWrapper .fa {
  font-size: 20px;
  color: red;
}

.pronadjenaNamirnica {
  background-color: yellowgreen;
  width: 70%;
}

#modalEdit .modal-dialog {
  max-width: 660px;
}

.receptiOdobri .modal-dialog {
  max-width: 1000px;
}

.receptiOdobri .prikaziNamirnice {
  background-color: bisque;

  width: 400px;
  margin: 0 auto;
  overflow: hidden;
  line-height: 60px;
}

.receptiInputEdit {
  width: 422px;
  margin: 0 auto;
}

.numColor {
  background-color: bisque;
}
</style>
