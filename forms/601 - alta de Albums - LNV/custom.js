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
      valid: true,
      viewMode: null,
      WKNumProces: null,
      WKNumState: null,
      model: {
        estado: '',
        titulo: '',
        fCreacion: ''
      },
      colleagues: this.getColleagues(),
      rules: [
        value => !!value || 'Campo Requerido.'
      ],
      imageRules1: [
        value => !!value || 'Campo Requerido.',
        value => this.testImage(value) || 'Url Invalida.'
      ],
      imageRules: [
        value => !!value || 'Campo Requerido.',
        value => this.testImage(value) || 'Url Invalida.',
        /*value => {
          res = !this.testImage(value)
          console.log(res)
          if (res) {
            return "Url Invalida";
          }
          else {
            //this.model.urlImage = value
            return true;
          }
        }*/
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
        return false
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
      var validate = this.$refs.formvue.validate()
      document.getElementById('__error').value = 'SUCCESS'
      return validate;
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
    setEstado(estado) {
      this.model.estado = estado
    },
    testImage(imageUrl) {
      try {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', imageUrl, false);
        xhr.send(null);
        return xhr.status === 200
      } catch (error) {
        console.log(error)
        return false
      }
      if (xhr.status === 200) {
        return xhr.responseText;
      } else {
        throw new Error('Request failed: ' + xhr.statusText);
      }
    },
  }
})



var beforeSendValidate = function (numState, nextState) {
  return vm.save()
}





//https://http2.mlstatic.com/D_NQ_NP_774347-MLA45284075247_032021-O.webp