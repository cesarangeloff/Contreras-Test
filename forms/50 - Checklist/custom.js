var totFormOpts = {
  jsonModelFields: 30,
  WKUser: null,
  WKNumProces: WKNumProces,
  WKDef: null,
  formMode: null
};
Vue.config.devtools = true;
Vue.directive('mask', VueMask.VueMaskDirective);
Vue.use('vueImoment');
const vm = new Vue({
  el: '#app',
  vuetify: new Vuetify(),
  // store: store,
  data() {
    return {
      viewMode: true,
      tab: null,
      model: {
        items: []
      },
      estados: ['En Aprobacion', 'Aprobado', 'Rechazado'],
      dialog: false,
      headerModal: {
        formulario: '',
        titulo: '',
        requerido: false,
        metaforms: 0,
        jsonData: '[]'
      },
      detallesHeader: [{ text: 'Solicitud', value: 'idSolicitud' }, { text: 'Estado', value: 'estado' }, { text: 'Fecha Creacion', value: 'fechaCreacion' }, { text: 'Ultima Actualizacion', value: 'ultimaActualizacion' }],
      detallesItem: {},
      logos: getLogos(),
      grupos: null,
      urlLgCliente: 'no-img.png',
      urlLgContreras: 'no-img.png',
      required: [
        v => !!v || "Campo requerido"
      ],
    }
  },
  computed: {
    console: () => console,
    headers() {
      var cols = []
      cols.push({ text: 'Formulario', align: 'center', sortable: false, value: 'formulario' })
      cols.push({ text: 'Titulo', align: 'center', sortable: false, value: 'titulo' })
      cols.push({ text: 'Requerido', align: 'center', value: 'requerido', type: 'switch' })
      cols.push({ text: 'Meta de Formularios', align: 'center', value: 'metaforms', type: 'input', inputType: 'number', width: 20 })
      //cols.push({ text: 'jsonData', align: 'center', value: 'jsonData', type: 'input', inputType: 'text' })
      if (totFormOpts.WKNumProces > 0) {
        cols.push({ text: 'Realizados', align: 'center', value: 'total' })
        cols.push({ text: 'En Aprobacion', align: 'center', value: 'enAprobacion' })
        cols.push({ text: 'Aprobados', align: 'center', value: 'aprobados' })
        cols.push({ text: 'Rechazados', align: 'center', value: 'rechazados' })
        cols.push({ text: 'Acciones', align: 'center', value: 'acciones' })
      }
      return cols;
    },
    headerData() {
      return this.headerModal
    },
  },
  methods: {
    init() {
      this.loadModel();
      if (totFormOpts.WKNumState == 0)
        this.model.items = getRows()
      this.loadLogos();
      this.getGroups();
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
        this.$refs['jsonModel_' + (i + 1)].value = i < arr.length ? arr[i].replaceAll('"', '\\"') : ''
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
    lgCliente(idDoc) {
      var logo = getLogos(idDoc)
      if (logo.length > 0) {
        this.urlLgCliente = `${parent.WCMAPI.serverURL}/webdesk/streamcontrol/${logo[0].fileName}?WDCompanyId=1&WDNrDocto=${logo[0].value}&WDNrVersao=${logo[0].version}`
      }
    },
    lgContreras(idDoc) {
      var logo = getLogos(idDoc)
      if (logo.length > 0) {
        this.urlLgContreras = `${parent.WCMAPI.serverURL}/webdesk/streamcontrol/${logo[0].fileName}?WDCompanyId=1&WDNrDocto=${logo[0].value}&WDNrVersao=${logo[0].version}`
      }
    },
    editItem(item) {
      console.log(item)
      this.headerModal = item
      this.detallesItem = JSON.parse(item.jsonData)
      console.log(this.detallesItem)
      this.dialog = true
    },
    close() {
      this.dialog = false
      this.$nextTick(() => {
        this.detallesItem = Object.assign({}, this.defaultItem)
        this.headerModal = {}
      })
    },
    loadLogos() {
      if (this.model.logoCliente)
        this.lgCliente(this.model.logoCliente)
      if (this.model.logoContreras)
        this.lgContreras(this.model.logoContreras)
    },
    getGroups() {
      var grupos = [{ text: 'N/A', value: '' }]
      var constraints = []

      var docs = DatasetFactory.getDataset('group', null, constraints, null);
      for (var j = 0; j < docs.values.length; j++) {
        grupos.push({ text: docs.values[j]['groupDescription'], value: docs.values[j]['groupPK.groupId'] })
      }
      this.grupos = grupos
    },
    imprimir() {
      $("#btnExportarPdf").trigger("click")
    }
  },
})

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



function getRows() {
  var rows = [
    { jsonData: '[]', formulario: 'ITABA001-F1', titulo: 'Recepción de Caños' },
    { jsonData: '[]', formulario: 'ITOPE002-F1_3', titulo: 'Montaje de Instrumentos' },
    { jsonData: '[]', formulario: 'ITOPE002-F1', titulo: 'Deteccion de cañerias' },
    { jsonData: '[]', formulario: 'ITOPE003-F1', titulo: 'Topografía - VISTA' },
    { jsonData: '[]', formulario: 'ITOPE004-F2-1', titulo: 'Conexiones apernadas' },
    { jsonData: '[]', formulario: 'ITOPE004-F3-0', titulo: 'Soldadura de soportes y estructuras' },
    { jsonData: '[]', formulario: 'ITOPE004-F4-2', titulo: ' Liberacion de estructuras' },
    { jsonData: '[]', formulario: 'ITOPE004-F5_2', titulo: 'Fabricación de soportes' },
    { jsonData: '[]', formulario: 'ITOPE004-F2', titulo: 'Apertura de pista' },
    { jsonData: '[]', formulario: 'ITOPE005-F1', titulo: 'Desfile de Cañerías' },
    { jsonData: '[]', formulario: 'ITOPE006-F1', titulo: 'Curvado de cañeria en frio' },
    { jsonData: '[]', formulario: 'ITOPE006-F2', titulo: 'Montaje y alineación de equipos rotativos' },
    { jsonData: '[]', formulario: 'ITOPE006-F3', titulo: 'Alineación vertical de equipos rotativos' },
    { jsonData: '[]', formulario: 'ITOPE006-F5', titulo: 'Montaje de equipos rotativos alineación' },
    { jsonData: '[]', formulario: 'ITOPE006-F1', titulo: 'Curvado de Cañería en Frío' },
    { jsonData: '[]', formulario: 'ITOPE007-F1', titulo: 'Control diario Soldadura' },
    { jsonData: '[]', formulario: 'ITOPE007-F5', titulo: 'Control Parámetros soldadura' },
    { jsonData: '[]', formulario: 'ITOPE007-F7', titulo: 'Empalme cañerias' },
    { jsonData: '[]', formulario: 'ITOPE009-F1', titulo: 'Trazabilidad de Soldaduras y Materiales' },
    { jsonData: '[]', formulario: 'ITOPE009-F1-0', titulo: 'Trazabilidad de Soldaduras y Materiales' },
    { jsonData: '[]', formulario: 'ITOPE010-F1-0', titulo: 'Registro de uniones bridadas' },
    { jsonData: '[]', formulario: 'ITOPE011-F1-1', titulo: 'Registro de uniones de cañería de acero' },
    { jsonData: '[]', formulario: 'ITOPE011-F3', titulo: 'Control de Parametros soldadura' },
    { jsonData: '[]', formulario: 'ITOPE012-F1-01', titulo: 'Control de Revestimiento de Juntas' },
    { jsonData: '[]', formulario: 'ITOPE012-F3', titulo: 'Arenado' },
    { jsonData: '[]', formulario: 'ITOPE013-F1', titulo: 'Control de Soldadura Cuproaluminotérmica' },
    { jsonData: '[]', formulario: 'ITOPE014-F1-1', titulo: 'Registro de Uniones de Soldadura HDPE' },
    { jsonData: '[]', formulario: 'ITOPE015-F1_1', titulo: 'Registro de Uniones de CPVC' },
    { jsonData: '[]', formulario: 'ITOPE015-F2-0', titulo: 'Trazabilidad de Soldaduras y Materiales de CPVC' },
    { jsonData: '[]', formulario: 'ITOPE015-F1', titulo: 'Registro de Datos de Zanja' },
    { jsonData: '[]', formulario: 'ITOPE016-F1-1', titulo: 'Control canalizaciones electricas' },
    { jsonData: '[]', formulario: 'ITOPE016-F2', titulo: 'Registro de tapada' },
    { jsonData: '[]', formulario: 'ITOPE017-F1-2', titulo: 'Tendido cables instrumentación' },
    { jsonData: '[]', formulario: 'ITOPE017-F2-1', titulo: 'Continuidad cables instrumentacion' },
    { jsonData: '[]', formulario: 'ITOPE017-F4-2', titulo: 'Conexionado cables instrumentación' },
    { jsonData: '[]', formulario: 'ITOPE017-F2', titulo: 'Registro PH' },
    { jsonData: '[]', formulario: 'ITOPE017-F5', titulo: 'Acta Placa Calibre' },
    { jsonData: '[]', formulario: 'ITOPE018-F1-3', titulo: 'Tendido de cables eléctricos' },
    { jsonData: '[]', formulario: 'ITOPE018-F4-1', titulo: 'Conexionado de cables eléctricos' },
    { jsonData: '[]', formulario: 'ITOPE018-F5-2', titulo: 'Megado y continuidad de cables' },
    { jsonData: '[]', formulario: 'ITOPE032-F1-0', titulo: 'Registro soldadura cupro' },
    { jsonData: '[]', formulario: 'ITOPE032-F2-2', titulo: 'Chequeo de Puesta a Tierra de Bandeja y Equipos' },
    { jsonData: '[]', formulario: 'ITOPE034-F1-1', titulo: 'Verificacion caudalimetros' },
    { jsonData: '[]', formulario: 'ITOPE040-F1-0', titulo: 'Estanqueidad tanques abulonados' },
    { jsonData: '[]', formulario: 'ITOPE040-F2-0', titulo: 'Control cotas tanques abulonados' },
    { jsonData: '[]', formulario: 'ITOPE043-F2', titulo: 'Zanjeo' },
    { jsonData: '[]', formulario: 'ITOPE043-F3', titulo: 'Revestimiento' },
    { jsonData: '[]', formulario: 'ITOPE043-F4', titulo: 'Pretapada y tapada' },
    { jsonData: '[]', formulario: 'ITOPE044-F2-F3', titulo: 'Prueba neumatica cañerias' },
    { jsonData: '[]', formulario: 'ITOPE048-F1', titulo: 'Montaje de botoneras' },
    { jsonData: '[]', formulario: 'ITOPE050-F1-0', titulo: 'Registro de Uniones de PRFV' },
    { jsonData: '[]', formulario: 'ITOPE050-F3-0', titulo: 'Registro Fotográfico END' },
    { jsonData: '[]', formulario: 'ITOPE053-F1', titulo: ' Registro Instalación de Tubing' },
    { jsonData: '[]', formulario: 'ITOPE071-F1', titulo: 'Canalizaciones y Tendidos de Cables E_I' },
    { jsonData: '[]', formulario: 'ITOPE072-F1', titulo: 'Registro de Continuidad, Conexionado, Megado y Torque' },
    { jsonData: '[]', formulario: 'ITOPE075-F1-0', titulo: 'Reg Lib y Torque de Uniones Victaulic' },
    { jsonData: '[]', formulario: 'ITOPE101-F1', titulo: 'Barrido y Secado de Cañerias' },
    { jsonData: '[]', formulario: 'PCLA-0000-RE-050-8001', titulo: 'Touch up de pintura' },
    { jsonData: '[]', formulario: 'PCLA-0000-RE-240-8002', titulo: 'Montaje de equipos mecánicos rotantes' },
    { jsonData: '[]', formulario: 'PCLA-0000-RE-240-8004', titulo: 'Montaje de equipos mecánicos estáticos' },
    { jsonData: '[]', formulario: 'PCLA-0000-RE-300-8001', titulo: 'Control de Aplicación de Grouting' },
    { jsonData: '[]', formulario: 'PCLA-0000-RE-310-8001', titulo: 'Control topográfico' },
    { jsonData: '[]', formulario: 'PCLA-0000-RE-410-8005', titulo: 'HOJA 1' },
    { jsonData: '[]', formulario: 'PCLA-0000-RE-410-8005', titulo: 'HOJA 2 Alineación de bombas con poleas' },
    { jsonData: '[]', formulario: 'PCLA-0000-RE-600-8010_1', titulo: 'Montaje tablero eléctrico' },
  ]
  return rows
}




$("#btnExportarPdf").totreport({
  "templateUrl": "/static/totv-templates/ChecklistTemplate.html",
  "log": 1,
  "generateData": function () {
    var productos = [];
    var rowCount = 100;
    for (var i = 1; i < rowCount - 1; i++) {
      var precioTotal = 9991
      productos.push({
        id: 1,
        descripcionProducto: 'Descripcion',
        cantidad: 123,
        precioVenta: 999,
        precioUnitario: 999,
        descuento: 0,
        descripcionAdicional: 'Descripcion Larga',
        precioTotal: 1999,
      });
    }
    var datos = {
      "numeroCotizacion": "numeroCotizacion",
      "fecha": "fecha",
      "atte": "atte",
      "cargo": "cargo",
      "empresa": "empresa",
      "tel": "tel",
      "mail": "mail",
      "idFluig": "idFluig",
      "modelo": "modelo",
      "chasis": "chasis",
      "precioTotal": "precioTotal",
      "condicionPago": "condicionPago",
      "moneda": "moneda",
      "fechaVigencia": "fechaVigencia",
      "emitidoPor": "emitidoPor",
      "productos": productos
    };
    return JSON.stringify(datos);
  },
  "generateFileName": function () { return "Checklist Nro..pdf"; },
});