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
      viewMode: true,
      procesoFinalizado: false,
      WKNumState: 0,
      WKDef: "",
      model: {
        // numcotiz: getCotiz(),
        numcotiz: '',
        fecha: fechaFormulario.innerHTML == '' ? fechaDelDia() : fechaFormulario.innerHTML,
      },
      required: [(v) => !!v || "Campo requerido"],
    };
  },
  computed: {
    console: () => console,
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
  },
});

function getCotiz() {
  var valorActual = 0;
  var valorNuevo = 0;
  var dataset = DatasetFactory.getDataset("dsNumeroCotizacion", null, [], null);
  var constraints = new Array();
  
  var limit   = DatasetFactory.createConstraint("sqlLimit", "10", "10", ConstraintType.MUST)
  constraints.push(limit)
  // var ordenDesc = DatasetFactory.createConstraint("orderby", "numero_cotizacion", "numero_cotizacion", ConstraintType.MUST)
  // ordenDesc.setOrderType
  // constraints.push(DatasetFactory.createConstraint("max(numero_cotizacion)", null, null, ConstraintType.MUST));
  var dataset2 = DatasetFactory.getDataset("dsTestNumCotiz", ['numero_cotizacion'], [], ['numero_cotizacion DESC']);
  var dataset3 = DatasetFactory.getDataset("dsTestNumCotiz", ['numero_cotizacion'], constraints, ['numero_cotizacion DESC']);
  var maxValor = parseInt(dataset2.values[0].numero_cotizacion) 
  maxValor++

  console.log(toString(maxValor));
  console.log(dataset2);
  console.log(dataset2.values[0].numero_cotizacion )
  if (dataset != null) {
    /* dataset.rowsCount > 0 && */
    console.log(dataset.values[0].NumeroCotizacion)
    valorActual = parseInt(dataset.values[0].NumeroCotizacion);
  }
  console.log(toString(valorActual));

  valorNuevo = valorActual++;

  return valorNuevo;
}

var beforeSendValidate = function (numState, nextState) {
  vm.save();
};


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