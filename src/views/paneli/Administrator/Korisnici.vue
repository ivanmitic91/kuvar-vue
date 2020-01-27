<template>
  <div class="sviKorisnici">
    <div class="innerBoxKorisnici">
      <div class="korisniciHeader pt-3">
        <div class="headerWrapper">
          <div class="form-group">
            <label class="mr-sm-2" for="inlineFormCustomSelect">Prerraga po imenu</label>
            <input
              @keyup="pokreniPretragu()"
              type="text"
              v-model="search"
              class="form-control"
              placeholder="Pretraga korisnika"
            />
          </div>
          <div class="col-auto pretragaPoRoli">
            <label class="mr-sm-2" for="inlineFormCustomSelect">Prerraga po roli</label>
            <select
              @change="postaviRoluPretraga($event)"
              class="custom-select mr-sm-2"
              id="inlineFormCustomSelect"
            >
              <option value="0" selected>Svi korisnici</option>
              <option value="1">Administartor</option>
              <option value="2">Moderator</option>
              <option value="3">Korisnik</option>
            </select>
          </div>
        </div>
      </div>

      <div
        @click="korisnikPodatak = korisnik"
        data-toggle="modal"
        data-target="#exampleModalCenter"
        v-for="korisnik in korisnici"
        :key="korisnik.kor_id"
        class="korisnik"
      >
        <div class="korisnikHeader">
          <p class="korisnik_id">
            <b>ID:</b>
          </p>
          <p class="korisnik_ime">
            <b>Ime i prezime:</b>
          </p>
          <p class="korisnik_email">
            <b>Email:</b>
          </p>
          <p class="korisnik_korisnicko_ime">
            <b>Korisnicko ime:</b>
          </p>
          <p>
            <b class="korisnik_rola">Rola:</b>
          </p>
          <p class="korisnik_datum_registracije">
            <b>Datum registracije:</b>
          </p>
        </div>

        <div class="korisnikHeader">
          <p class="korisnik_id">{{ korisnik.kor_id }}</p>
          <p class="korisnik_ime">{{ korisnik.kor_ime }} {{ korisnik.kor_prezime }}</p>
          <p class="korisnik_email">{{ korisnik.kor_email }}</p>
          <p class="korisnik_korisnicko_ime">{{ korisnik.kor_username }}</p>
          <p class="korisnik_rola">{{ rola[korisnik.kor_role_id-1] }}</p>
          <p class="korisnik_datum_registracije">{{ korisnik.kor_uneto_datuma }}</p>
        </div>
      </div>

      <!-- paginacija -->
      <Pagination
        @prikazi="prikaziKorisnike"
        v-bind:items="korisnici"
        v-bind:number_of_items="BrojKorisnika"
        v-bind:number_per_page="broj_po_stranici"
        :key="componentKey"
      />

      <!-- Modal -->
      <div
        class="modal fade"
        id="exampleModalCenter"
        tabindex="-1"
        role="dialog"
        aria-labelledby="exampleModalCenterTitle"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-dialog-centered" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5
                class="modal-title"
                id="exampleModalLongTitle"
              >{{ korisnikPodatak.kor_ime }} {{ korisnikPodatak.kor_prezime }}</h5>
              <button
                @click="porukaServera = ''"
                type="button"
                class="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <p>
                <b>Id korisnika:</b>
                {{ korisnikPodatak.kor_id }}
              </p>
              <p>
                <b>Email:</b>
                {{ korisnikPodatak.kor_email }}
              </p>
              <p>
                <b>Korisnicko ime:</b>
                {{ korisnikPodatak.kor_username }}
              </p>
              <p>
                <b>Rola:</b>
                {{ rola[korisnikPodatak.kor_role_id-1] }}
              </p>
              <p>
                <b>Datum registracije:</b>
                {{ korisnikPodatak.kor_uneto_datuma }}
              </p>
              <button
                @click="obrisiKorisnika(korisnikPodatak.kor_id)"
                type="button"
                class="btn btn-danger"
                data-dismiss="modal"
              >Obrisi korisnika</button>
            </div>

            <div class="modal-footer">
              <div class="promenaRole">
                <label class="mr-sm-2" for="inlineFormCustomSelect">Rola</label>
                <select
                  @change="postaviRolu($event, korisnikPodatak.kor_username)"
                  class="custom-select mr-sm-2"
                  id="inlineFormCustomSelect"
                >
                  <option :selected="korisnikPodatak.kor_role_id === 2" value="2">Moderator</option>
                  <option :selected="korisnikPodatak.kor_role_id === 3" value="3">Korisnik</option>
                </select>
              </div>
              <button @click="promenaRole()" type="button" class="btn btn-warning">Promeni rolu</button>
              <p class="text-white mt-2">{{ porukaServera }}</p>
            </div>
          </div>
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
      korisnici: [],
      korisnikPodatak: "",
      rola: ["Administartor", "Modedrator", "Korisnik", "Odobrenje"],
      izabranaRola: 0,
      izabranaRolaPretraga: 0,
      korisnickoIme: "",
      search: "",
      page: 0,
      BrojKorisnika: 0,
      broj_po_stranici: 10,
      porukaServera: "",
      componentKey: 0
    };
  },
  mounted() {
    this.prikaziKorisnike();
  },
  methods: {
    // prikazi korisnike iz baze
    prikaziKorisnike(pageNumber = 0) {
      let params = {
        sid: this.sid,
        role_pretraga: this.izabranaRolaPretraga,
        page: pageNumber,
        search: this.search
      };
      let ListaKorisnika = { params: params };
      api.showUsers(ListaKorisnika).then(response => {
        this.korisnici = response.data.showQuery;
        this.BrojKorisnika = response.data.countQuery[0].total_kor;
        console.log("DOBIJENI KORISNICI", this.korisnici);
        console.log("BROJ KORISNIKA", response.data.countQuery[0].total_kor);
        console.log(this.BrojKorisnika);
      });
    },
    // iz selecta postavi rolu za promenu
    postaviRolu(rola, korisnickoIme) {
      (this.izabranaRola = rola.target.value),
        (this.korisnickoIme = korisnickoIme);
      console.log("Rola", this.izabranaRola);
    },
    // prikazi korisnike po roli
    postaviRoluPretraga(rola) {
      (this.izabranaRolaPretraga = rola.target.value),
        this.forceRerenderKorisnik();
      this.prikaziKorisnike();
      console.log("Rola", this.izabranaRolaPretraga);
    },

    // promeni rolu korisniku
    promenaRole() {
      let params = {
        sid: window.localStorage.getItem("sid"),
        privilegija: this.izabranaRola,
        korisnickoIme: this.korisnickoIme
      };
      let updateParams = { params: params };
      api
        .korisnikPrivilegija(params)
        .then(response => {
          console.log(params);
          console.log("PARAMETRI ZA ROLU", updateParams);
          console.log(
            "PORUKA SA SERVERA",
            response.data.promenaPrivilegijeMessage
          );
          this.porukaServera = response.data.Success;

          this.prikaziKorisnike();
        })
        .catch(error => {
          console.log("CATCH");
          console.log("Promena role", error);
        });
    },

    // brisanje korisnika iz baze
    obrisiKorisnika(idKorisnika) {
      let params = {
        sid: window.localStorage.getItem("sid"),
        idKorisnika: idKorisnika
      };
      let deleteParams = { params: params };
      api
        .deleteKorisnika(deleteParams)
        .then(response => {
          console.log(params);
          console.log(deleteParams);
          console.log(response);
          this.prikaziKorisnike();
          this.state.ServerMessage = response.data.message;
          if (
            this.state.ServerMessage == null ||
            this.state.ServerMessage == ""
          ) {
            this.$store.commit("INFO", "Uspesno ste obrisali korisnika");
            console.log("delete korisnika kraj", response);
          }
        })
        .catch(error => {
          console.log("CATCH");
          console.log("Brisanje korisnika", error);
        });
    },

    // pretrazi korisnike
    pokreniPretragu() {
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
      }
      this.timeoutId = setTimeout(() => {
        this.prikaziKorisnike();
      }, 500);
    },
    // resetuj komponentu
    forceRerenderKorisnik() {
      this.componentKey += 1;
    }
  }
};
</script>

