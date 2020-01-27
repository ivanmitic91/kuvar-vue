<!-- samo na back-u a se u selektu gadja tabela komentari,
i u njoj "odobreno" sa vrednoscu 1 tj 0, za korisnika koji je pozvao komandu 
(npr. 0 kada postavi korisnik, 1 kada je recept odobren)  --->
<template>
  <div id="allComments">
    <div class="form-group komentariObjavljeno">
      <select @change="komentariPublish($event)" class="form-control">
        <option value="0">Svi komentari</option>
        <option value="1">Objavljeni komentari</option>
        <option value="2">Neobjavljeni komentari</option>
      </select>
    </div>
    <div class="showAllComments" v-for="comment in comments" :key="comment.com_id">
      <div class="comment">
        <p>
          <b>Recept:</b>
          {{ comment.rec_naziv}}
        </p>

        <p>
          <b>Od:</b>
          {{ comment.kor_username }}
        </p>
        <p>
          <b>Datum unosa:</b>
          {{ comment.kom_uneto_datuma}}
        </p>
        <p>
          <b>Sadrzaj:</b>
          {{ comment.kom_sadrzaj}}
        </p>
        <p>
          <b>Odobreno:</b>
          {{ comment.kom_odobreno == 1 ? 'Da' : 'Ne' }}
        </p>
        <p>
          <button
            v-if="comment.kom_odobreno == 0"
            @click="approveComment(comment.kom_id)"
            class="btn btn-success mr-4"
          >Odobri</button>
          <button @click="deleteComment(comment.kom_id)" class="btn btn-danger">Obrisi</button>
        </p>
      </div>
    </div>
    <h2 class="text-info text-center">{{ this.$store.state.Info }}</h2>
    <!-- paginacija -->
    <Pagination
      @prikazi="showAllComments"
      v-bind:items="comments"
      v-bind:number_of_items="broj_komentara"
      v-bind:number_per_page="broj_po_stranici"
      :key="componentKey"
    />
  </div>
</template>

<script>
import Pagination from "../../../components/Pagination.vue";
import api from "@/api.js";

export default {
  components: { Pagination },

  data() {
    return {
      comments: [],
      componentKey: 0,
      broj_komentara: 0,
      broj_po_stranici: 8,
      sid: window.localStorage.getItem("sid")
    };
  },

  mounted() {
    this.showAllComments();
    this.$store.state.Info = "";
  },

  methods: {
    // prikazi sve komentare iz baze
    showAllComments(pageNumber = 0) {
      let params = {
        sid: window.localStorage.getItem("sid"),
        page: pageNumber,
        recept_id: 0,
        isPublishKom: this.komentariPublishPretraga
      };
      let paramsForComment = { params: params };
      api.showKomentare(paramsForComment).then(response => {
        console.log("VRACENI", response);
        this.comments = response.data.showQuery;
        this.broj_komentara = response.data.countQuery[0].total_kom;
      });
    },
    // obrisi komentar iz baze
    deleteComment(idKomentara) {
      let params = {
        sid: window.localStorage.getItem("sid"),
        idKomentara: idKomentara
      };
      let deleteParams = { params: params };
      api
        .showKomentareDelete(deleteParams)
        .then(response => {
          console.log(params);
          console.log(deleteParams);
          console.log(response);
          this.showAllComments();
          this.state.ServerMessage = response.data.message;
          if (
            this.state.ServerMessage == null ||
            this.state.ServerMessage == ""
          ) {
            this.$store.commit("INFO", "Uspesno ste obrisali komentar");
            console.log("delete komentara kraj", response);
          }
        })
        .catch(error => {
          console.log("CATCH");
          console.log("Brisanje komentar", error);
        });
    },
    // odobri komentar
    approveComment(kom_id) {
      let params = {
        sid: window.localStorage.getItem("sid"),
        idKomentara: kom_id,
        publish: 1
      };
      // ovako je za patch
      api.showKomentareOdobri(params).then(response => {
        console.log("KOMENTAR ODOBRI", response);
        this.$store.state.Info = response.data.Success;
      });
    },

    komentariPublish(publishKom) {
      this.komentariPublishPretraga = publishKom.target.value;
      this.forceRerenderKom();
      this.showAllComments();
      console.log("Publish", this.komentariPublishPretraga);
    },
    // resetuj komponentu
    forceRerenderKom() {
      this.componentKey += 1;
    }
  }
};
</script>

<style scoped>
#allComments {
  width: 1000px;
  margin: 0 auto;
  padding-top: 30px;
}

.comment {
  border: 1px solid #ccc;
  padding: 10px;
  background-color: #fff;
}

.komentariObjavljeno {
  width: 200px;
  margin: 0 auto;
  margin-bottom: 20px;
}
</style>
