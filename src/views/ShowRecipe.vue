<template>
  <!-- prikazi pojedinacan recept -->
  <div class="ShowRecipe">
    <NavigationLogin />
    <div class="wrapper wrapperShow">
      <section class="recipeE">
        <div class="ingredients">
          <div class="recnamirnice">
            <h3>Priprema</h3>
            <div class="redlevo">
              <p v-if="this.recipe">
                <b>Vreme pripreme:</b>
                {{ this.recipe[0].rec_vreme_pripreme }} minuta
              </p>
            </div>
            <div class="redlevo">
              <p v-if="this.recipe">
                <b>Posno?:</b>
                {{ this.recipe[0].rec_posno == 0 ? 'Ne' : 'Da'}}
              </p>
            </div>
            <div class="redlevo">
              <p>
                <b>SASTOJCI</b>
              </p>
            </div>
            <div class="redlevo">
              <ul class="list-unstyled" v-for="(grocerie, index) in recipe" :key="index">
                <li>
                  <img
                    width="60px"
                    class="mr-2"
                    v-bind:src="$store.state.putanjaDoSlike+grocerie.nam_link"
                  />
                  {{grocerie.nam_naziv}}:
                  <b>{{ grocerie.kolicina }}</b>
                </li>
              </ul>
            </div>
          </div>
          <!-- -----------------krajnamirice------------------------ -->
          <div class="desno">
            <div v-if="this.recipe" class="middleImage">
              <h3>{{ this.recipe[0].rec_naziv }}</h3>
              <img height="460px" v-bind:src="$store.state.putanjaDoSlike+this.recipe[0].img_link" />
            </div>
            <!-- -------------------------------------------- -->
            <div class="instrukcije">
              <p>
                <b>INSTRUKCIJA</b>
              </p>
              <p v-if="this.recipe">{{ this.recipe[0].rec_opis_recepta }}</p>

              <span v-if="this.$store.state.PodaciKorisnika" class="icons">
                <i
                  @click="insertFavorite(recipe_id)"
                  class="fa fa-heart"
                  v-bind:class="{redHearts : daLiJeLajkovanBoja}"
                  :id="recipe_id"
                ></i>
              </span>
              <p class="favoritiInfoSuccess">{{ this.unetoUFavoriteSuccess }}</p>

              <p class="favoritiInfoDanger">{{ this.unetoUFavoriteDanger }}</p>
            </div>
          </div>
          <!-- -----------------kraj desno---------------------- -->
        </div>
      </section>
      <!-- <PopularPosts /> -->
      <section class="Comments">
        <h3>Komentari</h3>
        <div class="CommentInput" v-show="$store.state.isLoggedIn === true">
          <div class="form-group">
            <textarea
              placeholder="Unesite komentar"
              v-model="commentText"
              class="form-control commentTextarea"
              rows="8"
            ></textarea>
          </div>
          <button
            @click="insertComment(recipe_id)"
            class="btn btn-warning btb-comment"
          >Posalji komentar</button>
        </div>
        <!-- isipis poruke za uspesno unet komentar -->
        <h2 class="text-center text-info">{{ this.$store.state.Info }}</h2>
        <h2 class="text-center text-danger">{{ this.greskaUnos }}</h2>
        <div class="Comment" v-for="(comment, index) in comments" :key="index">
          <p>
            <b>Od:</b>
            {{comment.kor_username}}
          </p>
          <p>
            <b>Vreme komentara:</b>
            {{comment.kom_uneto_datuma}}
          </p>
          <p class="commentText">{{ comment.kom_sadrzaj}}</p>
        </div>
      </section>
    </div>
    <Footer />
  </div>
