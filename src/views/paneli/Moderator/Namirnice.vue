<template>
  <div id="employee-table" class="innerPannel">
    <!-- ispis sta je odradjeno -->
    <p class="text-center text-info info">{{this.ispis}}</p>

    <div class="pretragaNamirnica">
      <button class="btn btn-secondary unesiNamirnicu" @click="toggle()">Unesi namirnicu</button>
      <div class="form-group pretraziNamirnicu">
        <input
          @keyup="pokreniPretragu()"
          v-model="namirnicaZaPretragu"
          type="text"
          class="form-control"
          placeholder="pretrazi namirnice"
        />
      </div>
      <div class="form-group pretragaPublish">
        <select
          @change="namirnicePublish($event)"
          class="custom-select mr-sm-2"
          id="inlineFormCustomSelect"
        >
          <option value="0" selected>Sve namirnice</option>
          <option value="1">Obobrene namirnice</option>
          <option value="2">Neodobrene namirnice</option>
        </select>
      </div>
    </div>

    <!--insert-->
    <template v-if="opcije === true">
      <div class="innerBox">
        <div class="form-group unosNamirnice">
          <input
            v-model="naziv_namirnice"
            type="text"
            class="form-control"
            placeholder="Naziv namirnice"
          />
        </div>

        <div class="container">
          <div>
            <label>
              Slika namirnice
              <input
                type="file"
                id="file"
                ref="file"
                v-on:change="handleFileUpload()"
              />
            </label>
            <button class="btn btn-success" v-on:click="unesiNamirnicu()">Unesi</button>
          </div>
        </div>
      </div>
    </template>

    <!-- editovanje namirnica -->
    <template>
      <div class="innerBox">
        {{this.$store.state.Info}}
        <div
          id="namirnicaWrapper"
          v-for="(namirniceLista, index) in namirnice"
          :key="namirniceLista.nam_id"
        >
          <div class="namirniceIspis">
            <div class="slikaNamirnice">
              <img
                class="namirniceSlika"
                height="100px"
                v-bind:src="$store.state.putanjaDoSlike+namirnice[index].img_link"
              />
            </div>

            <div class="namirniceTekst">
              <p>
                <b>Ime:</b>
                {{namirniceLista.nam_naziv}}
              </p>

              <p>
                <b>Odobreno:</b>
                {{namirniceLista.nam_is_default == 1 ? 'da' : 'ne' }}
              </p>

              <p>
                <b>ID:</b>
                {{namirniceLista.nam_id}}
              </p>
            </div>

            <div class="dugmiciNamirnice">
              <div class="btn-group">
                <button
                  class="btn btn-primary namirniceDugme"
                  @click="editMode(namirniceLista.nam_id)"
                >Edit</button>
              </div>

              <div class="btn-group">
                <label>
                  Odobri
                  <input
                    @change="promeniOdobreno($event)"
                    :checked="namirniceLista.nam_is_default"
                    type="checkbox"
                  />
                </label>
              </div>
              <div>
                <button
                  class="btn btn-danger namirniceDugme"
                  @click="brisanjeNamirnice(namirniceLista.nam_id)"
                >Delete</button>
              </div>
            </div>
          </div>

          <div class="namirnicaEditGroupa">
            <div class="namirnicaEditIme" v-if="editing === namirniceLista.nam_id">
              <div class="form-group">
                <label for>Naziv</label>
                <input
                  type="text"
                  v-model="namirniceLista.nam_naziv"
                  class="form-control"
                  placeholder="Unesite ime"
                />
              </div>
            </div>

            <div class="receptSlikaEdit" v-if="editing === namirniceLista.nam_id">
              <div>
                <label>
                  <input type="file" id="file1" ref="file1" v-on:change="handleFileUpload1()" />
                </label>
              </div>
            </div>

            <div class="verticalCenter" v-if="editing === namirniceLista.nam_id">
              <button
                class="btn btn-success potvrdi"
                @click="editNamirnice(namirniceLista.nam_id,namirniceLista.nam_naziv,namirniceLista.nam_is_default)"
              >Save</button>
            </div>

            <div class="verticalCenter" v-if="editing === namirniceLista.nam_id">
              <button class="btn btn-warning potvrdi" @click="editing = null">Cancel</button>
            </div>
          </div>
        </div>
      </div>

      <!-- paginacija -->
      <Pagination
        @prikazi="prikaziNamirnicu"
        v-bind:items="namirnice"
        v-bind:number_of_items="broj_namirnica"
        v-bind:number_per_page="broj_po_stranici"
        :key="componentKey"
      />
    </template>
  </div>
