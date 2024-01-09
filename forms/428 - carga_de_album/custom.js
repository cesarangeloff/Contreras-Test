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
      viewMode: true,
      WKNumState: 0,
	  actividades: {
			inicio: 4, //Número de tarea inicial
			aprobacion: 5, //Número de tarea "Aproación Formulario"
			final: 9 //Número de tarea final
	  },
      model: {
    	  fecha: '',
		  codUsuario: '',
		  usuario: '',
		  nombreAlbum: '',
		  artista: '',
		  color: '',
      },
      usuarios: this.getUsers(),
      menuColor: false,
      required: [
        v => !!v || "Campo requerido"
      ],
    }
  },

  computed: {},
  methods: {
    init() {
      this.loadModel();
      this.validacionesTareas();
      if (this.WKNumState == 0)
			this.model.fecha = fechaDelDia()
    },
    loadModel() {
      let data = '';
      for (let i = 1; i <= totFormOpts.jsonModelFields; i++) {
        data += document.getElementById('jsonModel_' + i).getAttribute('value') || '';
      }
      try {
        data = JSON.parse(data)
        this.model = {
          ...this.model,
          ...data
        }
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
    getUsers(idUser) {
  	  var constraints = []
	  var usersResult = []
  	  
  	  if(idUser){
  		constraints.push(DatasetFactory.createConstraint('colleagueName', idUser, idUser, ConstraintType.MUST))
  	  }
  	  
	  var users = DatasetFactory.getDataset('colleague', null, constraints, null);
	  for (var j = 0; j < users.values.length; j++) {
		  usersResult.push({
			  codigoUsuario: users.values[j]['colleaguePK.colleagueId'],
			  text: users.values[j].colleagueName
		  	}
		  )
	  }
	  
	  if (usersResult.length == 1){
		  this.model.codUsuario = users.values[0]['colleaguePK.colleagueId']
	  }
	  
	  return usersResult
    },
    validacionesTareas(){
    	if (this.WKNumState == this.actividades.aprobacion){
    		this.viewMode = true;
    	}
    }
  }
})

function fechaDelDia(){
	  var fecha = new Date();
	  var mes = fecha.getMonth()+1;
	  var dia = fecha.getDate();
	  var ano = fecha.getFullYear();
	  if(dia<10)
	    dia='0'+dia;
	  if(mes<10)
	    mes='0'+mes
	  
	   return dia+"/"+mes+"/"+ano;
}

var beforeSendValidate = function (numState, nextState) {
  vm.save()
}



