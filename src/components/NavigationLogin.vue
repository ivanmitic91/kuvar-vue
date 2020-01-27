<template>
  <!-- poziva se za stranu za logovanje -->
  <div id="navLogin">
    <span class="logoNav ml-4">
      <img height="68px" src="../assets/logo.png" alt />
    </span>
    <span class="loginLink">
      <router-link to="/">Home</router-link>
    </span>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {},
  name: "Navigation"
};
</script>

<style>
#navLogin {
  height: 65px;
  width: 100%;
  position: fixed;
  z-index: 200;
  background-color: #fff;
}

#navLogin a {
  font-weight: bold;
  color: #2c3e50;
}

#navLogin a.router-link-exact-active {
  color: #000;
}

#navLogin a:hover {
  text-decoration: none;
  color: #ccc;
}
.mainLinks {
  padding-right: 20px;
}

.loginLink {
  float: right;
  line-height: 65px;
  margin-right: 100px;
}
</style>