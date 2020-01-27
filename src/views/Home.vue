<template>
  <div class="home" id="homePage">
    <navigation />
    <div class="featureImage">
      <Carousel />
    </div>
    <p id="recipes"></p>
    <div class="wrapper">
      <section class="homePage">
        <!-- ucitaj komponentu-->
        <SingleRecipe v-bind:recipes="recipes" />
        <!-- ucitaj komponentu-->
        <!-- parametri: 'entitet' , koliko je ukupno entiteta, koliko je prikaza po strani -->
        <Pagination
          @prikazi="Recipes"
          v-bind:items="recipes"
          v-bind:number_of_items="broj_recepata"
          v-bind:number_per_page="broj_po_stranici"
        />
      </section>
      <!-- ucitaj komponentu-->
      <PopularPosts />
      <!-- ucitaj komponentu-->
      <About />
      <!-- ucitaj komponentu-->
      <Contact />
    </div>
    <Footer />
  </div>
</template>

<script>
import Contact from "./Contact.vue";
import About from "./About.vue";
import Navigation from "../components/Navigation.vue";
import api from "@/api.js";
import PopularPosts from "../components/PopularPosts";
import Carousel from "../components/Carousel";
import SingleRecipe from "../components/SingleRecipe";
import Footer from "../components/Footer";
import { bus } from "../main";
import Pagination from "../components/Pagination.vue";
export default {
  name: "home",
  components: {
    Pagination,
    Navigation,
    PopularPosts,
    Carousel,
    SingleRecipe,
    Footer,
    About,
    Contact
  },
  data() {
    return {
      sid: window.localStorage.getItem("sid"),
      recipes: [],
      page: 0,
      cat_id: 0,
      search: 0,
      broj_recepata: 0,
      broj_po_stranici: 8 // koliko vraca baza
    };
  },
  mounted() {
    this.Recipes();
  },
  // osluskuj desavanja u 'bus-u'
  created() {
    bus.$on("categoryChanged", data => {
      this.cat_id = data;
      this.Recipes();
    });
    bus.$on("obrokChanged", data => {
      this.recipesObroci(data);
    });
    bus.$on("searchInitialized", data => {
      this.search = data;
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
      }
      this.timeoutId = setTimeout(() => {
        this.Recipes();
      }, 500);
    });
  },
  // zahtevaj broj prikazanog u zavisnosti od sirine ekrana
  computed: {
    sendStr() {
      if (window.screen.availWidth < 1400) {
        return 6;
      } else {
        return 8;
      }
    }
  },
  methods: {
    //dobavi recepte iz baze
    //pageNumber , dolazi kao '$emit'
    Recipes(pageNumber = 0) {
      let params = {
        sid: this.sid,
        category_id: this.cat_id,
        page: pageNumber,
        search: this.search,
        str: this.sendStr
      };
      let ListaRecepata = { params: params };
      console.log("parametri", params);
      api.showRecipes(ListaRecepata).then(response => {
        console.log("RECIPES WITH COUNT", response);
        console.log("parametri", params);

        if (response.data.countQuery) {
          this.broj_recepata = response.data.countQuery[0].total_rec;
        }

        this.recipes = response.data.showQuery;
        console.log("BROJ RECEPATA", this.broj_recepata);
      });
    },
    // posalji 'id' obroka serveru za vracanje recepata za taj obrok
    recipesObroci(obrokId) {
      let params = {
        sid: this.sid,
        idObrok: obrokId
      };
      let obroci = { params: params };
      api.prikaziObroke(obroci).then(response => {
        console.log("RECEPT OBROCI", response);
        this.recipes = response.data.showObrQuery;
        this.broj_recepata = response.data.countQuery[0].total_rec;
        console.log("BROJ OBROKA", this.broj_recepata);
      });
    }
  }
};
</script>

<style>
html {
  scroll-behavior: smooth;
}
.featureImage {
  padding-top: 66px;
}

.wrapper {
  display: flex;
  width: 1600px;
  flex-wrap: wrap;
  margin: 0 auto;
  justify-content: space-between;
}

.image {
  height: 100px;
  padding-top: 80px;
  background-color: purple;
}

.homePage {
  width: 1230px;
  position: relative;
}

.homePage:after {
  content: "";
  flex: auto;
}
#recipes {
  padding-top: 90px;
  display: inline-block;
}

.color {
  background-color: chocolate;
  color: #fff;
}
/* Extra small devices (phones, 600px and down) */
@media only screen and (max-width: 600px) {
  .wrapper {
    width: 100%;
  }

  #recipes {
    padding-top: 0;
  }

  .colRecipe {
    width: 100%;
  }
  .featureImage {
    padding-top: 0px;
  }
}

/* Extra small devices (phones, 600px and down) */
@media only screen and (min-width: 600px) and (max-width: 767px) {
  .wrapper {
    width: 100%;
  }
  .popularRecipes {
    width: 100%;
  }

  .col {
    padding: 0;
  }

  .colRecipe {
    width: 48%;
    padding: 0;
    margin: 0 1%;
  }
  .aboutPage,
  .contactPage {
    padding: 10px;
  }

  .homePage {
    width: 100%;
  }

  .featureImage {
    padding-top: 66px;
  }
}

/* Medium devices (landscape tablets, 768px and up) */
@media only screen and (min-width: 768px) and (max-width: 991px) {
  .wrapper {
    width: 95%;
  }
  .col {
    padding: 0;
  }

  .colRecipe {
    width: 49%;
    margin-right: 0;
    margin-bottom: 32px;
  }

  .colRecipe:nth-of-type(2n) {
    margin-left: 2%;
  }
  .popularRecipes {
    width: 100%;
  }
  .homePage {
    width: 100%;
  }

  .homePage .recText {
    height: 20%;
  }

  .homePage .recInfo {
    height: 14%;
  }

  .featureImage {
    padding-top: 66px;
  }
}

/* Large devices (laptops/desktops, 992px and up) */
@media only screen and (min-width: 992px) and (max-width: 1199px) {
  .wrapper {
    width: 970px;
  }

  .homePage {
    width: 100%;
  }

  .featureImage {
    padding-top: 66px;
  }

  .col {
    padding: 0;
  }

  .colRecipe {
    width: 313px;
  }

  .colRecipe:nth-of-type(3n) {
    margin-right: 0;
  }
}
/* Extra large devices (large laptops and desktops, 1200px and up) */
@media only screen and (min-width: 1200px) and (max-width: 1600px) {
  .homePage,
  .aboutPage,
  .contactPage {
    width: 800px;
  }

  .wrapper {
    width: 1150px;
  }
  .popularRecipes {
    width: 340px;
  }
  #recipes {
    padding-top: 20px;
  }
}
</style>