<style>
.innerBoxKorisnici {
  width: 1200px;
  margin: 0 auto;
  margin-bottom: 50px;
}

.innerBoxKorisnici h1 {
  text-align: center;
  margin-top: 20px;
  margin-bottom: 20px;
}

.korisnik {
  border: 1px solid #ccc;
  background-color: #fff;
  margin-bottom: 5px;
  border-radius: 10px;
  padding: 10px;
  height: 65px;
}

.korisnik:hover {
  background-color: #eee;
}

.korisnik p {
  float: left;
  text-align: center;
  margin-bottom: 0;
}

.korisnik_id {
  width: 5%;
}

.korisnik_ime {
  width: 25%;
}

.korisnik_email {
  width: 25%;
}

.korisnik_korisnicko_ime {
  width: 20%;
}

.korisnik_rola {
  width: 5%;
}

.korisnik_datum_registracije {
  width: 20%;
}

.korisnikHeader {
  margin: 0 auto;
}

.promenaRole {
  width: 145px;
  margin-right: 40px !important;
}

.modal-footer,
.promenaRole {
  display: inline-block;
}

.sviKorisnici .form-group {
  width: 200px;
  display: inline-block;
  margin: 0 auto;
  margin-bottom: 30px;
}

.pretragaPoRoli {
  display: inline-block;
  width: 200px;
}

.headerWrapper {
  width: 450px;
  margin: 0 auto;
}
</style>
