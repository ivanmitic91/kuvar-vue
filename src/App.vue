<template>
  <div>
    <Glavni_Meni v-if="this.$store.state.isLoggedIn===true" />
    <router-view></router-view>
  </div>
</template>
<script>
import $api from "@/api.js";
import Glavni_Meni from "./views/paneli/Glavni_Meni.vue";
export default {
  name: "App",
  components: {
    Glavni_Meni
  },
  data: () => ({}),
  mounted() {
    this.proveraSesije();
  },
  methods: {
    // produzi sesiju
    proveraSesije() {
      setInterval(
        () =>
          $api
            .proveraSesije({
              sid: window.localStorage.getItem("sid")
            })
            .then(response => {
              console.log(response.data.error);
            }),
        600000
      );
    }
  }
};
</script>

<style>
body {
  background-color: floralwhite;
  margin: 0;
  padding: 0;
  font-family: "Roboto", sans-serif;
}
#app {
  text-align: center;
}
.innerPannel {
  width: 100%;
  margin-left: 400px;
  padding-top: 100px;
  margin: 0 auto;
}
</style>
