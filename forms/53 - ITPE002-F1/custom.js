var totFormOpts = {
  jsonModelFields: 30,
  WKUser: null,
  WKNumProces: null,
  WKNumState: null,
  WKDef: null
};

console.log = (function (old_function, div_log) {
  return function (text) {
    old_function(text);
    div_log.textContent += text + '</br>';
  };
}(console.log.bind(console), document.getElementById("error-log")));

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
      tab: null,
      model: {
      },
      clientes: getClientes(),
      urlLgCliente: 'no-img.png',
      urlLgContreras: 'no-img.png',
      required: [
        v => !!v || "Campo requerido"
      ],
    }
  },

  computed: {
    console: () => console,
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
    },
    getClienteData(idCliente) {
      var cliente = getClientes(idCliente)
      if (cliente.length > 0) {
        console.log(cliente)
        logo = getLogos(cliente[0].logoCliente)
        console.log(logo)
        if (logo.length > 0) {
          this.urlLgCliente = `${parent.WCMAPI.serverURL}/webdesk/streamcontrol/${logo[0].fileName}?WDCompanyId=1&WDNrDocto=${logo[0].value}&WDNrVersao=${logo[0].version}`
        }
        logo = getLogos(cliente[0].logoContreras)
        if (logo.length > 0) {
          this.urlLgContreras = `${parent.WCMAPI.serverURL}/webdesk/streamcontrol/${logo[0].fileName}?WDCompanyId=1&WDNrDocto=${logo[0].value}&WDNrVersao=${logo[0].version}`
        }
      }
    },
    setEstado(estado) {
      this.model.estado = estado
    }

  }
})

function getClientes(idCliente) {
  var constraints = []
  var jsonClientes = ''
  var clientesResult = []
  //console.log('linea 117 | ')
  if (idCliente)
    constraints.push(DatasetFactory.createConstraint('requestId', idCliente, idCliente, ConstraintType.MUST));
  //console.log('linea 120 | ')
  var clientes = DatasetFactory.getDataset('dsClientes', null, constraints, null);
  //console.log('linea 122 | ')
  //console.log(clientes)
  for (var j = 0; j < clientes.values.length; j++) {
    jsonClientes = ''
    /*for (let i = 1; i <= totFormOpts.jsonModelFields; i++) {
      jsonClientes += clientes.values[j]['jsonModel_' + i]
    }*/
    //console.log('linea 129 | ')
    //console.log(clientes.values[j])
    data = JSON.parse(clientes.values[j].jsonClientes)
    clientesResult.push({ text: data.nombre, value: clientes.values[j]['requestId'], formularios: data.items, logoCliente: data.logoCliente, logoContreras: data.logoContreras, centroCosto: data.centroCosto })
  }

  //console.log(clientesResult)
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

var beforeSendValidate = function (numState, nextState) {
  vm.save()
}