</template>


<script>
import api from "@/api.js";
import Pagination from "../../../components/Pagination.vue";

export default {
  components: {
    Pagination
  },
  data() {
    return {
      // putanja: this.$store.state.putanjaDoSlike,
      idNamirnice: "",
      naziv_namirnice: "",
      file: null,
      editing: null,
      namirnice: [],
      sid: window.localStorage.getItem("sid"),
      ispis: "",
      opcije: false,
      page: 0,
      namirnicaOdobri: null,
      namirnicaZaPretragu: "",
      broj_namirnica: 0,
      broj_po_stranici: 8,
      namirnicePublishPretraga: "",
      componentKey: 0
    };
  },

  mounted() {
    this.prikaziNamirnicu();
    this.$store.state.Info = "";
    this.ispis = "";
  },
  methods: {
    unesiNamirnicu() {
      let ab = new FormData();
      ab.append("file", this.file);
      ab.append("naziv_namirnice", this.naziv_namirnice);
      ab.append("sid", this.sid);
      console.log("FAJL JEEEEEEEEEEEEEE", this.file);

      let config = {
        header: {
          "Content-Type": "multipart/form-data"
        }
      };
      console.log(ab);
      api
        .namirniceAdd(ab, config)
        .then(response => {
          this.ispis = "Namirnica je uspesno dodata";
          this.$store.state.ServerMessage = response.data.Error;
          this.ispis = this.$store.state.ServerMessage;

          console.log("response", response);
          console.log("SUCCESS!!");
          this.prikaziNamirnicu();
        })
        .catch(function() {
          console.log("FAILURE!!");
        });
    },
    handleFileUpload() {
      this.file = this.$refs.file.files[0];
    },
    handleFileUpload1() {
      this.file = this.$refs.file1[0].files[0];
      console.log("FAJJJJJJJJJJJJJJ", this.file);
    },
    editMode(id) {
      this.editing = id;
    },
    toggle() {
      this.opcije = !this.opcije;
    },
    // dolazi iz paginacije automatski
    prikaziNamirnicu(pageNumber = 0) {
      console.log("STA JE OVDE", pageNumber);
      let params = {
        sid: this.sid,
        page: pageNumber,
        search: this.namirnicaZaPretragu,
        isPublish: this.namirnicePublishPretraga
      };
      console.log(this.sid);

      let ListaNamirnica = { params: params };
      api.namirnice(ListaNamirnica).then(response => {
        console.log("VRACENE NAMIRNICE", response);
        this.namirnice = response.data.showQuery;
        this.broj_namirnica = response.data.countQuery[0].total_rec;
        console.log("SLIKA JE", this.namirnice);
      });
    },

    editNamirnice(nam_id, nam_naziv, isDefault) {
      if (nam_naziv === "") {
        this.ispis = "Popunite sva polja !";
      } else {
        let ac = new FormData();
        ac.append("file", this.file);
        ac.append("nam_naziv", nam_naziv);
        ac.append("sid", this.sid);
        ac.append("nam_id", nam_id);
        ac.append(
          "nam_is_default",
          this.namirnicaOdobri === null ? isDefault : this.namirnicaOdobri
        );

        let config = {
          header: {
            "Content-Type": "multipart/form-data"
          }
        };
        api.namirniceEdit(ac, config).then(response => {
          console.log("edit namirnice 3", response);

          this.$store.state.ServerMessage = response.data.message;
          if (
            this.$store.state.ServerMessage == null ||
            this.$store.state.ServerMessage == ""
          ) {
            this.ispis = "Namirnica je uspesno editovana";
            console.log("Uspesno ste editovali namirnicu");
            console.log("edit namirnice kraj", response);
          }
          this.prikaziNamirnicu();
        });
      }
    },
    brisanjeNamirnice(idNamirnice) {
      if (idNamirnice == "" || idNamirnice == null) {
        this.ispis = "Popunite sva polja !!!";
      } else {
        console.log("radi delete namirnice");
        let params = {
          sid: this.sid,
          nam_id: idNamirnice
        };
        let deleteParams = { params: params };
        api
          .namirniceDelete(deleteParams)
          .then(response => {
            console.log("delete namirnice 3", response);
            console.log(deleteParams);
            this.$store.state.ServerMessage =
              response.data.brisanjeNamirniceMessage;
            this.prikaziNamirnicu();
            if (
              this.$store.state.ServerMessage == null ||
              this.$store.state.ServerMessage == "" ||
              this.$store.state.ServerMessage == undefined
            ) {
              this.ispis = "Namirnica je uspesno obrisana";
            } else {
              this.ispis = this.$store.state.ServerMessage;
            }
          })
          .catch(error => {
            console.log("CATCH");
            console.log("action BrisanjeNamirnice ERROR", error);
          });
      }
    },
    pokreniPretragu() {
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
      }
      this.timeoutId = setTimeout(() => {
        this.prikaziNamirnicu();
      }, 500);
    },
    namirnicePublish(publish) {
      this.ispis = "";
      this.namirnicePublishPretraga = publish.target.value;
      this.forceRerender();
      this.prikaziNamirnicu();
      console.log("Publish", this.namirnicePublishPretraga);
    },
    promeniOdobreno(odobri) {
      this.namirnicaOdobri = +odobri.target.checked;
      console.log("DA LI MENJA", this.namirnicaOdobri);
    },
    // resetuj komponentu
    forceRerender() {
      this.componentKey += 1;
    }
  }
};
</script>

