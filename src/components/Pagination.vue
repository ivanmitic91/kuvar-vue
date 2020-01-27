<template>
  <div class="paginateWrapper">
    <!-- prikazi samo ako baza vraca podatke -->
    <!-- ako sledeca stranica ne daje podatke , ne dozvoljavaj da se klikne -->
    <button
      v-show="number_of_items > 0"
      :disabled="this.page === 0"
      @click="paginateMinus()"
      class="btn btn-warning previousButton"
    >Prethodno</button>
    <!-- uradi iteraciju onoliko puta koliko ima broj vracenih entiteta -->
    <div v-for="(number, index) in this.numberOfPages" :key="index" class="paginateLinks">
      <!-- prikazi graficki na kojoj je korisnik strani -->
      <span v-bind:class="{ color: index == page }" @click="setPaginateNumber(index)">{{ number }}</span>
    </div>
    <button
      v-show="number_of_items > 0"
      :disabled="this.page + 1 == this.numberOfPages"
      @click="paginatePlus()"
      class="btn btn-warning nextButton"
    >Sledece</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      page: 0
    };
  },
  name: "Pagination",
  props: {
    items: Array, //dolazi od roditeljske komponente , entiteti
    number_of_items: Number, //dolazi od roditeljske komponente , koliko ima entiteta
    number_per_page: Number // dolazi od roditeljske komponente, koliko ce biti entiteta po strani
  },
  computed: {
    // izracunaj koliko ce biti strana za paginaciju
    numberOfPages: function() {
      return Math.ceil(this.number_of_items / this.number_per_page);
    }
  },
  // resetuj komponentu pri promeni preko selecta
  mounted() {
    this.$forceUpdate();
  },
  methods: {
    // povecaj brojac
    paginatePlus() {
      this.$emit("prikazi", (this.page += 1));
    },
    // smanji brojac
    paginateMinus() {
      this.$emit("prikazi", (this.page -= 1));
    },
    //posalji vrednost brojaca
    setPaginateNumber(pageNumber) {
      this.page = pageNumber;
      this.$emit("prikazi", pageNumber);
    }
  }
};
</script>

<style>
.previousButton {
  margin-right: 29px;
}

.nextButton.btn {
  width: 94px;
}

.paginateLinks {
  display: inline-block;
  margin-right: 10px;
  transform: translateX(-50%);
  background-color: orange;
}

.paginateLinks:last-of-type {
  margin-right: 0px;
}

.paginateInner {
  transform: translateX(-25%);
}

.paginateLinks span {
  text-align: center;
  font-size: 25px;
  width: 100%;
  padding: 8px;
  cursor: pointer;
}
.paginateWrapper {
  text-align: center;
  margin-top: 60px;
}
.carousel-control-next-icon,
.carousel-control-prev-icon {
  width: 60px;
  height: 50px;
}
</style>
