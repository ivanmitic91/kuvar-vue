<template>
  <div id="carouselExampleControls" class="carousel slide" data-ride="carousel">
    <div class="carousel-inner">
      <div class="carousel-item active">
        <img class="d-block w-100" src="../assets/Food.jpg" alt="First slide" />
      </div>
      <div class="carousel-item">
        <img class="d-block w-100" src="../assets/Food2.jpg" alt="Second slide" />
      </div>
      <div class="carousel-item">
        <img class="d-block w-100" src="../assets/Food3.jpg" alt="Third slide" />
      </div>
    </div>
    <a
      class="carousel-control-prev"
      href="#carouselExampleControls"
      role="button"
      data-slide="prev"
    >
      <span class="carousel-control-prev-icon" aria-hidden="true"></span>
      <span class="sr-only">Previous</span>
    </a>
    <a
      class="carousel-control-next"
      href="#carouselExampleControls"
      role="button"
      data-slide="next"
    >
      <span class="carousel-control-next-icon" aria-hidden="true"></span>
      <span class="sr-only">Next</span>
    </a>
  </div>
</template>


<script>
export default {
  data() {
    return {};
  },
  methods: {},
  name: "Carousel"
};
</script>
<style>
.carousel-inner {
  height: 100vh;
}

@media only screen and (max-width: 600px) {
  .carousel-inner {
    height: inherit;
  }
}

@media only screen and (min-width: 600px) and (max-width: 767px) {
  .carousel-inner {
    height: inherit;
  }
}

@media only screen and (min-width: 768px) and (max-width: 991px) {
  .carousel-inner {
    height: inherit;
  }
}

@media only screen and (min-width: 992px) and (max-width: 1199px) {
  .carousel-inner {
    height: inherit;
  }
}

@media only screen and (min-width: 1200px) and (max-width: 1600px) {
  .carousel-inner {
    height: inherit;
  }
}
</style>