<style scoped>
button {
  margin: 0 0.5rem 0 0;
}

input {
  margin: 0;
}
.innerBox {
  width: 350px;
  margin: 0 auto;
  margin-bottom: 30px;
}
.roles {
  width: 350px;
  margin: 0 auto;
}

#namirnicaWrapper {
  border-collapse: collapse;
  border: 2px solid #ccc;
  border-radius: 10px;
  margin-bottom: 5px;
  background-color: #fff;
  position: relative;
}

#namirnicaWrapper td {
  padding: 20px;
  height: 100px;
}

.innerBox {
  width: 1000px;
}

.namirniceSlika {
  padding: 4px;
}

.potvrdi {
  margin-top: 30px;
}

.objavljeno {
  width: 40px;
}

.pretragaNamirnica {
  width: 632px;
  overflow: hidden;
  margin: 0 auto;
}

.namirniceIspis p,
.namirniceIspis div {
  display: inline-block;
  margin-right: 20px;
}
.dugmiciNamirnice {
  width: 320px;
  float: right;
  margin-top: 32px;
}

.namirniceIspis {
  width: 960px;
  height: 100px;
}

.namirniceTekst p {
  margin-bottom: 0;
}

.namirniceTekst {
  margin-top: 42px;
}

.namirnicaEditIme {
  width: 200px;
  display: inline-block;
}

.receptSlikaEdit {
  margin-top: 30px;
  margin-left: 30px;
  display: inline-block;
}

.verticalCenter {
  display: inline;
  vertical-align: top;
}

.slikaNamirnice {
  height: 100px;
}

.namirnicaEditGroupa {
  margin-left: 40px;
  margin-top: 20px;
}
.innerPannel {
  padding-top: 35px;
  padding-bottom: 40px;
}

.pretraziNamirnicu,
.unesiNamirnicu {
  width: 200px;
  display: block;
  float: left;
}

.pretraziNamirnicu input {
  margin-bottom: 10px;
}

.unosNamirnice {
  width: 300px;
}

.info {
  font-size: 20px;
}

.paginateWrapper {
  margin-top: 0px;
}

.pretragaPublish {
  float: left;
  margin-left: 8px;
}
</style>
