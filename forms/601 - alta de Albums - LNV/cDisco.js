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
      like: false
    }
  },
  methods: {
    liked() {
      this.like = !this.like
      //alert('You clicked next!')
    },
  },

  template: `
  <div>
<v-card :color="color.hex" dark :width="width" :max-width="width" :elevation="like ? '5' : '1'">
<v-card-title class="text-h5" v-text="album"></v-card-title>
  <div class="d-flex flex-no-wrap justify-space-between">
    <div>

      <v-card-subtitle v-text="artista"></v-card-subtitle>

      <v-card-actions>
      <v-btn class="ml-2 mt-3" fab icon height="40px" right width="40px">
          <v-icon class="mr-1" @click="liked" :color="like ? '#D50000' : '#BDBDBD'">
              {{ like ? 'mdi-heart' : 'mdi-heart-broken' }}
            </v-icon>
        </v-btn>
      </v-card-actions>
    </div>

    <v-avatar class="ma-3" size="125">
      <v-img :src="src"></v-img>
    </v-avatar>
  </div>
</v-card>
</div>
	  `
})