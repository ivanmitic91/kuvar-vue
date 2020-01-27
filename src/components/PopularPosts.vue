<template>
  <aside class="popularRecipes">
    <!-- prikazuje se sa desne strane 'home' stranice u vidu 'aside-a' -->
    <h3>Popularni recepti</h3>
    <!-- dobavi popularne recepte, koji dolaze iz baze u Viex -->
    <div class="popular" v-for="(favorite, index) in this.$store.state.PopularRecipes" :key="index">
      <div class="popularRecImage">
        <!-- napravi putanju slike ka serveru kombinovanjem dela putanje iz 'vuex-a' i putanje iz baze -->
        <img
          width="160px"
          height="100px"
          v-bind:src="$store.state.putanjaDoSlike+favorite.img_link"
        />
      </div>
      <div class="popularRecText">
        <!-- ako je naziv predugacak , ne prikazuj ceo naziv -->
        <router-link :to="{name: 'ShowRecipe' , params: {recipe_id: favorite.recepti_rec_id }}">
          <h4 v-if="favorite.rec_naziv.length<20">{{ favorite.rec_naziv }}</h4>
          <h4 v-else>{{ favorite.rec_naziv.substring(0,15)+".." }}</h4>
        </router-link>
      </div>
      <!-- koristi plugin 'moment' za formatiranje datuma -->
      <div class="popularRecInfo">
        <p>{{ favorite.rec_uneto_datuma | moment("Do MMMM YYYY")}}</p>
      </div>
    </div>
  </aside>
</template>

<script>
import api from "@/api.js";
export default {
  name: "PopularPosts",
  data() {
    return {};
  },
  mounted() {
    this.popularRecipes();
  },
  methods: {
    // preuzmi popularne recepte iz baze
    popularRecipes() {
      let params = {
        sid: window.localStorage.getItem("sid"),
        str: this.checkDisplayHeight()
      };
      let ListaFavorita = { params: params };
      api.receptiFavoriti(ListaFavorita).then(response => {
        console.log("FAVORITI", response);
        console.log(ListaFavorita);
        this.$store.state.PopularRecipes = response.data.showQuery;
      });
    },
    // u zavisnosti od visine ekrana prikazi 4 ili 6 kolona za popularne recepte
    checkDisplayHeight() {
      console.log("SIRINA", window.innerWidth);
      if (window.innerHeight < 800 && window.innerWidth > 1200) {
        return 4;
      } else {
        return 6;
      }
    }
  }
};
</script>

<style>
.popularRecipes {
  width: 370px;
  position: sticky;
  top: 110px;
  background-color: #fff;
  height: 100%;
  padding-left: 20px;
}

.popularRecipes h3 {
  padding-top: 20px;
  padding-bottom: 20px;
}

.popular {
  height: 100px;
  padding-right: 30px;
  margin-bottom: 20px;
}
.popularRecImage {
  margin-right: 10px;
  float: left;
}
.popularRecText {
  width: 100%;
  height: 65%;
  padding-top: 5%;
  text-align: center;
}
.popularRecText a {
  color: orange;
  text-decoration: none;
}

.popularRecText h4 {
  font-size: 18px;
}

.popularRecText a:hover {
  color: chocolate;
  text-decoration: none;
}
.popularPosts h3 {
  text-align: left;
  padding-top: 30px;
  padding-bottom: 25px;
}
.popularRecInfo {
  width: 100%;
  height: 30%;
  color: #aaa;
}

@media only screen and (min-width: 768px) and (max-width: 991px) {
  .popularRecipes {
    position: static;
    margin-top: 50px;
    width: 940px;
    padding: 0;
  }

  .popularRecipes h3 {
    text-align: center;
  }

  .popular {
    float: left;
    width: 49%;
    height: 380px;
    margin-right: 10px;
    padding-right: 0px;
    margin-bottom: 10px;
  }

  .popular:nth-of-type(2n) {
    margin-right: 0;
  }

  .popularRecImage {
    float: none;
    width: 100%;
    margin-right: 0;
  }

  .popularRecImage img {
    width: 100%;
    height: 265px;
  }

  .popularRecText {
    height: 50px;
  }
}

@media only screen and (min-width: 992px) and (max-width: 1199px) {
  .popularRecipes {
    position: static;
    margin-top: 50px;
    width: 970px;
    padding-left: 0;
  }

  .popularRecipes h3 {
    text-align: center;
  }

  .popular {
    float: left;
    width: 316px;
    height: 320px;
    margin-right: 10px;
    padding-right: 0px;
  }

  .popular:nth-of-type(3n) {
    margin-right: 0;
  }

  .popularRecImage {
    float: none;
    height: 200px;
    margin-right: 0;
  }

  .popularRecImage img {
    width: 100%;
    height: 200px;
  }

  .popularRecText {
    height: 50px;
  }
}

@media only screen and (min-width: 1200px) and (max-width: 1600px) {
  .popularRecText h4 {
    font-size: 19px;
  }

  .popularRecInfo p {
    font-size: 12px;
  }

  .popularRecipes {
    top: 80px;
  }

  .popularRecipes h3 {
    margin-top: 0;
    padding-top: 0;
  }
}

/* Tablet */
@media only screen and (min-width: 600px) and (max-width: 767px) {
  .popularRecipes {
    position: static;
    margin-top: 50px;
    width: 540px;
  }

  .popularRecInfo p {
    text-align: center;
  }
}

@media only screen and (max-width: 600px) {
  .popularRecipes {
    position: static;
    margin-top: 50px;
    width: 100%;
  }

  .popular {
    height: 118px;
  }

  .popularRecText h4 {
    font-size: 17px;
  }
}
</style>