</template>
<script>
import NavigationLogin from "../components/NavigationLogin.vue";
import Footer from "../components/Footer.vue";
import api from "@/api.js";
export default {
  name: "ShowRecipe",
  components: {
    NavigationLogin,
    Footer
  },
  data() {
    return {
      commentText: "",
      comments: "",
      recipe_id: this.$route.params.recipe_id,
      recipe: "",
      username: "",
      daLiJeLajkovan: false,
      unetoUFavoriteSuccess: "",
      unetoUFavoriteDanger: "",
      greskaUnos: ""
    };
  },
  mounted() {
    // pozicioniraj prikaz
    window.scroll({
      top: 0,
      left: 0
    }),
      this.showComments(),
      this.showRecipeById();
    this.$store.state.Info = "";
  },
  //postavi boju u zavisnosti da li je recept dodat u favorite
  computed: {
    daLiJeLajkovanBoja: function() {
      if (this.daLiJeLajkovan == 0) {
        return false;
      } else {
        return true;
      }
    }
  },
  methods: {
    // unesi komentar u bazu
    insertComment(recipeId) {
      let params = {
        sid: window.localStorage.getItem("sid"),
        komentar: this.commentText,
        receptId: recipeId
      };

      api.insertKomentare(params).then(response => {
        this.$store.state.Info = response.data.Success;
        this.greskaUnos = response.data.Error;
        this.showComments();
        console.log("PORUKA ZA POSLAT KOMENTAR", response.data);
      });
    },
    // prikazi komentare
    showComments() {
      let params = {
        sid: window.localStorage.getItem("sid"),
        recept_id: this.recipe_id
      };
      let paramsForComment = { params: params };
      api.showKomentare(paramsForComment).then(response => {
        console.log("VRACENI KOMENTARI", response);
        console.log(paramsForComment);
        this.comments = response.data.showQuery;
        console.log("sa backa", this.comments);
      });
    },
    // prikazi pojedinacan recept
    showRecipeById() {
      let params = {
        sid: window.localStorage.getItem("sid"),
        idRecept: this.recipe_id
      };
      let paramsForRecipe = { params: params };
      api.receptiPojedinacno(paramsForRecipe).then(response => {
        if (response.data.countFavQuery) {
          this.daLiJeLajkovan = response.data.countFavQuery[0].count;
        }

        console.log("dsadsa");
        console.log(paramsForRecipe);
        this.username = response.data.showQuery;
        this.recipe = response.data.showQuery;
        console.log("MOJI RECEPTI", this.recipe);
      });
    },
    // unesi recept u favorite
    insertFavorite(idRecepta) {
      console.log("SRCE ID:", idRecepta);
      let el = document.getElementById(idRecepta);
      el.style.color = "red";
      let params = {
        sid: window.localStorage.getItem("sid"),
        receptId: idRecepta
      };
      api.unosFavorita(params).then(response => {
        console.log("LAJK ODOBRI", response);
        this.unetoUFavoriteSuccess = response.data.insertFavQuery;
        this.unetoUFavoriteDanger = response.data.Error;
        console.log(this.unetoUFavorite);
      });
    }
  },
  //preuzmi parametar za rececpt
  beforeRouteUpdate(to, from, next) {
    this.recipe_id = to.params.recipe_id;
    this.showRecipeById();
    next();
  }
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

img {
  border-radius: 8px;
}

.wrapperShow {
  width: 85%;
  padding-top: 8%;
  padding-left: 15%;
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
}

.recipeE {
  width: 100%;
  border: 1px solid #eee;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
}

.ingredients {
  padding-top: 5vh;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: flex-start;
}

.recnamirnice {
  width: 35%;
  min-width: 150px;
}

.redlevo {
  padding-top: 1vh;
  padding-bottom: 1vh;
}

.middleImage {
  height: auto;
  display: flex;
  flex-direction: column;
  text-align: justify;
}

.desno {
  width: 55%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.instrukcije {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-top: 10vh;
  text-align: justify;
}

h3 {
  padding-bottom: 4vh;
}

.recipeE h3,
p,
li {
  text-align: justify;
  padding-bottom: 1vh;
}

/* .middleImage {
  align-items: center;
} */

.middleImage h3 {
  text-align: center;
}

.icons {
  padding: 6vh;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  /* margin-right: 2vw; */
  font-size: 25px;
}

.Comments {
  width: 100%;
  margin-top: 4vh;
  margin-bottom: 4vh;
  padding: 6vh;
  border: 1px solid #eee;
  border-radius: 8px;
}
.commentText {
  border-bottom: 1px solid #ccc;
  padding-bottom: 2.5vh;
}

.CommentInput {
  height: 320px;
  width: 85%;
  margin: 0 auto;
  text-align: center;
}

.CommentInput .form-control:focus {
  border-color: #ffde80;
  box-shadow: 0 0 0 0.2rem rgba(255, 150, 0, 0.25);
}

.commentTextarea {
  margin: 0 auto;
  padding: 4vh;
  width: 90%;
}
.Comments h3 {
  width: 100%;
  margin-bottom: 50px;
  text-align: center;
  /* float: left; */
}

.Comment {
  margin-top: 45px;
}

.btb-comment {
  margin-top: 20px;
}

.favoritiInfoSuccess {
  color: green;
  font-size: 24px;
  margin-left: 400px;
}

.favoritiInfoDanger {
  color: red;
  font-size: 24px;
  margin-left: 400px;
}

.redHearts {
  color: red;
}

@media only screen and (min-width: 992px) and (max-width: 1199px) {
  .CommentInput {
    width: 100%;
  }
  .wrapperShow,
  .recipeE {
    width: 880px;
  }
}

/* Medium devices (landscape tablets, 768px and up) */
@media only screen and (min-width: 768px) and (max-width: 991px) {
  .CommentInput {
    width: 100%;
  }
  .wrapperShow,
  .recipeE {
    width: 750px;
  }
}
@media only screen and (max-width: 600px) {
  .wrapper {
    padding: 10vh;
    width: 100%;
    min-width: 150px;
  }

  .ingredients {
    padding-top: 20px;
    width: 100%;
  }

  .CommentInput {
    width: 100%;
  }

  .recipeE {
    width: 100%;
  }

  .middleImage {
    position: static;
    display: inline-block;
    margin-bottom: 10px;
  }

  .middleImage img {
    width: 100%;
    height: auto;
  }
}

@media only screen and (min-width: 600px) and (max-width: 767px) {
  .wrapper {
    width: 100%;
  }
  .ingredients {
    padding-top: 20px;
    width: 100%;
  }

  .recipeE {
    width: 100%;
  }

  .middleImage {
    position: static;
    display: inline-block;
    margin-bottom: 10px;
  }

  .middleImage img {
    width: 100%;
    height: auto;
  }
}
</style>