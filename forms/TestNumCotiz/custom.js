var totFormOpts = {
  jsonModelFields: 30,
  WKUser: null,
  WKNumProces: null,
  WKNumState: null,
  WKDef: null,
};
var fechaFormulario = document.querySelector('[v-model="model.fecha"]')

// console.log = (function (old_function, div_log) {
//   return function (text) {
//     old_function(text);
//     div_log.textContent += text + "</br>";
//   };
// })(console.log.bind(console), document.getElementById("error-log"));

Vue.config.devtools = true;
Vue.directive("mask", VueMask.VueMaskDirective);
Vue.use("vue-moment");

const vm = new Vue({
  el: "#app",
  vuetify: new Vuetify(),
  data() {
    return {
      dialogHistorial: false,
      viewMode: true,
      viewTrigger: false,
      procesoFinalizado: false,
      WKNumState: 0,
      WKDef: "",
      model: {
      itemsHistorial: [{}],//getDataset(), //[{}],
        numcotiz: getCotiz(),
        // numcotiz: '',
        fecha: fechaFormulario.innerHTML == '' ? fechaDelDia() : fechaFormulario.innerHTML,
        fechaSeg: fechaFormulario.innerHTML == '' ? fechaDelDia(7) : fechaFormulario.innerHTML,
      },
      clientes: getClientes(),
      sellers: getSellers(),
      monedas: getMonedas(),
      paidmetods: getPaidMethod(),
      // clientes: [],
      required: [(v) => !!v || "Campo requerido"],
    };
  },
  computed: {
    console: () => console,
    headersHistorial() {
      return [
              { text: 'Nro. Cotizacion', align: 'center', value: 'nroCotiz', width: '10rem', sortable: false },
              { text: 'Cliente', align: 'center', value: 'cliente', width: '10rem', inputType: 'text', sortable: false },
              { text: '', align: 'center', value: 'deleteRow', type: 'icon', width: '2rem', sortable: false},
      ];
    },

    clientesMod() {
      return this.clientes.map(cliente => ({
        ...cliente,
        claveClientes: `${cliente.cod} - ${cliente.name}`
      }));
    },

    sellersMod() {
      return this.sellers.map(seller => ({
        ...seller,
        claveSellers: `${seller.cod} - ${seller.name}`
      }));
    },
  },
  methods: {
    init() {
      this.loadModel();
      if (this.WKNumState == 2) {
        this.model.numcotiz = document.getElementById("numero_cotizacion").getAttribute("value")|| ""
        this.viewMode = true
      }
    },
    loadModel() {
      let data = "";

      for (let i = 1; i <= totFormOpts.jsonModelFields; i++) {
        data +=
          document.getElementById("jsonModel_" + i).getAttribute("value") || "";
        }
        
        data +=  document.getElementById("numero_cotizacion").getAttribute("value") || "";
      try {
        data = JSON.parse(data);
        this.model = {
          ...this.model,
          ...data,
        };
        data = null;
      } catch (e) {}
    },
    save() {
      if (!this.validate()) {
        return;
      }

      console.log("Saving form data ...");
      console.log(JSON.stringify(this.model));

      const arr = this.chunkSubstr(JSON.stringify(this.model), 65000);

      if (arr.length > totFormOpts.jsonModelFields) {
        throw "Muchos datos";
      }

      for (let i = 0; i < totFormOpts.jsonModelFields; i++) {
        this.$refs["jsonModel_" + (i + 1)].value = i < arr.length ? arr[i] : "";
      }
      
      // this.$refs['numero_cotizacion'].value = '1';
    

      console.log("Form data saved.");
    },
    validate() {
      document.getElementById("__error").value = "SUCCESS";
      return true;
    },

    chunkSubstr(str, size) {
      const numChunks = Math.ceil(str.length / size);
      const chunks = new Array(numChunks);

      for (let i = 0, o = 0; i < numChunks; ++i, o += size) {
        chunks[i] = str.substr(o, size);
      }

      return chunks;
    },

    getClientSelect(){
      const clienteSel = this.clientes.find(cliente => cliente.cod === this.model.codCli);
      if(clienteSel){
        this.model.razSoc = clienteSel.name;
        this.model.CUITCli = clienteSel.cuit;
        this.viewTrigger = true;
      }else{
        this.model.razSoc = '';
        this.model.CUITCli = '';
        this.viewTrigger = false;
      }
    },
  },
});

