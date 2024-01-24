//https://www.theaudiodb.com/index.php
Vue.component('disco', {
  props: {
    album: {
      type: String,
      default: ' '
    },
    artista: {
      type: String,
      default: ' '
    },
    color: {
      type: Object,
      default: function () {
        return { hex: '#FFF' }
      }
    },
    liked: {
      type: Boolean,
      default: true
    },
    index: {
      type: Number,
      default: -1
    },
    src: {
      type: String,
      default: ''
    },
    width: {
      type: String,
      default: '250px'
    },
  },
  data() {
    return {
      firstExec: true
    }
  },
  methods: {
    like() {
      //this.like = !this.like
      this.firstExec = false
      this.$emit('toque-corazon', this.index)
      //alert('You clicked next!')
    },
  },

  template: `
	<v-col col=" 3">
    <v-card :color="color.hex" dark :width="width" :max-width="width" :elevation="liked ? '5' : '1'">
    <v-card-title class="text-h5" v-text="album"></v-card-title>
      <div class="d-flex flex-no-wrap justify-space-between">
        <div>

          <v-card-subtitle v-text="artista"></v-card-subtitle>

          <v-card-actions>
          <v-btn class="ml-2 mt-3" fab icon height="40px" right width="40px">
              <v-icon class="mr-1" @click="like" :color="liked ? '#D50000' : '#BDBDBD'">
                  {{ liked ? 'mdi-heart' : 'mdi-heart-broken' }}
                </v-icon>
            </v-btn>
          </v-card-actions>
        </div>

       <v-avatar class="ma-3" size="125" >
          <v-img :class="!firstExec? liked ? 'disc' : 'disc1':''" :src="src"></v-img>
        </v-avatar>
      </div>
    </v-card>
  </v-col>
	  `
})