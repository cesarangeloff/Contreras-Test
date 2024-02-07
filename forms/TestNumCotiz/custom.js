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
      valid: true,
      dialogHistorial: false,
      viewMode: true,
      viewTrigger: false,
      viewPlazo: false,
      viewConfir:false,
      viewSeg:false,
      procesoFinalizado: false,
      WKNumState: 0,
      WKDef: "",
      search: "",
      model: {
        itemsPrincipal: [{}],
        numcotiz: getCotiz(),
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
              { text: 'Cliente', align: 'center', value: 'cliente', width: '10rem', inputType: 'text', sortable: false },
              { text: 'Vendedor', align: 'center', value: 'vendedor', width: '8rem', inputType: 'text', sortable: false },
              { text: 'Fecha Emisión', align: 'center', value: 'fechEmis', width: '10rem', inputType: 'text', sortable: false },
              { text: 'Fecha Seguimiento', align: 'center', value: 'fechSeg', width: '10rem', inputType: 'text', sortable: false },
              { text: 'Tipo Cotización', align: 'center', value: 'tipCotiz', width: '10rem', inputType: 'text', sortable: false },
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
        { text: 'Cantidad', align: 'center', value: 'cantidad', type: 'input', width: '5rem', inputType: 'text', sortable: false, disabled:this.viewMode },
        { text: 'Plazo de entrega(dias)', align: 'center', value: 'plazo_entrega', type: 'input', width: '5rem', inputType: 'text', sortable: false, disabled:true },
        { text: 'Precio de lista', align: 'center', value: 'precio_lista', type: 'input', width: '5rem', inputType: 'text', sortable: false, disabled: true },
        { text: 'Precio neto', align: 'center', value: 'precio_neto', type: 'input', width: '5rem', inputType: 'text', sortable: false, disabled: true},
        { text: 'Descuento item', align: 'center', value: 'desc_item', type: 'input', width: '5rem', inputType: 'text', sortable: false, disabled: true},
        { text: 'Descuento adicional', align: 'center', value: 'desc_adic', type: 'input', width: '5rem', inputType: 'text', sortable: false, disabled:this.viewMode },
        { text: 'Importe', align: 'center', value: 'importe', type: 'input', width: '5rem', inputType: 'text', sortable: false, disabled: true},
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
      if (this.WKNumState == 5) { //VISTA PLAZO DE ENTREGA
        this.viewMode = true
        this.viewPlazo = true

      }else if(this.WKNumState == 14){ //VISTA CONFIRMACION Y ENVIO CLIENTE
        this.viewMode = true
        this.viewConfir = true
        
      }else if(this.WKNumState == 12){ //VISTA SEGUIMIENTO
        this.viewMode = true
        this.viewSeg = true

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
        return false; //poner falso de retorno
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
          

      console.log("Form data saved.");
    },
    validate() {
      var validate = this.$refs.formvue.validate()
      document.getElementById("__error").value = "SUCCESS";
      return validate;
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
      //var constraints = [];
      //var modelo = "";
      //var idItem = item[0].toString();
      //constraints.push(DatasetFactory.createConstraint('id', idItem, idItem, ConstraintType.MUST));
      //var modelSolicitud = DatasetFactory.getDataset("dsSolicitudCotizacion", null, constraints, null);
      //let data = "";
      //for (let i = 1; i <= modelSolicitud.values.length; i++) {
        //  modelo = "modelSolicitud.values[0].jsonModel_"+i;
        //  data += eval(modelo);
      //}
      try {
        data = item;
        //data = JSON.parse(item);
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
        item.codigo       = prodSel.codigo;
        item.precio_lista = getPrecioLista(prodSel.codigo.trim(), this.model.listaPrecio);
        // item.cantidad     = 1;
        item.plazo_entrega= prodSel.plazo;
        item.desc_item    = '10'; // aca iria el campo de descuento obtenido desde la api de productos
        // item.desc_adic    = '0'; // se inicializa en este valor 
        this.totalCalc(item);
        
      }else{
        item.codigo       ='';
        item.precio_lista ='';
        item.cantidad     ='';
        item.desc_item    ='';
        item.desc_adic    ='';
        item.precio_neto  ='';
        item.importe      ='';
      }
    },

    totalCalc(item){
      
      item.precio_neto  = (item.desc_adic)? getDiscont(item.desc_item, item.desc_adic, item.precio_lista) :0 ;
      item.importe      = (item.cantidad)? getTotal( item.precio_neto, item.cantidad) :0 ;
      vm.$forceUpdate();

    },

    refreshPrecio(){

      if(this.model.itemsPrincipal.length > 0)  
        for(var i=0 ; i< this.model.itemsPrincipal.length; i++){
        
          this.getProdSelect(this.model.itemsPrincipal[i])
        
        }

    },

    sumSubTotal(value1, value2){
      var total = this.model.itemsPrincipal.reduce((acc, d) => acc += (parseFloat(d[value1]*d[value2]) || 0), 0);
      var formato = total.toLocaleString('es', { style: 'currency', currency: getCurrency(this.model.moneda) });
      return formato;
    },

    sumTotal(value){
      var total = this.model.itemsPrincipal.reduce((acc, d) => acc += (parseFloat(d[value]) || 0), 0);
      var formato = total.toLocaleString('es', { style: 'currency', currency: getCurrency(this.model.moneda) });
      return formato;
    },

    searchFilter(item, search) {
      return Object.values(item[1]).some(value => this.includesSearch(value, search));
    },

    includesSearch(value, search) {
      return String(value).toLowerCase().includes(search);
    },

    customFilter(item, queryText, itemText) {
      const searchText = queryText.toLowerCase();
      return (
        itemText.razSoc.toLowerCase().includes(searchText) ||
        itemText.codVendedor.toString().includes(searchText) ||
        itemText.tipoCotiz.toString().includes(searchText) 
        // Agrega más condiciones según tus campos
      );
     },

     validaPlazos(value){
         // Verificar si el valor está vacío
        if (value === null || value.trim() === '') {
          return true; // Valor vacío permitido
        }

        const plazoGlobal = parseInt(value)
        const itemConMayorPlazo = this.model.itemsPrincipal.reduce((anterior, actual) => {
          return parseInt(actual.plazo_entrega) > parseInt(anterior.plazo_entrega) ? actual : anterior;
        }, this.model.itemsPrincipal[0]); // Se inicia con el primer elemento como referencia

        return plazoGlobal >= parseInt(itemConMayorPlazo.plazo_entrega) || "El plazo de entrega global debe ser mayor o igual al mayor plazo de entrega de los ítems.";
     },

     refreshPlazo(value){
        const validation = this.validaPlazos(value)
        if(validation === true){
            // Se procede a reemplazar los plazos de entrega de los items con el nuevo valor global
            this.model.itemsPrincipal.forEach(item => {
              item.plazo_entrega = value.trim();
            });
            vm.$forceUpdate();
        }else{
          console.error('Error: ' , validation);
        }
     },

    //  validateFechaSeg(value) {
    //   if (!this.viewConfir) {
    //     return true; // Si el campo está deshabilitado, no aplicar validación
    //   }

    //   const selectedDate = new Date(value);
    //   const currentDate = new Date();
    //   const futureDate = new Date(currentDate); // Clonamos la fecha actual
    //   futureDate.setDate(currentDate.getDate() + 365); // Ajustamos para permitir un año en el futuro

    //   if (selectedDate >= currentDate && selectedDate <= futureDate) {
    //     return true; // Fecha seleccionada es posterior o igual a la fecha actual y hasta un año en el futuro
    //   } else {
    //     return 'La fecha debe ser igual o posterior a la fecha actual y hasta un año en el futuro'; // Mensaje de error
    //   }
    // },

  },
});


