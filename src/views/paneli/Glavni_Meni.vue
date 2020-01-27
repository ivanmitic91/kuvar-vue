<template >
  <div v-if="this.$store.state.PodaciKorisnika">
    <div v-if="this.$store.state.PodaciKorisnika.role_id < 4">
      <img class="slika1" src="../../assets/MeniIcon.png" @click="ToggleShowMenu" />

      <transition name="modal">
        <div v-if="showMenu" class="modal-mask" @click="closeMenu()">
          <div class="modal-wrapper">
            <div class="modal-container">
              <nav>
                <img class="cross" src="../../assets/x.png" @click="ToggleShowMenu" />
                <ul>
                  <p
                    style="text-align:center; font-size:25px; font-weight:600; padding-top:15px;"
                  >Korisnik</p>
                  <li class="li" v-for="(item,i) in user" :key="i" router :to="{name: item.name}">
                    <router-link :to="{name: item.name}">{{item.text}}</router-link>
                  </li>
                </ul>
                <div v-if="this.$store.state.PodaciKorisnika">
                  <div v-if="this.$store.state.PodaciKorisnika.role_id <3">
                    <ul>
                      <p
                        style="text-align:center; font-size:25px; font-weight:600; padding-top:15px;"
                      >Moderator</p>
                      <li
                        class="li"
                        v-for="(item,i) in moderator"
                        :key="i"
                        router
                        :to="{name: item.name}"
                      >
                        <router-link :to="{name: item.name}">{{item.text}}</router-link>
                      </li>
                    </ul>
                  </div>
                </div>
                <div v-if="this.$store.state.PodaciKorisnika.role_id <2">
                  <ul>
                    <p
                      style="text-align:center; font-size:25px; font-weight:600; padding-top:15px;"
                    >Administrator</p>
                    <li
                      class="li"
                      v-for="(item,i) in admin"
                      :key="i"
                      router
                      :to="{name: item.name}"
                    >
                      <router-link :to="{name: item.name}">{{item.text}}</router-link>
                    </li>
                  </ul>
                </div>
                <ul>
                  <li class="li">
                    <router-link :to="{name: 'home'}">Pocetna</router-link>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showMenu: false,
      user: [
        { text: "Nalog", name: "promenaSifre" },
        { text: "Favoriti", name: "favoriti" },
        { text: "Novi recept", name: "mojiRecepti" }
      ],
      moderator: [
        { text: "Namirnice", name: "namirnice" },
        { text: "Recepti", name: "recepti" },
        { text: "Komentari", name: "ListajKomentare" }
      ],
      admin: [
        { text: "Svi korisnici", name: "korisnici" },
        { text: "Edit 'About'", name: "aboutPromena" }
      ]
    };
  },
  methods: {
    ToggleShowMenu() {
      this.showMenu = !this.showMenu;
      console.log(this.showMenu);
    },
    closeMenu() {
      this.showMenu = false;
      console.log("dsadsa");
    }
  }
};
</script>

<style scoped>
/*Edit in JSFiddle Result html JavaScript CSS*/

ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
  color: orange;
  font-size: 22px;
  text-align: center;
}

.li {
  display: block;
  text-decoration: none;
  color: orange;
  text-align: center;
}

.li :active {
  color: white;
}

.li :hover:not(.active) {
  color: black;
  text-decoration: none;
}
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 50px;
  left: 20px;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  transition: opacity 0.3s ease;
}

.slika1 {
  text-align: left;
  position: fixed;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: left;
}

.modal-container {
  width: 300px;
  margin: 0px auto;
  padding: 20px 0px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  font-family: Helvetica, Arial, sans-serif;
  height: 100%;
  position: relative;
}

.modal-header h3 {
  margin-top: 0;
  color: #42b983;
}

.modal-body {
  margin: 20px 0;
}

.modal-default-button {
  float: right;
}
.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}

.cross {
  position: absolute;
  top: 0;
}
</style>
