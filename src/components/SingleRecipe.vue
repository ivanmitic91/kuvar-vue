<template>
  <!-- prikazi jedan 'box' na 'home' stranici, umnozi preko petlje -->
  <div class="col">
    <div class="colRecipe colRecipeFav" v-for="(recipe) in recipes" :key="recipe.rec_id">
      <div class="recImage">
        <img class="singleRecipeImage" v-bind:src="$store.state.putanjaDoSlike+recipe.img_link" />
      </div>

      <div class="recText">
        <router-link :to="{name: 'ShowRecipe' , params: {recipe_id: recipe.rec_id }}">
          <h4>{{ recipe.rec_naziv }}</h4>
        </router-link>
      </div>
      <div class="recInfo">
        <p>{{ recipe.rec_uneto_datuma | moment("Do MMMM YYYY") }}</p>
      </div>
    </div>
  </div>
</template>


<script>
export default {
  props: ["recipes"], //dolazi iz roditeljske komponente , svi recepti
  data() {
    return {
      sid: window.localStorage.getItem("sid"),

      recipe: ""
    };
  },
  methods: {
    // postavi crvenu boju na srce prilikom unosa u 'favorite'
    insertFavorite(id) {
      let el = document.getElementById(id);
      el.style.color = "red";
    }
  }
};
</script>

<style>
.homePage .recImage {
  width: 100%;
  height: auto;
}

.homePage .recText {
  height: 25%;
  padding-top: 15px;
  background-color: #fff;
  text-align: center;
}

.singleRecipeImage {
  width: 100%;
  height: 200px;
}

.homePage .recInfo {
  height: 20%;
  border-top: 1px solid #ccc;
  padding-top: 20px;
  color: #aaa;
  text-align: left;
  padding-left: 20px;
  background-color: #fff;
}

.icons {
  float: right;
  margin-right: 50px;
  font-size: 18px;
}
.fa-heart {
  padding-right: 15px;
}

.recText a {
  text-decoration: none;
  color: orange;
}

.recText a:hover {
  color: chocolate;
}
.col {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
}
.redHeart {
  color: red;
}

.colRecipe {
  width: 290px;
  height: 380px;
  margin-right: 10px;
}

@media only screen and (min-width: 1200px) and (max-width: 1600px) {
  .colRecipe {
    width: 250px;
  }

  .colRecipe:nth-child(3n) {
    margin-right: 0px;
  }
  .singleRecipeImage {
    width: 250px;
  }
}
@media only screen and (min-width: 768px) and (max-width: 991px) {
  .singleRecipeImage {
    height: 265px;
  }
}

@media only screen and (max-width: 600px) {
  .singleRecipeImage {
    height: 290px;
  }

  .colRecipe {
    height: 100%;
  }
}
</style>