function getCurrency(moneda){
  var abrev = 'ARS';
  switch (moneda) {
    case "DOLARES":
      abrev = 'USD';
      break;
    
    case "PESOS":
      abrev = 'ARS';
      break;

    case "EUROS":
      abrev = 'EUR';
      break;
  }
  return abrev;
}


function getDiscont( nDiscItem, nDiscAdd, nPrecioLista) {

  var desc      = parseInt(nDiscItem) + parseInt(nDiscAdd)
  nPrecioLista  = parseFloat(nPrecioLista)

  return (nPrecioLista - nPrecioLista * desc / 100).toFixed(2)
}


function getTotal( nPrecioNeto, nCantidad) {
  
  nPrecioNeto = parseFloat(nPrecioNeto)
  nCantidad   = parseInt(nCantidad)
  
  return (nPrecioNeto * nCantidad).toFixed(2);
}


function getPrecioLista(idProd, idLista){
  var lista = getLista(idLista,idProd, "10")
  var retPrecio = 0
  if (lista.length > 0) {
    if (lista[0].prcven != ''){
      retPrecio= lista[0].prcven.toFixed(2); //pasa a string con dos decimales el precio obtenido
    }
  } 
  return retPrecio
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
        
    for (var k = 1; k <= 30; k++){
      string = "historial.values["+j+"].jsonModel_"+k+"";
    model = eval(string);
if (model != ''){
    data = JSON.parse(model);
      historialResult.push(data);
}
    }
  }
  
  return historialResult;  
};

function getCotiz() {
  var valorActual = 0;
  var valorNuevo = 0;
  var valorNuevoComp = '';
  var constraints = new Array();
  constraints.push(DatasetFactory.createConstraint("sqlLimit", "10", "10", ConstraintType.MUST));
  var dataset = DatasetFactory.getDataset("dsTestNumCotiz", ['numero_cotizacion'], constraints, ['numero_cotizacion DESC']);
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
        productsResult.push({ codigo: productos.values[j]['codigo'], descripcion: productos.values[j]['descripcion'],grupo: productos.values[j]['grupo'], plazo:productos.values[j]['plazo']})
  }

  return productsResult
};

function getLista(idLista,idProd, nlimit) {
  var constraints = []
  var pricelistResult = []
  if (idLista){
    constraints.push(DatasetFactory.createConstraint('lista', idLista, idLista, ConstraintType.MUST));
  }
  if (idProd){
    constraints.push(DatasetFactory.createConstraint('searchKey', idProd, idProd, ConstraintType.MUST));
  }
  if (nlimit){
    constraints.push(DatasetFactory.createConstraint('sqlLimit', nlimit, nlimit, ConstraintType.MUST));
  }else{
    constraints.push(DatasetFactory.createConstraint('pageSize', "100", "100", ConstraintType.MUST));
  }


  var pricelist = DatasetFactory.getDataset("listaPrecios_Protheus", null, constraints, null);
      for (var j = 0; j < pricelist.values.length; j++) {
        pricelistResult.push({ codpro: pricelist.values[j]['codpro'], cod_lista: pricelist.values[j]['cod_lista'],prcven: pricelist.values[j]['prcven'] })
  }

  return pricelistResult
};

var beforeSendValidate = function (numState, nextState) {
  return vm.save();
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