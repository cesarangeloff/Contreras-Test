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
      viewPlazo: false,
      procesoFinalizado: false,
      plazoEntrega: false,
      WKNumState: 0,
      WKDef: "",
      model: {
        itemsPrincipal: [{}],
        numcotiz: getCotiz(),
        // numcotiz: '',
        fecha: fechaFormulario.innerHTML == '' ? fechaDelDia() : fechaFormulario.innerHTML,
        fechaSeg: fechaFormulario.innerHTML == '' ? fechaDelDia(7) : fechaFormulario.innerHTML,
      },
      itemsHistorial: getHistorial(), //[{}],
      clientes: getClientes(),
      sellers: getSellers(),
      monedas: getMonedas(),
      paidmetods: getPaidMethod(),
      productos: getProducts(),
      priceList: getLista(),
      required: [(v) => !!v || "Campo requerido"],
    };
  },
  computed: {
    console: () => console,
    headersHistorial() {
      return [
              { text: 'Nro. Cotizacion', align: 'center', value: 'nroCotiz', width: '10rem', sortable: false },
              { text: 'Cliente', align: 'center', value: 'cliente', width: '10rem', inputType: 'text', sortable: false },
              { text: 'Tipo Cotización', align: 'center', value: 'tipoCotiz', width: '10rem', inputType: 'text', sortable: false },
              { text: 'Cotización Asociada', align: 'center', value: 'cotizAsoc', width: '6rem', inputType: 'text', sortable: false },
              // { text: 'Revisión', align: 'center', value: 'revision', width: '6rem', inputType: 'text', sortable: false },
              { text: 'Copiar', align: 'center', value: 'deleteRow', type: 'icon', width: '8rem', sortable: false},
      ];
    },

    headersPrincipal() {
      
      return  [
        { text: 'Codigo', align: 'center', value: 'codigo', type: 'input', width: '8rem', sortable: false, disabled: true },
        { text: 'Item OC', align: 'center', value: 'item', type: 'input', width: '5rem', inputType: 'text', sortable: false, disabled:this.viewMode },
        { text: 'Producto', align: 'center', value: 'producto', type: 'v-autocomplete', width: '15rem', inputType: 'text', sortable: false, disabled:this.viewMode },
        { text: 'URL producto', align: 'center', value: 'url_producto', type: 'input', width: '12rem', inputType: 'text', sortable: false, disabled: true },
        { text: 'Cantidad', align: 'center', value: 'cantidad', type: 'input', width: '5rem', inputType: 'text', sortable: false, disabled:this.viewMode},
        { text: 'Plazo de entrega(dias)', align: 'center', value: 'plazo_entrega', type: 'input', width: '5rem', inputType: 'text', sortable: false, disabled:this.viewMode },
        { text: 'Precio de lista', align: 'center', value: 'precio_lista', type: 'input', width: '5rem', inputType: 'text', sortable: false, disabled: true },
        { text: 'Precio neto', align: 'center', value: 'precio_neto', type: 'input', width: '5rem', inputType: 'text', sortable: false, disabled: true},
        { text: 'Descuento item', align: 'center', value: 'desc_item', type: 'input', width: '5rem', inputType: 'text', sortable: false, disabled: true},
        { text: 'Descuento adicional', align: 'center', value: 'desc_adic', type: 'input', width: '5rem', inputType: 'text', sortable: false, disabled:this.viewMode },
        { text: 'Mejora plazo entrega', align: 'center', value: 'mejora_plazo', type: 'checkbox', width: '3rem', sortable: false, disabled:this.viewMode },
        { text: '', align: 'center', value: 'deleteRow', type: 'icon', width: '2rem', sortable: false, disabled:this.viewMode},
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
    
    productosMod() {
      return this.productos.map(producto => ({
        ...producto,
        claveProd: `${producto.descripcion}    ||    ${producto.grupo}    ||    ${producto.codigo}`
      }));
    },
  },
  methods: {
    init() {
      this.loadModel();
      // if (this.WKNumState == 2) {
      //   this.model.numcotiz = document.getElementById("numero_cotizacion").getAttribute("value")|| ""
      //   this.viewMode = true
      // }
      if (this.WKNumState == 5) {
        this.viewMode = true
      }
    },
    loadModel() {
      let data = "";

      for (let i = 1; i <= totFormOpts.jsonModelFields; i++) {
        data +=
          document.getElementById("jsonModel_" + i).getAttribute("value") || "";
        }
        
        // data +=  document.getElementById("numero_cotizacion").getAttribute("value") || "";
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

    addItemPrincipal(data) {
      this.model.itemsPrincipal.push({})
    },
    deleteItem(item){
      if(confirm('¿Desea eliminar la fila seleccionada?')){    		 
        this.model.itemsPrincipal.splice(this.model.itemsPrincipal.indexOf(item), 1)
      }
    },

    copyItem(item){
      var numCotizActual = this.model.numcotiz;
      var constraints = [];
      var modelo = "";
      var idItem = item[0].toString();
      constraints.push(DatasetFactory.createConstraint('id', idItem, idItem, ConstraintType.MUST));
      var modelSolicitud = DatasetFactory.getDataset("dsSolicitudCotizacion", null, constraints, null);
      let data = "";
      for (let i = 1; i <= modelSolicitud.values.length; i++) {
        modelo = "modelSolicitud.values[0].jsonModel_"+i;
        data += eval(modelo);
      }
      try {
        data = JSON.parse(data);
        this.model = {
          ...this.model,
          ...data,
        };
      if (!data.cotizAsoc){
        this.model.cotizAsoc = data.numcotiz;
        }
        this.model.numcotiz = numCotizActual;
        data = null;
        this.dialogHistorial = false;
      } catch (e) {}
    },


    getClientSelect(){
      const clienteSel = this.clientes.find(cliente => cliente.cod === this.model.codCli);
      if(clienteSel){
        this.model.razSoc = clienteSel.name;
        this.model.CUITCli = clienteSel.cuit;
        this.viewTrigger = true;
        if (clienteSel.estado === 'EX') {
          this.model.tipoCotiz = 'Comex';
      } else {
          this.model.tipoCotiz = 'Nacional';
      }
      }else{
        this.model.razSoc = '';
        this.model.CUITCli = '';
        this.viewTrigger = false;
      }
    },
    
    getProdSelect(item){
      const prodSel = this.productos.find(producto => producto.descripcion === item.producto);
      if(item.mejora_plazo){
        item.mejora_plazo = true;
      }else{
        item.mejora_plazo = false;
      }
      if(prodSel){
        // this.model.itemsPrincipal.codigo = prodSel.codigo;
        item.codigo = prodSel.codigo;
        // item.precio_lista = getPrecioLista()
        // this.model.CUITCli = clienteSel.cuit;
      }else{
        // this.model.itemsPrincipal.codigo = '';
        item.codigo = '';
        // this.model.CUITCli = '';
      }
    },

    sumTotal(value){
      return this.model.itemsPrincipal.reduce((acc, d) => acc += (parseFloat(d[value]) || 0), 0)
      //return 0;
     }
  },
});

function getPrecioLista(){

};

function getHistorial() {
  var constraints = [];
		var historialResult = [];
var jsonId = [];
  var string = "";
  //constraints.push(DatasetFactory.createConstraint("sqlLimit", "10", "10", ConstraintType.MUST));
  //var dataset = DatasetFactory.getDataset("dsSolicitudCotizacion", ['numero_cotizacion'], constraints, ['numero_cotizacion DESC']);
  
  var historial = DatasetFactory.getDataset("dsSolicitudCotizacion", null, constraints, ['numero_cotizacion ASC']);

  for (var j = 0; j < historial.values.length; j++) {
        
    string = "historial.values["+j+"].jsonModel_1";
    model = eval(string);

    data = JSON.parse(model)
    if (data)
      jsonId =[historial.values[j].id, data];
      historialResult.push(jsonId);
  }
  
  return historialResult;  
};

function getCotiz() {
  var valorActual = 0;
  var valorNuevo = 0;
  var valorNuevoComp = '';
  var constraints = new Array();
  constraints.push(DatasetFactory.createConstraint("sqlLimit", "10", "10", ConstraintType.MUST));
  var dataset = DatasetFactory.getDataset("dsSolicitudCotizacion", ['numero_cotizacion'], constraints, ['numero_cotizacion DESC']);
    if (dataset.values.length > 0) {
    if (dataset.values[0].numero_cotizacion != ''){
        valorActual= parseInt(dataset.values[0].numero_cotizacion);
    }
  } 
  
  valorNuevo = valorActual + 1 ;

  valorNuevoComp = formatNumber(valorNuevo, 6);

  return valorNuevoComp;
};

function getClientes(idCliente) {
  var constraints = []
  var clientesResult = []
  if (idCliente){
    constraints.push(DatasetFactory.createConstraint('searchKey', idCliente, idCliente, ConstraintType.MUST));
  }
  constraints.push(DatasetFactory.createConstraint('pageSize', "1000", "1000", ConstraintType.MUST));

  var clientes = DatasetFactory.getDataset("clientes_Protheus", null, constraints, null);
      for (var j = 0; j < clientes.values.length; j++) {
          clientesResult.push({ name: clientes.values[j]['name'], cod: clientes.values[j]['id'],cuit: clientes.values[j]['cuit'],estado: clientes.values[j]['estado']  })
  }

  return clientesResult
};


function getSellers(idSeller) {
  var constraints = []
  var sellersResult = []
  if (idSeller){
    constraints.push(DatasetFactory.createConstraint('searchKey', idSeller, idSeller, ConstraintType.MUST));
  }
  constraints.push(DatasetFactory.createConstraint('pageSize', "1000", "1000", ConstraintType.MUST));

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
  constraints.push(DatasetFactory.createConstraint('pageSize', "1000", "1000", ConstraintType.MUST));

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
  constraints.push(DatasetFactory.createConstraint('pageSize', "1000", "1000", ConstraintType.MUST));

  var paidmethods = DatasetFactory.getDataset("metodosDePago_Protheus", null, constraints, null);
      for (var j = 0; j < paidmethods.values.length; j++) {
        methodsResult.push({ cod: paidmethods.values[j]['cod'], desc: paidmethods.values[j]['description'],cond: paidmethods.values[j]['condition'] })
  }

  return methodsResult
};


function getProducts(idProd) {
  var constraints = []
  var productsResult = []
  if (idProd){
    constraints.push(DatasetFactory.createConstraint('searchKey', idProd, idProd, ConstraintType.MUST));
  }
  constraints.push(DatasetFactory.createConstraint('pageSize', "100", "100", ConstraintType.MUST));

  var productos = DatasetFactory.getDataset("productos_Protheus", null, constraints, null);
      for (var j = 0; j < productos.values.length; j++) {
        productsResult.push({ codigo: productos.values[j]['codigo'], descripcion: productos.values[j]['descripcion'],grupo: productos.values[j]['grupo'] })
  }

  return productsResult
};

function getLista(idLista,idProd) {
  var constraints = []
  var pricelistResult = []
  if (idLista){
    constraints.push(DatasetFactory.createConstraint('lista', idLista, idLista, ConstraintType.MUST));
  }
  if (idProd){
    constraints.push(DatasetFactory.createConstraint('searchKey', idProd, idProd, ConstraintType.MUST));
  }
  constraints.push(DatasetFactory.createConstraint('pageSize', "100", "100", ConstraintType.MUST));
  // constraints.push(DatasetFactory.createConstraint('pageSize', "100", "100", ConstraintType.MUST));

  var pricelist = DatasetFactory.getDataset("listaPrecios_Protheus", null, constraints, null);
      for (var j = 0; j < pricelist.values.length; j++) {
        pricelistResult.push({ codpro: pricelist.values[j]['codpro'], cod_lista: pricelist.values[j]['cod_lista'],prcven: pricelist.values[j]['prcven'] })
  }

  return pricelistResult
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
};

function formatoFecha(fecha){
  var mes = fecha.getMonth()+1;
  var dia = fecha.getDate();
  var ano = fecha.getFullYear();
  if(dia<10)
  dia='0'+dia;
  if(mes<10)
  mes='0'+mes
  
  return dia+"/"+mes+"/"+ano;
  
};

function formatNumber(number, length) {
  var str = '' + number;
  while (str.length < length) {
      str = '0' + str;
  }
  return str;
}



// revisionItem(item){
//   var numCotizActual = this.model.numcotiz;
//   let data = getDsSolCotiz(item[0].toString());
//   try {
//     data = JSON.parse(data);
//     this.model = {
//       ...this.model,
//       ...data,
//     };

//     if (data.revision){
//       this.model.revision = data.revision + 1;  
//     } else {
//       this.model.revision = 1;
//     }

//     this.model.numcotiz = numCotizActual;
//     data = null;
//     this.dialogHistorial = false;
//   } catch (e) {}
// },