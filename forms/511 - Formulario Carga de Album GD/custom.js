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
      
      fecha: obtenerFecha(),
      usuarios: getUsuarios(),
      albumName: '',
      artista: '',
      aprobacion: ['Aprobado', 'En Revisión'],
      task: '', 
      
      model: {
      },
      required: [
        v => !!v || "Campo requerido"
      ],
    }
  },

  computed: {
	  validateActivity() {
			if (this.task == 0 || this.task == 4 || this.task == 13)  {
				return true
			}
			return false
	  },
	  
		validateApproverActivity(){
			if (this.task == 5)  {
				return true
			}
			return false
			},
      
  },
  methods: {
	
    init() {
      this.loadModel();
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
    }
  }
})

var beforeSendValidate = function (numState, nextState) {
  vm.save()
}


//Crear y formatear fecha actual 

function obtenerFecha() {
	  var fecha = new Date();
	  console.log(fecha)
	  var formato = 'dd/mm/yy';
	  
      const map = {
          dd: fecha.getDate(),
          mm: fecha.getMonth() + 1,
          yy: fecha.getFullYear().toString().slice(-2),
          yyyy: fecha.getFullYear() 
      }

      return formato.replace(/mm|dd|yy|yyy/gi, matched => map[matched])
  }

function getUsuarios(usuario){
	  var constraints = []
	  var colleagueResult = []
	  if (usuario)
	    constraints.push(DatasetFactory.createConstraint('colleagueName', usuario, usuario, ConstraintType.MUST));
	  var usuarios = DatasetFactory.getDataset('colleague', null, constraints, null);
	  for (var j = 0; j < usuarios.values.length; j++) {
		  colleagueResult.push({ text: usuarios.values[j]['colleagueName'], value: usuarios.values[j]['colleaguePK.colleagueId']})
	    }
	  return colleagueResult	
}



