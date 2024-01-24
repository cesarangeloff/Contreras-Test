var totFormOpts = {
  jsonModelFields: 30,
  WKUser: null,
  WKNumProces: null,
  WKNumState: null,
  WKDef: null
};

Vue.config.devtools = true;
Vue.directive('mask', VueMask.VueMaskDirective);
Vue.use('vue-moment');

const vm = new Vue({
  el: '#app',
  vuetify: new Vuetify(),
  data() {
    return {
      viewMode: null,
      WKNumProces: null,
      WKNumState: null,
      model: {
        estado: '',
        titulo: '',
        fCreacion: ''
      },
      colleagues: this.getColleagues(),
      required: [
        v => !!v || "Campo requerido"
      ],
    }
  },
  computed: {
  },
  methods: {
    init() {
      this.loadModel();
      if (this.WKNumState == 0)
        this.model.fCreacion = this.today()
      if (this.WKNumState == 5) {
        this.model.estado = ''
        this.viewMode = true
      }
    },
    loadModel() {
      let data = '';
      for (let i = 1; i <= totFormOpts.jsonModelFields; i++) {
        data += document.getElementById('jsonModel_' + i).getAttribute('value') || '';
      }
      try {
        console.log(data)
        data = JSON.parse(data)
        this.model = {
          ...this.model,
          ...data
        }
        console.log(this.model)
        data = null;
      } catch (e) {
      }
    },
    save() {
      if (!this.validate()) {
        return
      }
      console.log('Saving form data ...');
      console.log(JSON.stringify(this.model));
      const arr = this.chunkSubstr(JSON.stringify(this.model), 65000);
      if (arr.length > totFormOpts.jsonModelFields) {
        throw "Muchos datos"
      }
      for (let i = 0; i < totFormOpts.jsonModelFields; i++) {
        this.$refs['jsonModel_' + (i + 1)].value = i < arr.length ? arr[i] : ''
      }

      this.$refs['identifier'].value = this.model.colMatricula + ' - ' + this.model.album + ' - ' + this.model.artista
      console.log('Form data saved.')
    },
    validate() {
      // TODO: implementar las validaciones aca
      document.getElementById('__error').value = 'SUCCESS'
      return true;
    },
    chunkSubstr(str, size) {
      const numChunks = Math.ceil(str.length / size);
      const chunks = new Array(numChunks);
      for (let i = 0, o = 0; i < numChunks; ++i, o += size) {
        chunks[i] = str.substr(o, size)
      }
      return chunks
    },
    today() {
      return (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)
    },
    getColleagues() {
      var colleagues = []
      var constraints = []
      var result = DatasetFactory.getDataset('colleague', ['colleaguePK.colleagueId', 'colleagueName'], constraints, null);
      for (var j = 0; j < result.values.length; j++) {
        colleagues.push({ text: result.values[j]['colleagueName'], value: result.values[j]['colleaguePK.colleagueId'] })
      }

      return colleagues
    },
    getAlbums(usuario) {
      console.log(usuario)
      var albums = []
      var constraints = []
      if (usuario)
        constraints.push(DatasetFactory.createConstraint("colleague", usuario, usuario, ConstraintType.MUST))
     constraints.push(DatasetFactory.createConstraint("estado", 'A', 'A', ConstraintType.MUST))
      var result = DatasetFactory.getDataset('dsAltaAlbumsLNV', null, constraints, null);
      for (var j = 0; j < result.values.length; j++) {
        data = ''
        for (i = 1; i <= totFormOpts.jsonModelFields; i++) {
          data += result.values[j]['jsonModel_' + i];
        }
        albums.push(JSON.parse(data))
        albums[albums.length - 1]['liked'] = false
      }

      this.model.albums = albums
    },
    guardoCorazon(index) {

      console.log('elCora', index)
      //let disco = this.model.albums[index]
      //disco.liked = !disco.liked
      this.model.albums[index].liked = !this.model.albums[index].liked
      vm.$forceUpdate();
      //vm.model.albums.splice(index, 1, disco)
      //vm.set(vm.model.albums, index, disco)
    },
  }
})



var beforeSendValidate = function (numState, nextState) {
  vm.save()
}