function getHistorial() {
  var constraints = new Array();
  //constraints.push(DatasetFactory.createConstraint("sqlLimit", "10", "10", ConstraintType.MUST));
  //var dataset = DatasetFactory.getDataset("dsSolicitudCotizacion", ['numero_cotizacion'], constraints, ['numero_cotizacion DESC']);
  
  var dataset = DatasetFactory.getDataset("dsSolicitudCotizacion", null, constraints, null);

  return dataset;
};


function getCotiz() {
  var valorActual = 0;
  var valorNuevo = 0;
  var constraints = new Array();
  constraints.push(DatasetFactory.createConstraint("sqlLimit", "10", "10", ConstraintType.MUST));
  var dataset = DatasetFactory.getDataset("dsTestNumCotiz", ['numero_cotizacion'], constraints, ['numero_cotizacion DESC']);
  
  if (dataset.values.length > 0) {
    valorActual= parseInt(dataset.values[0].numero_cotizacion);
  } 
  

  valorNuevo = valorActual + 1 ;

  return valorNuevo;
};

function getClientes(idCliente) {
  var constraints = []
  var clientesResult = []
  if (idCliente){
    constraints.push(DatasetFactory.createConstraint('searchKey', idCliente, idCliente, ConstraintType.MUST));
  }
  constraints.push(DatasetFactory.createConstraint('pageSize', "100000", "100000", ConstraintType.MUST));

  var clientes = DatasetFactory.getDataset("clientes_Protheus", null, constraints, null);
      for (var j = 0; j < clientes.values.length; j++) {
          clientesResult.push({ name: clientes.values[j]['name'], cod: clientes.values[j]['id'],cuit: clientes.values[j]['cuit'] })
  }

  return clientesResult
};


function getSellers(idSeller) {
  var constraints = []
  var sellersResult = []
  if (idSeller){
    constraints.push(DatasetFactory.createConstraint('searchKey', idSeller, idSeller, ConstraintType.MUST));
  }
  constraints.push(DatasetFactory.createConstraint('pageSize', "100", "100", ConstraintType.MUST));

  var sellers = DatasetFactory.getDataset("vendedores_Protheus", null, constraints, null);
      for (var j = 0; j < sellers.values.length; j++) {
        sellersResult.push({ name: sellers.values[j]['name'], cod: sellers.values[j]['cod'] })
  }

  return sellersResult
};


function getMonedas(idMoneda) {
  var constraints = []
  var monedasResult = []
  if (idMoneda){
    constraints.push(DatasetFactory.createConstraint('searchKey', idMoneda, idMoneda, ConstraintType.MUST));
  }
  constraints.push(DatasetFactory.createConstraint('pageSize', "100", "100", ConstraintType.MUST));

  var monedas = DatasetFactory.getDataset("monedas_Protheus", null, constraints, null);
      for (var j = 0; j < monedas.values.length; j++) {
        monedasResult.push({ cod: monedas.values[j]['cod'], desc: monedas.values[j]['description'],symb: monedas.values[j]['symb'], desc2:monedas.values[j]['symb'] + ' - ' + monedas.values[j]['description']})
  }

  return monedasResult
};


function getPaidMethod(idMethod) {
  var constraints = []
  var methodsResult = []
  if (idMethod){
    constraints.push(DatasetFactory.createConstraint('searchKey', idMethod, idMethod, ConstraintType.MUST));
  }
  constraints.push(DatasetFactory.createConstraint('pageSize', "100", "100", ConstraintType.MUST));

  var paidmethods = DatasetFactory.getDataset("metodosDePago_Protheus", null, constraints, null);
      for (var j = 0; j < paidmethods.values.length; j++) {
        methodsResult.push({ cod: paidmethods.values[j]['cod'], desc: paidmethods.values[j]['description'],cond: paidmethods.values[j]['condition'] })
  }

  return methodsResult
};


var beforeSendValidate = function (numState, nextState) {
  vm.save();
};


function fechaDelDia(Inc){
  var fechaD = new Date();

  if(Inc != null){
    var fechaInc = new Date();
    fechaInc.setDate(fechaD.getDate() + Inc);
    fechaD = fechaInc;
  }

  return formatoFecha(fechaD)
}

function formatoFecha(fecha){
  var mes = fecha.getMonth()+1;
  var dia = fecha.getDate();
  var ano = fecha.getFullYear();
  if(dia<10)
  dia='0'+dia;
  if(mes<10)
  mes='0'+mes
  
  return dia+"/"+mes+"/"+ano;
  
}

