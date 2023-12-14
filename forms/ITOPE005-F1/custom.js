var	totFormOpts = {
  jsonModelFields: 30,	
  WKUser: null,
  WKNumProces: null,
  WKNumState: null,
  WKDef: null,
};
var fechaFormulario = document.querySelector('[v-model="model.fecha"]')
var fechaEjecutor = document.querySelector('[v-model="model.fecha"]')
var fechaQA = document.querySelector('[v-model="model.fecha"]')
var fechaCliente = document.querySelector('[v-model="model.fecha"]')

Vue.config.devtools = true;
Vue.directive('mask', VueMask.VueMaskDirective);
Vue.use('vue-moment');

const vm = new Vue({
  el: '#app',
  vuetify: new Vuetify(),
  data(){ 
    return {
      viewMode: true,
      procesoFinalizado: false,
      WKNumState: 0,
      nombreUsuario: '',
	  tab: null,
	  model: {
		  itemsPrincipal: [{}],
		  itemsResonsables: [{'nomrow':'Firma y Aclaración', 'ejecutorRegistro': 'Cambiar nombre'}, {'nomrow':'Fecha', 'ejecutorRegistro': fechaDelDia()}],
		  urlLgCliente: 'no-img.png',
		  urlLgContreras: 'no-img.png',
		  inputCodObraHidden: '',
		  fecha: fechaFormulario.innerHTML == '' ? fechaDelDia() : fechaFormulario.innerHTML,
	  },
      clientes: getClientes(),
      formatoObraVacia: '-',
	  required: [v => !!v || "Campo requerido"], 
    }
  },
  computed: {
	    headersPrincipal() {
	      return [
	              { text: 'N° Caño', align: 'center', value: 'nrocano', type: 'input', width: '10rem', sortable: false },
	              { text: 'Colada', align: 'center', value: 'colada', type: 'input', width: '10rem', inputType: 'text', sortable: false },
	              { text: 'Longitud', align: 'center', value: 'longitud', type: 'input', width: '10rem', inputType: 'text', sortable: false },
	              { text: 'Progresiva 0+000', align: 'center', value: 'progresiva', type: 'input', width: '10rem', inputType: 'text', sortable: false },
	              { text: 'Observaciones', align: 'center', value: 'observaciones', type: 'input', width: '10rem', inputType: 'text', sortable: false},
	              { text: '', align: 'center', value: 'deleteRow', type: 'icon', width: '2rem', sortable: false},
	      ];
	    },
	    headersResponsables() {
		      return [
		              { text: '', align: 'center', value: 'nomrow', width:'8rem', sortable: false },
		              { text: 'Ejecutor de Registro', align: 'center', value: 'ejecutorRegistro', width:'12rem', type: 'input', inputType: 'text', sortable: false},
		              { text: 'QA/QC', align: 'center', value: 'qaqc', width:'12rem', type: 'input', inputType: 'text', sortable: false },
		              { text: 'Inspección Cliente', align: 'center', value: 'inpeccionCliente', width:'12rem', type: 'input', inputType: 'text', sortable: false},
		      ];
		},
		codObra(){
			return this.model.inputCodObraHidden === "" ? this.formatoObraVacia : '-'+this.model.inputCodObraHidden+'-';
		}
	  },
  methods: {	
	  init() {
		this.loadModel();
		this.verificaTareaActual(4, 2) //Revisar número de tarea en proceso (Tarea Aprobación, Tarea final)
	  },
	  loadModel(){
	      let data = '';
	      
	      for (let i = 1; i <= totFormOpts.jsonModelFields; i++) {
	        data += document.getElementById('jsonModel_'+i).getAttribute('value') || '';
	      }	
	      
	      try {
	    	data = JSON.parse(data)
	        this.model = {
	          ...this.model,
	          ...data
	        }
	        data = null;      
	      } 
	      catch (e) {
	    	  console.log('Error: ' + e)
	      }  
    },
    save(){
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
        this.$refs['jsonModel_' + (i+1)].value = i<arr.length? arr[i] : ''
      }

      console.log('Form data saved.')     
	},
  	validate(){
  	  document.getElementById('__error').value = 'SUCCESS'
  	  return true;
  	},
    getClienteData(idCliente) { //Evento que se dispara con el Campo select Obra cuando Cambia
        var cliente = getClientes(idCliente)
        if (cliente.length > 0) {
          logo = getLogos(cliente[0].logoCliente)
          this.model.inputCodObraHidden = cliente[0].centroCosto
          if (logo.length > 0) {
        	this.model.urlLgCliente = `${window.location.origin}/webdesk/streamcontrol/${logo[0].fileName}?WDCompanyId=1&WDNrDocto=${logo[0].value}&WDNrVersao=${logo[0].version}`
          }
          logo = getLogos(cliente[0].logoContreras)
          if (logo.length > 0) {
        	this.model.urlLgContreras = `${window.location.origin}/webdesk/streamcontrol/${logo[0].fileName}?WDCompanyId=1&WDNrDocto=${logo[0].value}&WDNrVersao=${logo[0].version}`
          }
        }
      },
  	chunkSubstr(str, size) {
        const numChunks = Math.ceil(str.length / size);
        const chunks = new Array(numChunks);

        for (let i = 0, o = 0; i < numChunks; ++i, o += size) {
          chunks[i] = str.substr(o, size)
        }

        return chunks
     },
     setEstado(estado) {
         this.model.estado = estado
     },
     addItemPrincipal(data) {
    	 this.model.itemsPrincipal.push({})
     },
     deleteItem(item){
    	 if(confirm('¿Desea eliminar la fila seleccionada?')){    		 
    		 this.model.itemsPrincipal.splice(this.model.itemsPrincipal.indexOf(item), 1)
    	 }
     },
     verificaTareaActual(numeroTareaActual, numeroTareaFinal){
	   	if(this.WKNumState == numeroTareaActual){
	   		this.viewMode = true
		}
	   	else if(this.WKNumState == numeroTareaFinal){
	   		this.procesoFinalizado = true;
	   	}
     },
     fechaDelDiaFormatoymd(){
   	  var fecha = new Date();
   	  var mes = fecha.getMonth()+1;
   	  var dia = fecha.getDate();
   	  var ano = fecha.getFullYear();
   	  if(dia<10)
   	    dia='0'+dia;
   	  if(mes<10)
   	    mes='0'+mes
   	  
   	   return ano+"-"+mes+"-"+dia;
     }
  }
})

