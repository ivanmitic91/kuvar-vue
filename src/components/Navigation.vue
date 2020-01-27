<template>
  <div id="nav">
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <span class>
        <img height="50px" src="../assets/logo.png" alt="logo" />
      </span>
      <h4>Kuvar</h4>
      <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse ml-4" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto ml-4">
          <li class="nav-item active">
            <a class="nav-link" href="#homePage">
              Pocetna
              <span class="sr-only">(current)</span>
            </a>
          </li>
          <li class="nav-item">
            <!-- 0 - ako se posalje vraca sve recepte iz baze -->
            <!-- salje se preko 'bus-a' 'id' 'kategorije' daljoj komponenti -->
            <a @click="CategoryId(0)" class="nav-link" href="#recipes">Recepti</a>
          </li>
          <li class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle"
              href="#"
              id="navbarDropdown"
              role="button"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >Vrste jela</a>
            <div class="dropdown-menu" aria-labelledby="navbarDropdown">
              <span v-for="(category, index) in recipeCategories" :key="index">
                <a
                  @click="CategoryId(category.vrs_id)"
                  class="dropdown-item"
                  href="#recipes"
                >{{ category.vrs_naziv }}</a>
              </span>
            </div>
          </li>

          <li class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle"
              href="#"
              id="navbarDropdown"
              role="button"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >Tip obroka</a>
            <div class="dropdown-menu" aria-labelledby="navbarDropdown">
              <span v-for="(obroci, index) in obrociListaNav" :key="index">
                <!-- salje se preko 'bus-a' 'id' 'obroka' daljoj komponenti -->
                <a
                  class="dropdown-item"
                  @click="obrokId(obroci.obr_id)"
                  href="#recipes"
                >{{ obroci.obr_naziv}}</a>
              </span>
            </div>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#aboutPageLink">O nama</a>
          </li>

          <li class="nav-item">
            <a class="nav-link" href="#contactPage">Kontakt</a>
          </li>
        </ul>

        <ul class="navbar-nav mr-2">
          <!-- prikazi samo 'logout' ako je korisnik ulogovan -->
          <li v-if="$store.state.isLoggedIn" class="nav-item">
            <router-link class="nav-link" v-on:click.native="logout()" to="#">Logout</router-link>
          </li>
          <!-- ako je rola 1 prikazi ovu navigaciju -->
          <div v-if="this.$store.state.PodaciKorisnika">
            <li
              v-if="$store.state.isLoggedIn"
              class="nav-item"
              v-show="this.$store.state.PodaciKorisnika.role_id == 1"
            >
              <router-link class="nav-link" to="korisnici">Panel</router-link>
            </li>
          </div>
          <!-- ako je rola 2 prikazi ovu navigaciju -->
          <div v-if="this.$store.state.PodaciKorisnika">
            <li
              v-if="$store.state.isLoggedIn"
              class="nav-item"
              v-show="this.$store.state.PodaciKorisnika.role_id == 2"
            >
              <router-link class="nav-link" to="Recepti">Panel</router-link>
            </li>
          </div>
          <!-- ako je rola 3 prikazi ovu navigaciju -->
          <div v-if="this.$store.state.PodaciKorisnika">
            <li
              v-if="$store.state.isLoggedIn"
              class="nav-item"
              v-show="this.$store.state.PodaciKorisnika.role_id == 3"
            >
              <router-link class="nav-link" to="favoriti">Panel</router-link>
            </li>
          </div>
          <!-- ako korisnik nije ulogovan prikazi link za logovanje -->
          <li v-if="!$store.state.isLoggedIn" class="nav-item">
            <router-link class="nav-link" to="/login">Login</router-link>
          </li>
        </ul>
        <!-- forma za pretragu recepata -->
        <!-- podatak za pretragu se salje preko 'bus-a' -->
        <form class="form-inline pretragaRecepata my-2 my-lg-0">
          <input
            @keyup="searchRecipe()"
            v-model="searchRecipeData"
            class="form-control mr-sm-2"
            type="search"
            placeholder="Pretrazi recepte"
            aria-label="Search"
          />
        </form>
      </div>
    </nav>
  </div>
