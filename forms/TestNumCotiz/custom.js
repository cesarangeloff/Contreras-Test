var totFormOpts = {
  jsonModelFields: 30,
  WKUser: null,
  WKNumProces: null,
  WKNumState: null,
  WKDef: null,
};
var fechaFormulario = document.querySelector('[v-model="model.fecha"]')

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
      dialogClientes: false,
      dialogProductos: false,
      Prod: {},
      currentIndex: null,
      date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substring(0, 10),
      date2: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substring(0, 10),
      dateFormatted: this.formatDate((new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substring(0, 10)),
      minDate:this.fechaDelDia(7).toISOString().substring(0, 10),
      menu2: false,
      menu3: false,
      viewMode: true,
      viewFirst: false,
      viewTrigger: false,
      viewPlazo: false,
      viewConfir:false,
      viewSeg:false,
      viewValP:false,
      viewItGan:false,
      viewAprCom:false,
      viewNewCli:false,
      viewUpCli:false,
      viewErro:false,
      viewGenPed: false,
      charge:false,
      procesoFinalizado: false,
      WKNumState: 0,
      md: "3",
      WKDef: "",
      search: "",
      model: {
        eventSeg: [],
        inputSeg: null,
        nonceSeg: 0,
        itemsPrincipal: [],
        numcotiz: getCotiz(),
        fecha: fechaFormulario.innerHTML    == '' ? this.formatDate(this.fechaDelDia().toISOString().substring(0, 10)) : fechaFormulario.innerHTML,
        fechaSeg: fechaFormulario.innerHTML == '' ? this.formatDate(this.fechaDelDia(7).toISOString().substring(0, 10)) : fechaFormulario.innerHTML,
        fechaVenc: '',
        totalItems: '',
        CUITCli: '',
        DirCli: '',
        codVendedor: '',
        metodoPago: '',
        dtoCliente: '',
        dtoAdicional: '',
        adic_phonecontact: '',
        adic_emailcontact: '',
        comercial_approv: '',
        responsable_venta:'',
        validP: '',
        lojaCli:'',
        codPago:'',
        codMoeda:'',
        abrevMoe:'USD',
        moneda:'DOLARES',
        erroIntegracion:'',
        adic_plazoValidez:'10',
        user_cotiz: '',
        refCli:''
      },
      clientes: [],
      sellers: [],
      monedas: [],
      paidmetods: [],
      productos: [],
      priceList: [],
      required: [(v) => !!v || "Campo requerido"],
      signo: [v => (parseFloat(v) >= 0 || v == '') || "Ingrese un valor positivo"]
    };
  },

  computed: {
    console: () => console,
    
    headersPrincipal() {
      var head = [
        { text: 'Codigo', align: 'center', value: 'codigo', type: 'input', width: '8rem', sortable: false, disabled: true },
        { text: 'Item OC', align: 'center', value: 'item', type: 'input', width: '5rem', inputType: 'text', sortable: false, disabled:this.viewMode },
        { text: 'Producto', align: 'center', value: 'producto', type: 'v-autocomplete', width: '22rem', inputType: 'text', sortable: false, disabled:this.viewMode },
        // { text: 'URL producto', align: 'center', value: 'url_producto', type: 'input', width: '12rem', inputType: 'text', sortable: false, disabled: true },
        { text: 'Cantidad', align: 'center', value: 'cantidad', type: 'input', width: '5rem', inputType: 'text', sortable: false, disabled:this.viewMode },
        { text: 'Plazo de entrega(dias)', align: 'center', value: 'plazo_entrega', type: 'input', width: '5rem', inputType: 'text', sortable: false, disabled:true },
        { text: 'Precio de lista', align: 'center', value: 'precio_lista', type: 'input', width: '5rem', inputType: 'text', sortable: false, disabled: true },
        { text: 'Precio neto', align: 'center', value: 'precio_neto', type: 'input', width: '5rem', inputType: 'text', sortable: false, disabled: true},
        { text: 'Descuento item', align: 'center', value: 'desc_item', type: 'input', width: '5rem', inputType: 'text', sortable: false, disabled: true},
        { text: 'Descuento adicional', align: 'center', value: 'desc_adic', type: 'input', width: '5rem', inputType: 'text', sortable: false, disabled:this.viewMode },
        { text: 'Importe', align: 'center', value: 'importe', type: 'input', width: '5rem', inputType: 'text', sortable: false, disabled: true},
        { text: 'Mejora plazo entrega', align: 'center', value: 'mejora_plazo', type: 'checkbox', width: '3rem', sortable: false, disabled:this.viewMode, show:true},
        { text: 'Item Ganado', align: 'center', value: 'item_ganado', type: 'checkbox', width: '3rem', sortable: false, disabled:!this.viewGenPed , show:this.viewGenPed },    
        { text: '', align: 'center', value: 'deleteRow', type: 'icon', width: '2rem', sortable: false, disabled:this.viewMode},
      ]

        
      if(!this.viewGenPed){
        const itemGanadoIndex = head.findIndex(header => header.value === 'item_ganado');
       
        if (itemGanadoIndex !== -1) {
          // Modificar la propiedad 'text' del objeto "Item  Ganado"
          head[itemGanadoIndex].text = '';

        }
      }
      

      return  head;
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
        claveSellers: this.WKNumState == 0 ? `${seller.name} - ${seller.cod}` : `${seller.name}`
      }));
    },

    productosMod() {
      return this.productos.map(producto => ({
        ...producto,
        claveProd: `${producto.producto}      ||     ${producto.codigo}     ||    ${producto.grupo}  `
      }));
    },

    timeline () {
      return this.model.eventSeg.slice().reverse()
    },
  },
  
  // watch: {
  //   date (val) {
  //     this.model.fechaSeg = this.formatDate(this.date)
  //   },
  // },
  
  methods: {
    init() {
      this.loadModel();
      switch (this.WKNumState) {
				case 0:
          this.charge = true;
          this.viewFirst = true;
					break;
        case 5:
          this.viewMode = true;  //VISTA PLAZO DE ENTREGA
          this.viewPlazo = true;
          break;
        case 14:                //VISTA CONFIRMACION Y ENVIO CLIENTE
          this.viewMode = true;
          this.viewConfir = true;
          break;
        case 12:                //VISTA SEGUIMIENTO
          this.viewMode = true;
          this.viewSeg = true;
          break;
        case 25:                //VISTA ACEPTA DENTRO DE VIGENCIA
          this.viewMode = true;
          break;
        case 23:                //VISTA VALIDA PLAZOS Y PRECIOS
          this.viewMode = true;
          this.viewValP = true;
          break;
        case 21:                //VISTA DECUENTOS POR ITEMS GANADOS
          this.viewMode = true;
          this.viewItGan = true;
          break;
        case 24:                //VISTA APROBACION COMERCIAL
          this.viewMode = true;
          this.viewAprCom = true;
          break;
        case 27:                //VISTA CARGA INICIAL CLIENTE
          this.viewMode = true;
          this.viewNewCli = true;
          break;
        case 28:                //VISTA FINALIZACION CARGA CLIENTE
          this.viewMode = true;
          this.viewUpCli = true;
          this.charge = true;
          this.md = "2";
          break;
        case 30:                //VISTA CARGAS VARIAS EN PROTHEUS
          this.viewMode = true;
          break;
        case 48:                //VISTA GENERACION DE PEDIDO DE VENTA
          this.viewMode = true;
          this.viewGenPed = true;
          break;
        case 54:                //ACCION DE CAPTURA DE ERROR INTEGRACION
          this.viewMode = true;
          this.viewErro = true;
          break;
        default:
          this.viewMode = true;

      }
      this.getAllDataSelect(this.charge);
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

      if(this.viewGenPed){
        if (!this.validateItemsGanados()) {
          return false; //poner falso de retorno
        }
      }

      if(this.viewValP){
        if (!this.validateButtValidacion()) {
          return false; //poner falso de retorno
        }
      }

      if(this.viewAprCom){
        if (!this.validateButtAprob()) {
          return false; //poner falso de retorno
        }
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
      
      if (this.viewValP) {
      this.$refs['deadline_validation'].value = this.model.validP == '' ? 'N' : this.model.validP;
      }else if(this.viewAprCom){
      this.$refs['commercial_approved'].value = this.model.comercial_approv == '' ? 'R' : this.model.comercial_approv;
      }


      console.log("Form data saved.");
    },

    getDate(menu){
      switch (menu) {
        case 1:
          this.model.fechaSeg = this.formatDate(this.date);
          break;
        case 2:         
          this.model.fechaVenc = this.formatDate(this.date2);
          break;
        default:
          break;
      }

    },

    validate() {
      var validate = this.viewFirst||this.viewUpCli ? this.$refs.formvue.validate() : true
      document.getElementById("__error").value = "SUCCESS";
      return validate;
    },
    
    fechaDelDia(Inc){
      var fechaD = new Date();
      var fechaFormatted 
      if(Inc != null){
        var fechaInc = new Date();
        fechaInc.setDate(fechaD.getDate() + Inc);
        fechaD = fechaInc;
      }
    
      // fechaFormatted = this.formatDate(fechaD.toISOString().substring(0, 10));
      
      return (fechaD)
    },

    formatDate (date) {
      if (!date) return null

      const [year, month, day] = date.split('-')
      return `${day}/${month}/${year}`
    },
    parseDate (date) {
      if (!date) return null

      const [month, day, year] = date.split('/')
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    },

    comment () {
      const time = (new Date()).toTimeString().substring(0,15) // podria ser el subtring hasta 5 , si no queremos zona horaria
      const fechaCom = this.formatDate((new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substring(0, 10))
      
      this.model.eventSeg.push({
        id: this.model.nonceSeg++,
        text: this.model.inputSeg,
        time: fechaCom + ' - ' + time + ' - ' + this.nombreUsuario,
      })

      this.model.inputSeg = null
    },

    validateItemsGanados(){

      const even = (element) => element.item_ganado === true;
      if (this.model.itemsPrincipal.some(even)){
        if(confirm('Se disparara la Generacion del Pedido de Venta en Protheus. De tener exito, la cotizacion finalizara , de lo contrario se informara en una actividad de "Captura de error". ¿Desea continuar?')){ 
          return true;
        } else {
          return false;
        }
      } else {
        if(confirm('No se ha seleccionado ningún item ganado. La cotización se cerrará ¿Desea continuar?')){ 
          return true;
        } else {
          return false;
        }
      }

      
    },

    validateButtAprob(){

      if (this.model.comercial_approv == ''){
        if(confirm('Debe indicar un estado de APROBACION mediante los BOTONES en cabecera, de lo contrario se tomara la cotizacion como "RECHAZADA" y se cerrará ¿Desea continuar?')){ 
          return true;
        } else {
          return false;
        }
      }else{
        return true;
      }
    },

    validateButtValidacion(){

      if (this.model.validP == ''){
        if(confirm('Debe indicar un estado de VALIDACION mediante los BOTONES en cabecera, de lo contrario se tomara la cotizacion como "NO VALIDADA" y se cerrará  ¿Desea continuar?')){ 
          return true;
        } else {
          return false;
        }
      }else{
        return true;
      }
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
      this.model.itemsPrincipal.push({index:this.model.itemsPrincipal.length, descripcionL:''})
    },

    deleteItem(item){
      if(confirm('¿Desea eliminar la fila seleccionada?')){    		 
        this.model.itemsPrincipal.splice(this.model.itemsPrincipal.indexOf(item), 1)
      }
    },

    copyCotiz(item){
      var numCotizActual = this.model.numcotiz;
            try {
        data = item;
        this.model = {
          ...this.model,
          ...data,
        };
        this.model.cotizAsoc = data.numcotiz;
        this.model.plazoGlobal = ''
        this.priceList = this.getLista(true,null,data.listaPrecio)
        this.model.listaPrecio = data.listaPrecio;
        this.getPaidSelect()
        this.model.numcotiz = numCotizActual;
        data = null;
        this.actualizaPrecios();
        this.dialogHistorial = false;
      } catch (e) {}
    },

    copyItem(item){
      this.model.itemsPrincipal.push({
        index:this.model.itemsPrincipal.length,
        codigo: item.codigo,
        producto: item.producto,
        descripcionL: item.descripcionL,
        url_producto: item.url_producto,
        cantidad: item.cantidad,
        plazo_entrega: item.plazo_entrega,
        precio_lista: item.precio_lista,
        precio_neto: item.precio_neto,
        desc_item: item.desc_item,
        desc_adic: item.desc_adic,
        importe: item.importe,
        mejora_plazo: item.mejora_plazo,
        item_ganado: item.item_ganado
      });

      alert("Item agregado!");    
    },


    clientSelect(cod){
      this.model.codCli = cod;
      this.getClientSelect();
      this.dialogClientes = false;

    },

    productSelect(item){
      this.Prod.producto = item.producto
      this.getProdSelect(this.Prod);
      this.dialogProductos = false;
      this.refreshItTable();
    },

    getClientSelect(){
      const clienteSel = this.clientes.find(cliente => cliente.cod === this.model.codCli);
      if(clienteSel){
        this.model.dtoCliente = clienteSel.descont;
        this.model.razSoc = clienteSel.name;
        this.model.CUITCli = clienteSel.cuit;
        this.model.lojaCli = clienteSel.loja;
        this.model.CodEstCli = clienteSel.estado;
        this.model.EstCli = clienteSel.provincia;
        this.model.DirCli = clienteSel.direccion;
        this.model.codPago = clienteSel.condicion;
        this.initCond(clienteSel.condicion);
        this.model.codVendedor = clienteSel.codVend;
        this.initVend(clienteSel.codVend);
        this.priceList = this.getLista(true,null,clienteSel.lista);
        this.model.listaPrecio = clienteSel.lista;
        this.refreshPrecio();
        this.viewTrigger = true;
        if (clienteSel.estado === 'EX') {
          this.model.tipoCotiz = 'Comex';
        } else {
          this.model.tipoCotiz = 'Nacional';
        }
      }else{
        this.model.razSoc = '';
        this.model.CUITCli = '';
        this.model.lojaCli = '';
        this.model.CodEstCli = '';
        this.model.EstCli = '';
        this.model.DirCli = '';
        this.model.metodoPago = '';
        this.model.codPago = '';
        this.model.codVendedor = '';
        this.model.listaPrecio = '';
        this.viewTrigger = false;
      }
    },
    
    getPaidSelect(){
      const paidSel = this.paidmetods.find(paid => paid.desc === this.model.metodoPago);
      if(paidSel){
        this.model.codPago = paidSel.cod;
      }else{
        this.model.codPago = '';
      }
    },

    getSellerSelect(){
      const SellSel = this.sellers.find(seller => seller.name === this.model.vendedor);
      if(SellSel){
        this.model.codVendedor = SellSel.cod;
      }else{
        this.model.codVendedor = '';
      }
    },

    getMonedaSelect(){
      const monedaSel = this.monedas.find(moneda => moneda.desc === this.model.moneda);
      if(monedaSel){
        this.model.codMoeda = monedaSel.cod;
        this.model.abrevMoe = monedaSel.abrev;
        this.priceList = this.getLista(true,parseInt(this.model.codMoeda).toString());
      }else{
        this.model.codMoeda = '';
        this.model.abrevMoe = '';
      }
    },

    getProdSelect(item){
      //console.log(item);
      //this.model.itemsPrincipal[this.currentIndex]["codigo"] = item.codigo;
      //vm.$forceUpdate();
      var retLista = [];
      const prodSel = this.productos.find(producto => producto.producto === item.producto);
      if(item.mejora_plazo){
        item.mejora_plazo = true;
      }else{
        item.mejora_plazo = false;
      }

      if(prodSel){
        retLista = this.getPrecioLista(prodSel.codigo.trim(), this.model.listaPrecio);
        item.codigo       = prodSel.codigo;
        item.descripcionL = prodSel.descripcionL;
        item.precio_lista = retLista[0];
        // item.cantidad     = 1;
        item.plazo_entrega= prodSel.plazo;
        item.desc_item    = retLista[1]; // aca iria el campo de descuento obtenido desde la api de productos
        // item.desc_adic    = '0'; // se inicializa en este valor 
        this.totalCalc(item);
        
      }else{
        item.codigo       ='';
        item.descripcionL ='';
        item.precio_lista ='';
        item.cantidad     ='';
        item.desc_item    ='';
        item.desc_adic    ='';
        item.precio_neto  ='';
        item.importe      ='';
      }
    },

    actualizaPrecios(){
      //var arrPrcAct = [];
      var codigo = "";
      //var bool = false;
      var precio_lista = "";
      var discont = "";
      var retLista = [] ;
      // const even = (element) => element.actualiza === true;
      for (var i = 0; i < this.model.itemsPrincipal.length; i++){
        //bool = false;
        const prodSel = this.productos.find(producto => producto.producto === this.model.itemsPrincipal[i].producto);
        if(prodSel){
          retLista = this.getPrecioLista(prodSel.codigo.trim(), this.model.listaPrecio);
          codigo        = prodSel.codigo;
          precio_lista  = retLista[0];
          discont  = retLista[1];
          if (this.model.itemsPrincipal[i].precio_lista != precio_lista){
            this.model.itemsPrincipal[i].precio_lista = precio_lista;
            this.totalCalc(this.model.itemsPrincipal[i]);
            //bool = true;
          }
          //arrPrcAct.push({actualiza: bool, vjoPrc: this.model.itemsPrincipal[i].precio_lista, nvoPrc: precio_lista});
        }
      }
      
      // if (arrPrcAct.some(even)){
        //   if(confirm('Existen variaciones en los precios ¿Desea actualizarlos?')){    		 
                    //     if (this.model.itemsPrincipal.length === arrPrcAct.length) {   
            //       this.model.itemsPrincipal.forEach((item1, index) => {       
              //         item1.precio_lista    = arrPrcAct[index].nvoPrc;   
              //         this.totalCalc(item1);
            //       }); 
          //     } 
      //   } else {
          //     this.model.itemsPrincipal.forEach((item1, index) => {         
            //       item1.precio_vencido  = arrPrcAct[index].actualiza; 
            //       vm.$forceUpdate();  
          //     });
        //   }
      // }
    },

    totalCalc(item){
      item.precio_neto  = (item.desc_adic)? getDiscont(item.desc_item, item.desc_adic, item.precio_lista) : getDiscont(item.desc_item, '0', item.precio_lista);
      item.importe      = (item.cantidad)? getTotal( item.precio_neto, item.cantidad) :0 ;
      this.refreshItTable();
    },
    
    refreshItTable(){
      this.model.itemsPrincipal.push({});
      this.model.itemsPrincipal.pop();
      vm.$forceUpdate();
    },

    refreshPrecio(){

      const listaSel = this.priceList.find(lista => lista.cod_lista === this.model.listaPrecio);

      if(listaSel){
        this.initMoed(listaSel.moneda)
      }

      if(this.model.itemsPrincipal.length > 0)  
        for(var i=0 ; i< this.model.itemsPrincipal.length; i++){
        
          this.getProdSelect(this.model.itemsPrincipal[i])
        
        }

    },

    sumSubTotal(value1, value2){
      var total = this.model.itemsPrincipal.reduce((acc, d) => acc += (parseFloat(d[value1]*d[value2]) || 0), 0);
      return total.toFixed(2).toLocaleString('es-ES', { minimumFractionDigits: 2 }) + ' ' +  this.model.abrevMoe;
      //return total.toString() + ' ' +  this.model.abrevMoe;
          },

    sumTotal(value){
      var nDiscCli = this.model.dtoCliente == '' ? 0 : this.model.dtoCliente;
      var nDiscAdd = this.model.dtoAdicional == '' ? 0 : this.model.dtoAdicional;
      var total = this.model.itemsPrincipal.reduce((acc, d) => acc += (parseFloat(d[value]) || 0), 0);
      //this.model.totalItems = Math.round(getDiscont(nDiscCli, nDiscAdd, total));
      this.model.totalItems = getDiscont(nDiscCli, nDiscAdd, total);
      return this.model.totalItems.toLocaleString('es-ES', { minimumFractionDigits: 2 }) + ' ' + this.model.abrevMoe;
      //return this.model.totalItems.toString() + ' ' + this.model.abrevMoe;
    },

    searchFilter(item, search) {
      return Object.values(item[1]).some(value => this.includesSearch(value, search));
    },

    includesSearch(value, search) {
      return String(value).toLowerCase().includes(search);
    },

     initMoed(codM,abrevM){
        var monedaSel 

        if(codM){
          monedaSel = this.monedas.find(moneda => parseInt(moneda.cod) === codM);
        }else if(abrevM){
          monedaSel = this.monedas.find(moneda => moneda.abrev === abrevM);
        }

        if(monedaSel){
          this.model.codMoeda = monedaSel.cod;
          this.model.abrevMoe = monedaSel.abrev;
          this.model.moneda = monedaSel.desc;
        }else{
          this.model.codMoeda = '';
          this.model.abrevMoe = '';
          this.model.moneda = '';
      }
     },

     initCond(codP){
        const metodoSel = this.paidmetods.find(metodo => metodo.cod === codP);

        if(metodoSel){
          this.model.metodoPago = metodoSel.desc;
        }else{
          this.model.metodoPago = '';
        }
     },

     initVend(codV){
        const SellerSel = this.sellers.find(seller => seller.cod === codV);

        if(SellerSel){
          this.model.vendedor = SellerSel.name;
        }else{
          this.model.vendedor = '';
        }
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

    validaCantidad(item){
      const cantidad = item.cantidad;
      
      if(!this.viewMode){

        if (cantidad != undefined){
            // Verificar si el valor está vacío
            if (cantidad === null || cantidad.trim() === '') {
            return true; // Valor vacío permitido
          }
          const value = parseInt(cantidad);
          const prodSel = this.productos.find(producto => producto.producto === item.producto);
          
          if(value <= parseInt(prodSel.stock)){
            if(value <= parseInt(prodSel.moq)){
              return true
            } else {
              return false || "El valor indicado supera el moq disponible.";
            }
          } else {
            return false || "El valor indicado supera el stock disponible.";
          }
        };
      }else{
        return true
      };

    },


      refreshPlazo(value){
        const validation = this.validaPlazos(value)
        if(validation === true && !(value === null || value.trim() === '')){
            // Se procede a reemplazar los plazos de entrega de los items con el nuevo valor global
            this.model.itemsPrincipal.forEach(item => {
              item.plazo_entrega = value.trim();
            });
            vm.$forceUpdate();
        }else{
          console.error('Error: ' , validation);
        }
      },

      setValidPlazo(estado) {
      	this.model.validP = estado
      },
      
      setComercialApproved(estado) {
      	this.model.comercial_approv = estado
},

			getAllDataSelect(firstCharge){
				this.clientes= this.getClientes(firstCharge);
				this.sellers= this.getSellers(firstCharge);
				this.monedas= this.getMonedas(firstCharge);
        if (firstCharge){
          this.initMoed(null,'USD');
          this.model.user_cotiz = this.nombreUsuario;
        }
				this.paidmetods= this.getPaidMethod(firstCharge);
				this.productos= this.getProducts(firstCharge);
				this.priceList= this.getLista(firstCharge,parseInt(this.model.codMoeda).toString());
				vm.$forceUpdate(); 
			},
			
			getClientes(firstCharge,idCliente) {
				var constraints = []
				var clientesResult = []
				
				if(firstCharge){
					if (idCliente){
						constraints.push(DatasetFactory.createConstraint('searchKey', idCliente, idCliente, ConstraintType.MUST));
					}
					constraints.push(DatasetFactory.createConstraint('pageSize', "10000", "10000", ConstraintType.MUST));
			
					var clientes = DatasetFactory.getDataset("clientes_Protheus", null, constraints, null);
							for (var j = 0; j < clientes.values.length; j++) {
									clientesResult.push({ name: clientes.values[j]['name'], cod: clientes.values[j]['id'],cuit: clientes.values[j]['cuit'],estado: clientes.values[j]['estado'], descont: clientes.values[j]['descont'], loja: clientes.values[j]['branch'], direccion: clientes.values[j]['address'], condicion:clientes.values[j]['condicion'], lista:clientes.values[j]['lista'], codVend:clientes.values[j]['codVend'], provincia:clientes.values[j]['provincia']})
					}
				}else{
					clientesResult.push({name: this.model.razSoc, cod: this.model.codCli})
				}
			
				return clientesResult
			},

			getSellers(firstCharge,idSeller) {
				var constraints = []
				var sellersResult = []
				
				if(firstCharge){
					if (idSeller){
						constraints.push(DatasetFactory.createConstraint('searchKey', idSeller, idSeller, ConstraintType.MUST));
					}
					constraints.push(DatasetFactory.createConstraint('pageSize', "10000", "10000", ConstraintType.MUST));
				
					var sellers = DatasetFactory.getDataset("vendedores_Protheus", null, constraints, null);
							for (var j = 0; j < sellers.values.length; j++) {
								sellersResult.push({ name: sellers.values[j]['name'], cod: sellers.values[j]['cod'] })
					}
				}else{
					sellersResult.push({name: this.model.vendedor, cod: this.model.codVendedor})
				}
				return sellersResult
			},
			
			
			getMonedas(firstCharge,idMoneda) {
				var constraints = []
				var monedasResult = []

				if(firstCharge){	
					if (idMoneda){
						constraints.push(DatasetFactory.createConstraint('searchKey', idMoneda, idMoneda, ConstraintType.MUST));
					}
					constraints.push(DatasetFactory.createConstraint('pageSize', "1000", "1000", ConstraintType.MUST));
				
					var monedas = DatasetFactory.getDataset("monedas_Protheus", null, constraints, null);
							for (var j = 0; j < monedas.values.length; j++) {
								monedasResult.push({ cod: monedas.values[j]['cod'], desc: monedas.values[j]['description'],symb: monedas.values[j]['symb'], desc2:monedas.values[j]['symb'] + ' - ' + monedas.values[j]['description'],abrev: monedas.values[j]['abrev']})
					}
				}else{
					monedasResult.push({desc: this.model.moneda})
				}

			
				return monedasResult
			},
			
			
			getPaidMethod(firstCharge,idMethod) {
				var constraints = []
				var methodsResult = []

				if(firstCharge){
					if (idMethod){
						constraints.push(DatasetFactory.createConstraint('searchKey', idMethod, idMethod, ConstraintType.MUST));
					}
					constraints.push(DatasetFactory.createConstraint('pageSize', "1000", "1000", ConstraintType.MUST));
				
					var paidmethods = DatasetFactory.getDataset("metodosDePago_Protheus", null, constraints, null);
							for (var j = 0; j < paidmethods.values.length; j++) {
								methodsResult.push({ cod: paidmethods.values[j]['cod'], desc: paidmethods.values[j]['description'],cond: paidmethods.values[j]['condition'] })
					}
				}else{
					methodsResult.push({desc:this.model.metodoPago})
				}
			
				return methodsResult
			},
			
			
			getProducts(firstCharge,idProd) {
				var constraints = []
				var productsResult = []
				
				if(firstCharge){
					if (idProd){
						constraints.push(DatasetFactory.createConstraint('searchKey', idProd, idProd, ConstraintType.MUST));
					}
					constraints.push(DatasetFactory.createConstraint('pageSize', "10000", "10000", ConstraintType.MUST));
				
					var productos = DatasetFactory.getDataset("productos_Protheus", null, constraints, null);
							for (var j = 0; j < productos.values.length; j++) {
								productsResult.push({ codigo: productos.values[j]['codigo'], producto: productos.values[j]['descripcion'],grupo: productos.values[j]['grupo'], plazo:productos.values[j]['plazo'], moq:productos.values[j]['moq'], stock:'5', descripcionL:productos.values[j]['descripcionL']})//TODO CONTROLAR STOCK HARDCODEADO, VER TEMA DE RESERVAS BLANDAS
					}
				}else{
					this.model.itemsPrincipal.forEach((item) => {      
						productsResult.push({codigo: item.codigo, producto: item.producto, grupo:'', stock:'5', moq:'' })
					});
				}

				return productsResult
			},
			
			getLista(firstCharge,moneda,idLista,idProd, nlimit) {
				var constraints = []
				var pricelistResult = []

				if(firstCharge){
					if (idLista){
						constraints.push(DatasetFactory.createConstraint('lista', idLista, idLista, ConstraintType.MUST));
					}
          if (moneda){
            constraints.push(DatasetFactory.createConstraint('moneda', moneda, moneda, ConstraintType.MUST));
          }
					if (idProd){
						constraints.push(DatasetFactory.createConstraint('searchKey', idProd, idProd, ConstraintType.MUST));
					}
					if (nlimit){
						constraints.push(DatasetFactory.createConstraint('sqlLimit', nlimit, nlimit, ConstraintType.MUST));
					}else{
						constraints.push(DatasetFactory.createConstraint('pageSize', "1000", "1000", ConstraintType.MUST));
					}
				
				
					var pricelist = DatasetFactory.getDataset("listaPrecios_Protheus", null, constraints, null);
							for (var j = 0; j < pricelist.values.length; j++) {
                pricelistResult.push({ codpro: pricelist.values[j]['codpro'], cod_lista: pricelist.values[j]['cod_lista'],prcven: pricelist.values[j]['prcven'],discont: pricelist.values[j]['discont'], moneda: pricelist.values[j]['moneda'] })
					    }
				}else{
					pricelistResult.push({cod_lista:this.model.listaPrecio})

				}
			
				return pricelistResult
			},

			getPrecioLista(idProd, idLista){
				var lista = this.getLista(true,parseInt(this.model.codMoeda).toString(),idLista,idProd, "10")
				var retPrecio = 0
        var retDiscont = '0'
        
				if (lista.length > 0) {
					if (lista[0].prcven != ''){
						retPrecio= lista[0].prcven.toFixed(2); //pasa a string con dos decimales el precio obtenido
					}
					if (lista[0].discont != ''){
						retDiscont= lista[0].discont.toFixed(0); //pasa a string con cero decimales el descuento obtenido
					}
          
				} 
				return [retPrecio,retDiscont]
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

    openCloseDialog(open){
          this.dialogHistorial = open;
          //vm.$forceUpdate();
    },

    openCloseDialogCli(open){
      this.dialogClientes = open;
      //vm.$forceUpdate();
    },

    openCloseDialogProd(open, item){
      this.Prod = item;
      this.dialogProductos = open;
      //vm.$forceUpdate();
    },

    refreshClientes(firstCharge){
      this.clientes= this.getClientes(firstCharge);
      vm.$forceUpdate();
    },

    imprimir() {
      const vm = this
      $("#btnExportarPdf").trigger("click")
    },

  },
});


function getDiscont( nDiscItem, nDiscAdd, nPrecioLista) {

  var desc      = parseInt(nDiscItem) + parseInt(nDiscAdd)
  nPrecioLista  = parseFloat(nPrecioLista)

  return (nPrecioLista - nPrecioLista * desc / 100).toFixed(2)
};


function getTotal( nPrecioNeto, nCantidad) {
  
  nPrecioNeto = parseFloat(nPrecioNeto)
  nCantidad   = parseInt(nCantidad)
  
  return (nPrecioNeto * nCantidad).toFixed(2);
};



function getCotiz() {
  var valorActual = 0;
  var valorNuevo = 0;
  var valorNuevoComp = '';
var numCotizMax = DatasetFactory.getDataset("dsTestMaxNumCotiz", null, null, null);

  if (numCotizMax.values[0].NumCotizMax != null){
    valorActual= parseInt(numCotizMax.values[0].NumCotizMax);
      } 
  
  valorNuevo = valorActual + 1 ;

  valorNuevoComp = formatNumber(valorNuevo, 6);

  return valorNuevoComp;
};


var beforeSendValidate = function (numState, nextState) {
  return vm.save();
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
};

$("#btnExportarPdf").totreport({
  "templateUrl": "/static/totvs-templates/DelgaTemplate.html",
  "log": 1,
  "generateData": function () {
    console.log("entro a la funcion de impresion")
    var productos = [];
    var rowCount = vm.model.itemsPrincipal.length;
    var idFluig = document.getElementById("requestId").value;
    for (var i = 0; i < rowCount  ; i++) {
      if (vm.model.itemsPrincipal[i]){
        
        productos.push({
          id: vm.model.itemsPrincipal[i].codigo ,
          descripcionProducto: vm.model.itemsPrincipal[i].producto,
          descripcionLarga: vm.model.itemsPrincipal[i].descripcionL,
          cantidad: parseInt(vm.model.itemsPrincipal[i].cantidad),
          precioVenta: parseFloat(vm.model.itemsPrincipal[i].precio_neto),
          precioUnitario: parseFloat(vm.model.itemsPrincipal[i].precio_lista),
          descuento: parseInt(vm.model.itemsPrincipal[i].desc_item),
          descuentoAdd: parseInt(vm.model.itemsPrincipal[i].desc_adic),
          precioTotal: parseFloat(vm.model.itemsPrincipal[i].importe),
        });
      };
    }
    var datos = {
      "numeroCotizacion": vm.model.numcotiz,
      "fecha": vm.model.fecha,
      "cliente": vm.model.razSoc.trim(),
      "cuit": vm.model.CUITCli == '' ? ' - ' : vm.model.CUITCli,
      "empresa": "empresa",
      "direccion": vm.model.DirCli,
      "tel": vm.model.adic_phonecontact == '' ? ' - ' : vm.model.adic_phonecontact ,
      "mail": vm.model.adic_emailcontact == '' ? ' - ' : vm.model.adic_emailcontact,
      "idFluig": idFluig == '' ? ' - ' : idFluig,
      "tipoCotiz": vm.model.tipoCotiz,
      "discontCli": vm.model.dtoCliente == '' ? ' - ' : vm.model.dtoCliente,
      "discontAdd": vm.model.dtoAdicional == '' ? ' - ' : vm.model.dtoAdicional,
      "precioTotal": vm.model.totalItems,
      "condicionPago": vm.model.metodoPago,
      "moneda": vm.model.moneda,
      "fechaVigencia": vm.model.fechaVenc == '' ? ' - ' : vm.model.fechaVenc,
      "emitidoPor": vm.model.codVendedor == '' ? ' - ' : vm.model.codVendedor,
      "productos": productos
    };
    return JSON.stringify(datos);
  },
  "generateFileName": function () { 
    var currentDate = new Date();
    var formattedDate = currentDate.getFullYear() + ('0' + (currentDate.getMonth() + 1)).slice(-2) + ('0' + currentDate.getDate()).slice(-2);
    var numCotizacion = vm.model.numcotiz;

    return "Cotizacion_"+ numCotizacion + "_" + formattedDate + ".pdf"; },
});