function getClientes(idCliente) {
	  var constraints = []
	  var jsonClientes = ''
	  var clientesResult = []
	  if (idCliente)
	    constraints.push(DatasetFactory.createConstraint('requestId', idCliente, idCliente, ConstraintType.MUST));

	  var clientes = DatasetFactory.getDataset('dsCheckList', null, constraints, null);
	  
	  for (var j = 0; j < clientes.values.length; j++) {
	    jsonClientes = ''
	    for (let i = 1; i <= totFormOpts.jsonModelFields; i++) {
	      jsonClientes += clientes.values[j]['jsonModel_' + i]
	    }
	    data = JSON.parse(jsonClientes)
	    clientesResult.push({ text: data.nombre, value: clientes.values[j]['requestId'], formularios: data.items, logoCliente: data.logoCliente, logoContreras: data.logoContreras, centroCosto: data.centroCosto })
	  }

	  return clientesResult
}

function getLogos(idDoc) {
  var logos = []
  var constraints = []
  constraints.push(DatasetFactory.createConstraint('parentDocumentId', '34', '34', ConstraintType.MUST));
  if (idDoc)
    constraints.push(DatasetFactory.createConstraint('documentPK.documentId', idDoc, idDoc, ConstraintType.MUST));

  var docs = DatasetFactory.getDataset('document', ['documentDescription', 'documentPK.documentId', 'documentPK.version', 'phisicalFile'], constraints, null);
  for (var j = 0; j < docs.values.length; j++) {
    logos.push({ text: docs.values[j]['documentDescription'], value: docs.values[j]['documentPK.documentId'], version: docs.values[j]['documentPK.version'], fileName: docs.values[j]['phisicalFile'] })
  }

  return logos
}

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