</template>

<script>
import api from "@/api.js";
import { bus } from "../main";
export default {
  data() {
    return {
      recipeCategories: "", // kategorije recepata, dolaze iz baze
      searchRecipeData: "", //v-model za pretragu
      obrociListaNav: "" //vrste obroka za recept, dolaze iz baze
    };
  },
  mounted() {
    this.recipesCategories();
    this.recipesObroci();
  },
  methods: {
    logout() {
      this.$store.dispatch("actionLogout"); // pozovi iz 'Vuex-a' metod 'logout'
    },

    // Preuzmi kategorije recepata iz baze
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
    CategoryId(categoryId) {
      bus.$emit("categoryChanged", categoryId); //prosledi dalje komponentama
    },
    obrokId(idObrok) {
      bus.$emit("obrokChanged", idObrok); //prosledi dalje komponentama
    },
    searchRecipe() {
      bus.$emit("searchInitialized", this.searchRecipeData); //prosledi dalje komponentama
    },

    // Preuzmi vrste obroka iz baze
    recipesObroci(obrokId = 0) {
      let params = {
        sid: this.sid,
        idObrok: obrokId
      };
      let obroci = { params: params };
      api.prikaziObroke(obroci).then(response => {
        console.log("RECEPT OBROCI NAV", response);
        this.obrociListaNav = response.data.showObrQuery;
        console.log("OBROCI LSTA NAVIGACIJA", this.obrociListaNav);
      });
    }
  }
};
</script>

<style>
#nav {
  width: 100%;
  position: fixed;
  z-index: 200;
  background-color: #fff;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #000;
}

#nav a:hover {
  color: #fec94c !important;
  text-decoration: none;
}

.mainLinks {
  padding-right: 20px;
}

.frontLinks {
  width: 800px;
  float: right;
}

.loginLink {
  float: right;
  margin-right: 100px;
}

.dropbtn {
  color: white;
  font-size: 16px;
  border: none;
}

.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-content {
  display: none;
  position: absolute;
  background-color: #fff;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;
}

.dropdown-content a {
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
}

.dropdown-content a:hover {
  background-color: #ddd;
}

.dropdown:hover .dropdown-content {
  display: block;
  padding-top: 10px;
}

.dropdown:hover .dropbtn {
  color: #4354;
}
.logo {
  position: absolute;
  top: 0;
  left: 100px;
  margin-top: 5px;
}
.search {
  position: absolute;
  top: 25%;
  right: 200px;
}

.search .form-control:focus {
  border-color: #ffde80;
  box-shadow: 0 0 0 0.2rem rgba(255, 150, 0, 0.25);
}

.categoryLink {
  border-bottom: 1px solid #ffde80;
  width: 250px;
  cursor: pointer;
  line-height: 100%;
  margin: 0;
  padding: 10px;
  font-size: 20px;
  text-align: center;
  color: #000000;
}

.categoryLink:hover {
  background-color: #ffde80;
  color: #fff;
}

.searchBox {
  margin-top: -8px;
}

.pretragaRecepata .form-control:focus {
  border-color: #ffde80;
  box-shadow: 0 0 0 0.2rem rgba(255, 150, 0, 0.25);
}

@media only screen and (min-width: 1200px) and (max-width: 1500px) {
  .frontLinks {
    /* margin-left: 420px;  */
    width: 895px;
  }
}

@media only screen and (min-width: 992px) and (max-width: 1199px) {
  .frontLinks {
    width: 830px;
  }
}

@media only screen and (min-width: 768px) and (max-width: 991px) {
  .frontLinks {
    width: 830px;
  }
}

@media only screen and (max-width: 600px) {
  #nav {
    position: static;
  }
}
</style>