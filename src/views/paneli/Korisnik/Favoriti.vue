<template>
  <div class="favoriti">
    <div class="form-group pretragaFavorita mb-4 contactForm">
      <input
        @keyup="pokreniPretragu()"
        v-model="searchFavorites"
        type="text"
        class="form-control"
        placeholder="pretraga favorita"
      />
    </div>
    <section class="homePageFavoriti">
      <SingleRecipe v-bind:recipes="receptiFavoriti" />
      <Pagination
        @prikazi="prikaziRecepteFavorite"
        v-bind:items="receptiFavoriti"
        v-bind:number_of_items="broj_recepata"
        v-bind:number_per_page="broj_po_stranici"
      />
      <div class="text-center" v-if="broj_recepata === 0">
        <h2 class="mb-4">Trenutno nema nijedan recept</h2>
        <img width="40%" src="../../../assets/emoticonSad.png" />
      </div>
    </section>
  </div>
</template>

<script>
import api from "@/api.js";
import SingleRecipe from "../../../components/SingleRecipe.vue";
import Pagination from "../../../components/Pagination.vue";
export default {
  data() {
    return {
      receptiFavoriti: [],
      broj_recepata: 0,
      searchFavorites: "",
      page: 0,
      broj_po_stranici: 8
    };
  },
  mounted() {
    this.prikaziRecepteFavorite();
  },
  components: {
    Pagination,
    SingleRecipe
  },
  methods: {
    // prikazi omiljene recepte iz baze
    prikaziRecepteFavorite(pageNumber = 0) {
      let params = {
        sid: window.localStorage.getItem("sid"),
        page: pageNumber,
        search: this.searchFavorites
      };
      let ListaRecepataFavoriti = { params: params };
      api.mojiFavoriti(ListaRecepataFavoriti).then(response => {
        this.broj_recepata = response.data.countQuery[0].total_rec;
        this.receptiFavoriti = response.data.showQuery;
        console.log("BROJ RECEPATA", this.broj_recepata);
        console.log("RECEPTI FAVORITI", response.data);
      });
    },

    // pretrazi omiljene recepte
    pokreniPretragu() {
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
      }
      this.timeoutId = setTimeout(() => {
        this.prikaziRecepteFavorite();
      }, 500);
    }
  }
};
</script>

<style scoped>
.favoriti {
  width: 1230px;
  margin: 0 auto;
  padding-top: 20px;
}

.favoriti .paginateWrapper {
  margin-top: 0;
}

.pretragaFavorita {
  width: 300px;
  margin: 0 auto;
}
@media only screen and (min-width: 1200px) and (max-width: 1600px) {
  .favoriti {
    width: 1060px;
  }

  .colRecipeFav {
    margin-right: 10px;
  }
}
</style>
