window.parent.$("#tab-attachments").hide();
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
      dialogInfoAtajos: false,
      Prod: {},
      currentIndex: null,
      date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substring(0, 10),
      date2: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substring(0, 10),
      dateFormatted: this.formatDate((new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substring(0, 10)),
      minDate:this.fechaDelDia().toISOString().substring(0, 10),
      menu2: false,
      menu3: false,
      viewMode: true,
      viewFirst: false,
      viewTrigger: false,
      viewComplej: false,
      viewPlazo: false,
      viewConfir:false,
      viewSeg:false,
      viewSnSeg:false,
      viewValP:false,
      viewItGan:false,
      viewAprCom:false,
      viewAprAdm:false,
      viewNewCli:false,
      viewUpCli:false,
      viewErro:false,
      viewGenPed: false,
      viewAlerts: false,
      viewNoCalcula: false,
      messageAlert: "",
      stockDisp: false,
      stateItGan:0,
      stateRev:0,
      charge:false,
      procesoFinalizado: false,
      marcdesmarc:false,
      nombremd:'Marcar',
      linfo: true,
      WKNumState: 0,
      md: "2",
      mdRow2: "4",
      WKDef: "",
      search: "",
      model: {
        eventSeg: [],
        inputSeg: null,
        nonceSeg: 0,
        itemsPrincipal: [],
        numcotiz: getCotiz(),
        revision: 0,
        lRev: false,
        fecha: fechaFormulario.innerHTML    == '' ? this.formatDate(this.fechaDelDia().toISOString().substring(0, 10)) : fechaFormulario.innerHTML,
        fechaSeg: fechaFormulario.innerHTML == '' ? this.formatDate(this.fechaDelDia(7).toISOString().substring(0, 10)) : fechaFormulario.innerHTML,
        plazoSeg:'7',
        fechaVenc: '',
        fechaStr:'',
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
        admin_approv: '',
        validP: '',
        responsable_venta:'',
        lojaCli:'',
        codPago:'',
        codPais_comex:'',
        cod_trans: '',
        obsFact:'',
        obsInt:'',
        obsDesp:'',
        name_trans:'',
        codMoeda:'',
        comex_flete: '',
        comex_incoterms: '',
        comex_valfleteloc: '',
        comex_valfleteint: '',
        comex_valseg: '',
        comex_valfob: '',
        abrevMoe:'USD',
        moneda:'DOLARES',
        monfat:'',
        anticipo:false,
        erroIntegracion:'',
        adic_plazoValidez:'10',
        contactAdmin_tlf:'',
        contactAdmin_em:'',
        contactInspecc_tlf:'',
        contactInspecc_em:'',
        user_cotiz: '',
        refCli:'',
        cantSug:'',
        OcClient:'',
        ofTecnica: false,
        borrador: false,
        idCrm: '',
        comex_peso: 0,
        comex_vol: 0,
        calc_pes_vol: false,
        infoAdEC: false,
      },
      priceListError:'',
      clientes: [],
      sellers: [],
      carriers: [],
      contactos: [],
      monedas: [],
      paidmetods: [],
      paises: [],
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
        { text: 'Codigo', align: 'center', value: 'codigo', type: 'input', width: '10rem', sortable: false, disabled: true },
        { text: 'Item Cotiz', align: 'center', value: 'item_cotiz', type: 'input', width: '5rem', inputType: 'text', sortable: false, disabled:this.viewMode },
        { text: 'Item OC', align: 'center', value: 'item', type: 'input', width: '5rem', inputType: 'text', sortable: false, disabled:this.viewMode },
        { text: 'Producto', align: 'center', value: 'producto', type: 'input', width: '22rem', inputType: 'text', sortable: false, disabled:this.viewMode },
        // { text: 'URL producto', align: 'center', value: 'url_producto', type: 'input', width: '12rem', inputType: 'text', sortable: false, disabled: true },
        { text: 'Cantidad', align: 'center', value: 'cantidad', type: 'input', width: '5rem', inputType: 'text', sortable: false, disabled:this.viewMode },
        { text: 'Plazo de entrega', align: 'center', value: 'plazo_entrega', type: 'input', width: '8rem', inputType: 'text', sortable: false, disabled:true },
              //{ text: 'Ncm', align: 'center', value: 'ncm', type: 'input', width: '6rem', inputType: 'text', sortable: false, disabled: true, show:!this.viewPlazo},
        { text: 'Precio de lista', align: 'center', value: 'precio_lista', type: 'input', width: '6rem', inputType: 'text', sortable: false, disabled: true , show:!this.viewPlazo},
        { text: 'Precio neto', align: 'center', value: 'precio_neto', type: 'input', width: '6rem', inputType: 'text', sortable: false, disabled: true , show:!this.viewPlazo},
        { text: 'Descuento item', align: 'center', value: 'desc_item', type: 'input', width: '2rem', inputType: 'text', sortable: false, disabled: true , show:!this.viewPlazo},
        { text: 'Descuento adicional', align: 'center', value: 'desc_adic', type: 'input', width: '2rem', inputType: 'text', sortable: false, disabled:this.viewMode , show:!this.viewPlazo},
        { text: 'Importe', align: 'center', value: 'importe',type: 'input', width: '5rem', inputType: 'text', sortable: false, disabled: true , show:!this.viewPlazo},
        { text: 'Mejora plazo entrega', align: 'center', value: 'mejora_plazo', type: 'checkbox', width: '3rem', sortable: false, disabled:this.viewMode, show:true},
              { text: 'Hab. stock actual', align: 'center', value: 'hab_stock', type: 'checkbox', width: '4rem', sortable: false, disabled:!this.viewPlazo , show:!this.viewFirst },              
        { text: 'Item Ganado', align: 'center', value: 'item_ganado', type: 'checkbox', width: '3rem', sortable: false, disabled:!this.viewSnSeg&&!this.viewSeg&&!this.viewGenPed , show:!this.viewFirst&&!this.viewPlazo&&!this.viewAprAdm&&!this.viewConfir&&!this.viewComplej },    
        { text: 'Sin Stock', align: 'center', value: 'sin_stock', type: 'checkbox', width: '3rem', sortable: false, disabled:!this.viewGenPed , show:this.viewGenPed },        
        { text: '', align: 'center', value: 'deleteRow', type: 'icon', width: '2rem', sortable: false, disabled:this.viewMode},
      ]

        
      if(this.viewFirst||this.viewPlazo||this.viewAprAdm||this.viewConfir){
        const itemGanadoIndex = head.findIndex(header => header.value === 'item_ganado');
       

        if (itemGanadoIndex !== -1) {
          // Modificar la propiedad 'text' del objeto "Item  Ganado"
          head[itemGanadoIndex].text = '';
        }
      }

      if(this.viewComplej){
        const itemGanadoIndex = head.findIndex(header => header.value === 'item_ganado');
        if (itemGanadoIndex !== -1) {
          head[itemGanadoIndex].width = '0rem';
        };

      }

      if(this.viewFirst){
        const habStock = head.findIndex(header => header.value === 'hab_stock');
        const itemGanadoIndex = head.findIndex(header => header.value === 'item_ganado');
        const stock = head.findIndex(header => header.value === 'sin_stock');

        if (habStock !== -1) {
          head[habStock].text = '';
          head[habStock].width = '0rem';
        };
        if (itemGanadoIndex !== -1) {
          head[itemGanadoIndex].width = '0rem';
        };
        if (stock !== -1) {
          head[stock].width = '0rem';
        };
      }

      if(this.viewPlazo){
        const itemPrecioLista = head.findIndex(header => header.value === 'precio_lista');
        const itemPrecioNeto  = head.findIndex(header => header.value === 'precio_neto');
        const itemDescItem    = head.findIndex(header => header.value === 'desc_item');
        const itemDescAd      = head.findIndex(header => header.value === 'desc_adic');
        const itemImporte     = head.findIndex(header => header.value === 'importe');

        if (itemPrecioLista !== -1) {
          head[itemPrecioLista].text = '';
          head[itemPrecioLista].width = '0rem';
        };
        if (itemPrecioNeto !== -1) {
          head[itemPrecioNeto].text = '';
            head[itemPrecioNeto].width = '0rem';
        };
        if (itemDescItem !== -1) {
          head[itemDescItem].text = '';
              head[itemDescItem].width = '0rem';
        };
        if (itemDescAd !== -1) {
          head[itemDescAd].text = '';
                head[itemDescAd].width = '0rem';
        };
        if (itemImporte !== -1) {
          head[itemImporte].text = '';
                  head[itemImporte].width = '0rem';
        }
      }
      
      if(!this.viewGenPed){  
        const stock = head.findIndex(header => header.value === 'sin_stock');

        if (stock !== -1) {
          head[stock].text = '';
        }
      }

      if(this.viewSeg){
        const habStock = head.findIndex(header => header.value === 'hab_stock');
        if (habStock !== -1) {
          head[habStock].width = '0rem';
        };
      }


      return  head;
    },
    
    tipoEntrega(){
      return [
        {cod:'2' ,value:'Total'},
        {cod:'1' ,value:'Parcial'},

      ]
    },

    FormaEntrega(){
      return [
        {cod:'1' ,value:'Planta'},
        {cod:'2' ,value:'SDR'},
        {cod:'3' ,value:'Expreso'},
        {cod:'4' ,value:'Sucursal'},
        {cod:'5' ,value:'Otros'},

      ]
    },
    
    TipoFlete(){
      return [
        {cod:'C' ,value:'CIF'},
        {cod:'F' ,value:'FOB'},
        {cod:'T' ,value:'Por cta terceros'},
        {cod:'S' ,value:'Sin flete'},
      ]
    },
    
    MedioTransp(){
      return [
        {cod:'1' ,value:'AEREO'},
        {cod:'2' ,value:'MARITIMO'},
        {cod:'3' ,value:'TERRESTRE'}
      ]
    },
    
    Incoterms(){
      return [
        {cod:'CFR' ,value:'CFR- COST AND FREIGHT'},
        {cod:'CPT' ,value:'CPT- CARRIAGE PAID TO'},
        {cod:'CIP' ,value:'CIP- CARRIAGE AND INSURANCE PAID TO'},
        {cod:'FCA' ,value:'FCA- FREE CARRIER'},
        {cod:'FAS' ,value:'FAS- FREE ALONG SIDE SHIP'},
        {cod:'FOB' ,value:'FOB- FREE ON BOARD'},
        {cod:'C+I' ,value:'C+I- COST PLUS INSURANCE'},
        {cod:'EXW' ,value:'EXW- EX WORKS'},
        {cod:'DAF' ,value:'DAF- DELIVERED AT FRONTIER'},
        {cod:'DES' ,value:'DES- DELIVERED EX SHIP'},
        {cod:'DEQ' ,value:'DEQ- DELIVERED EX QUAY (DUTY PAID)'},
        {cod:'DDU' ,value:'DDU- DELIVERED EX QUAY (DUTY PAID)'},
        {cod:'DDP' ,value:'DDP- DELIVERED DUTY PAID'},
        {cod:'CIF' ,value:'CIF- COST, INSURANCE AND FREIGHT'},
        {cod:'RFD' ,value:'RFD- REGULATED'},
        {cod:'INI' ,value:'INI- INCOTERM NAO IDENTIFICADO'},
        {cod:'OCV' ,value:'OCV- OUTRAS CONDICOES DE VENDA'},
        {cod:'C+F' ,value:'C+F- COST PLUS FREIGHT'},
      ]
    },

    

    TransMod() {
      return this.carriers.map(carrier => ({
        ...carrier,
        claveTrans: `${carrier.cod} - ${carrier.name}`
      }));
    },

    sellersMod() {
      return this.sellers.map(seller => ({
        ...seller,
        claveSellers: this.WKNumState == 0 ? `${seller.name} - ${seller.cod}` : `${seller.name}`
      }));
    },
    
    paidmetodsMod() {
      return this.paidmetods.map(method => ({
        ...method,
        claveMethods: this.WKNumState == 0 ? `${method.cod} - ${method.desc}` : `${method.desc}`
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
      this.stateRev = 70;
      this.stateItGan = 72;
      switch (this.WKNumState) {
				case 0:
          this.charge = true;
          this.viewFirst = true;
					break;
        case 127:
          this.viewMode = true;  //VISTA ESPECIALES COMPLEJOS
          this.viewComplej = true;
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
        case 94:                //VISTA SIN SEGUIMIENTO
          this.viewMode = true;
          this.viewSnSeg = true;
          break;
        case 25:                //VISTA ACEPTA DENTRO DE VIGENCIA
          this.viewMode = true;
          break;
        case 23:                //VISTA VALIDA PLAZOS Y PRECIOS
          this.viewMode = true;
          this.viewValP = true;
          break;
          case 24:                //VISTA APROBACION COMERCIAL
          this.viewMode = true;
          this.viewAprCom = true;
          break;
          case 110:                //VISTA APROBACION ADMINISTRACION
          this.viewMode = true;
          this.viewAprAdm = true;
          break;
          case 27:                //VISTA CARGA INICIAL CLIENTE
          this.viewMode = true;
          this.viewNewCli = true;
          break;
          case 28:                //VISTA FINALIZACION CARGA CLIENTE
          this.viewMode = true;
          this.viewUpCli = true;
          this.charge = true;
          this.md = "1";
          break;
          case 30:                //VISTA CARGAS VARIAS EN PROTHEUS
          this.viewMode = true;
          break;
          case 48:                //VISTA GENERACION DE PEDIDO DE VENTA
          this.viewMode = true;
          this.viewGenPed = true;
          this.charge = true;
          break;
          case 54:                //ACCION DE CAPTURA DE ERROR INTEGRACION
          this.viewMode = true;
          this.viewErro = true;
          break;
          default:
            this.viewMode = true;
            
      }
      this.getAllDataSelect(this.charge);
      if(this.viewGenPed){
        this.validaStockyPlazo();
      }

      // if(this.viewPlazo||this.viewComplej){
      //   this.cargaProductos();
      // }
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

    save(numState, nextState) {

      if(this.viewFirst){
        if (!this.validateItems()){ // Valida items que estén 'En Stock' y sin mejora plazo; y que haya al menos un item cargado
          return false; //poner falso de retorno
        }
      }
    
      if (!this.validate()) {
        alert("Algunos campos obligatorios no se rellenaron o se encuentran vacíos");
        return false; //poner falso de retorno
      }

      
      if(this.viewSeg||this.viewSnSeg){
        if (!this.validateItemsGanados(numState, nextState)) {
          return false; //poner falso de retorno
        }
      }
      
      if(this.viewGenPed){
        if (!this.validateAdjudicacion(numState, nextState)) {
          return false; //poner falso de retorno
        }
      }

      if(this.viewValP){
        if (!this.validateButtValidacion()) {
          return false; //poner falso de retorno
        }
      }

      if(this.viewAprCom||this.viewAprAdm){
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
      }else if(this.viewAprAdm){
        this.$refs['admin_approved'].value = this.model.admin_approv == '' ? 'R' : this.model.admin_approv;
      }


      console.log("Form data saved.");
    },

    getDate(menu){
      switch (menu) {
        case 1:
          this.model.fechaSeg = this.formatDate(this.date);
          this.getPlazoSegSelect(this.date,this.model.fecha)
          break;
        case 2:         
          this.model.fechaVenc = this.formatDate(this.date2);
          break;
        default:
          break;
      }

    },

    ContactsMod(grupo){
      contactsMod = this.getContactos(true, this.model.codCli.trim()+this.model.lojaCli.trim(),grupo);
      return contactsMod
    },


    validate() {
      var validate = this.viewFirst||this.viewUpCli||this.viewGenPed ? this.$refs.formvue.validate() : true;
      document.getElementById("__error").value = "SUCCESS";
      return validate;
    },
    
    fechaDelDia(Inc,fechaD){
      var fechaFormatted 
      var fechaD = new Date();
      if(fechaD == undefined){
        fechaD = new Date();
      }
            
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

    pagAnticip(){
      if (this.viewGenPed && (this.model.metodoPago.toUpperCase().includes("ANT"))){
        mdRow2 = "3";
        this.model.anticipo = true;
        return true
      }else{
        this.model.anticipo = false;
        this.model.contactAdmin='';
        return false
      }
    },

    validateMoneda(){
      if (this.model.itemsPrincipal.length > 0){
        alert("No se puede modificar la moneda de cotización ya que hay items cargados");
        return false;
      } else {
        return true;
      }
    },

    validateItems(){
      if(this.model.itemsPrincipal.length>0){
        for (let i = 0; i < this.model.itemsPrincipal.length; ++i) {
          if(this.model.itemsPrincipal[i].plazo_entrega == 'En Stock' && this.model.itemsPrincipal[i].mejora_plazo){
            this.model.itemsPrincipal[i].mejora_plazo = false;
          }
        }
        return true;
      }else{
        alert("La cotizacion debe tener al menos un item cargado");
        return false;
      }
    },


    cargaProductos(){ 
      this.productos = [];
      this.productos = this.getProducts(true); 
    },


    compruebaStock(item){
      if(this.viewPlazo){
        if(this.productos.length === 0){
          this.cargaProductos()
        }
      }

      if(!this.viewMode || this.viewPlazo|| this.viewComplej&&item.es_complejo){
        const cantidad = item.cantidad;
        if (cantidad != undefined){
          // Verificar si el valor está vacío
          if (cantidad === null || cantidad.trim() === '') {
            return true; // Valor vacío permitido
          }

            const prodSel = this.productos.find(producto => producto.descripcionL === item.producto && producto.codigo.trim() === item.codigo.trim());  
                              
          
            return "- STOCK DISPONIBLE: " + prodSel.stock + "\n\n - MOQ DISPONIBLE: " + prodSel.moq;
          
        } else {
          return ''
          }
      }
    },

    cantidadSugerida(item){
      var conv 
      if(item.tipconv == 'D'){
        conv = item.cantidad == undefined ? '' : parseInt(item.cantidad)/parseFloat(item.fact_conv)
        if (conv){
          // return item.um2+ '('+ item.fact_conv +') -  ' + conv.toFixed(1)
          return item.um2+ '('+ item.fact_conv +') - C.Sug: ' + (Math.ceil(conv)*parseFloat(item.fact_conv)).toString()
        }else{
          return ''
        }
      }else{
        return ''
      }

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

    validaRevision(){
      if (this.buscaUltRev(this.model.numcotiz) > this.model.revision){
        return false;
      } else {
        return true;
      }
    },

    validateItemsGanados(numState, nextState){

      const even = (element) => element.item_ganado === true;
      
      if (this.model.itemsPrincipal.some(even)){
        return true;
        
      } else {
        
        if(nextState==this.stateItGan){
          if(confirm('No se ha seleccionado ningún item ganado. De no continuar con el seguimiento, la cotización se cerrará ¿Desea continuar?')){ 
            return true;
          } else {
            return false;
          }
        }
      }
      
      
    },
    
    validateAdjudicacion(numState, nextState){
      const even = (element) => element.item_ganado === true;

      if(nextState==this.stateRev){
        return true
      }else{

        if(this.validaStockyPlazo()){

            if (this.model.itemsPrincipal.some(even)){
              if(confirm('Se disparara la Generacion del Pedido de Venta en Protheus. De tener exito, la cotizacion finalizara , de lo contrario se informara en una actividad de "Captura de error". ¿Desea continuar?')){ 
                return true;
              } else {
                return false;
              }                            
            } else {
              alert("No se ha seleccionado ningún item ganado. Seleccione 'Requiere nueva Revision' para continuar. El pedido no se generará")
              return false 
            }  
          }else{
            alert("Algunos items ganados no poseen stock. Seleccione 'Requiere nueva Revision' para continuar")
            return false
          }
      }    
    },

    validateButtAprob(){

      if ((this.viewAprCom&&this.model.comercial_approv == '')||(this.viewAprAdm&&this.model.admin_approv == '')){
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

    // getPos(item){
    //   // if (item.item_cotiz != undefined){
    //   //   this.model.itemsPrincipal.splice(posHacia, 1, item);
    //   // }
      
    //   var posDesde = this.model.itemsPrincipal.findIndex(objeto => objeto.index === item.index);
    //   var posHacia = this.model.itemsPrincipal.findIndex(objeto => objeto.index === parseInt(item.item_cotiz)-1);
      
    //   //this.$refs.myTextField[posDesde].blur;
    //   //var posHacia = (posDesde < parseInt(item.item_cotiz)) ? parseInt(item.item_cotiz)+1 :parseInt(item.item_cotiz)-1;
      
    //   // Verifica que los índices estén dentro del rango del array
    //   if (posDesde < 0 || posDesde >= this.model.itemsPrincipal.length || posHacia < 0 || posHacia >= this.model.itemsPrincipal.length) {
        
    //     alert("Índices fuera del rango del array");
        
    //   } else {
        
    //     // Extrae el elemento se quiere mover
    //     const elemAmover = this.model.itemsPrincipal[posDesde];
        
    //     // Remueve el elemento del array
        
    //     // const arrayTemp = this.model.itemsPrincipal.reduce((acc, current, index) => {
    //     //   if (index !== posDesde) {
    //     //     acc.push(current);
    //     //   }
    //     //   return acc;
    //     // }, []);
        
    //     this.model.itemsPrincipal.splice(posDesde, 1);
        
    //     // Ajusta el índice de destino si es necesario
    //     // if (posHacia > posDesde) {
    //       //   posHacia--;
    //       // }
          
    //     // Inserta el elemento en la nueva posición
    //     this.model.itemsPrincipal.splice(posHacia, 0, elemAmover);
        
    //     // this.model.itemsPrincipal = arrayTemp.reduce((acc, current, index) => {
    //     //   if (index === posHacia) {
    //     //     acc.push(elemAmover);
    //     //   }
    //     //   acc.push(current);
    //     //   return acc;
    //     // }, []);
    //   }
        
        
    //   this.enumeraItems();
    //   this.enumeraItems();
    //   this.refreshItTable();
    //   //this.refreshItTable();
    //   //return this.model.itemsPrincipal;

    // },

    enumeraItems(){
      this.model.itemsPrincipal.forEach((item1, index) => {       
        item1.index = index;       
        item1.item_cotiz = (index+1).toString().padStart(4, '0');   
      }); 
    },

    marcarItemsGanados(){
      if (!this.marcdesmarc){
        this.nombremd = 'Desmarcar';
        this.marcdesmarc = true;
        this.model.itemsPrincipal.forEach((item1) => {       
          item1.item_ganado = this.marcdesmarc;   
        });
      } else {
        this.nombremd = 'Marcar';
        this.marcdesmarc = false;
        this.model.itemsPrincipal.forEach((item1) => {       
          item1.item_ganado = this.marcdesmarc;   
        });
      }
        this.refreshItTable();
    },

    handleShortcut(event) {

      if (event.altKey){

        var letra = event.key;

        switch (letra) {
          case "u":
            this.abrirUrl(); // Abre url de anexos
            break;

          case "c":
            this.addItemPrincipal(true); // Agrega nuevo producto especial complejo
            break;

          case "r":
            this.addItemPrincipal(false); // Agrega nuevo producto estándar
            break;

          case "h":
            this.openCloseDialog(true); // Abre el dialog historial
            break;

          case "p":
            this.imprimir(false); // Descarga pdf de cotización
            break;
          
          default:
            alert("Combinación de teclado no encontrado")
        }
      }
    },


    addItemPrincipal(data) {
      this.model.itemsPrincipal.push({index:this.model.itemsPrincipal.length, es_complejo: data})
      this.enumeraItems();
    },

    deleteItem(item){
      if(confirm('¿Desea eliminar la fila seleccionada?')){    		 
        this.model.itemsPrincipal.splice(this.model.itemsPrincipal.indexOf(item), 1)
        if (this.model.tipoCotiz == 'Comex' || this.model.tipoCotiz == 'Budgetaria Comex'){
          if (item.peso != undefined || item.volumen != undefined){ // Compruebo cuando se elimina una row vacía
            this.totPeVol(true, item);
          }
        }
      }
      this.enumeraItems();
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
        this.model.fecha = this.formatDate(this.fechaDelDia().toISOString().substring(0, 10)); 
        this.model.fechaSeg = this.formatDate(this.fechaDelDia(7).toISOString().substring(0, 10));
        this.model.plazoGlobal = '';
        this.model.plazoSeg="7";
        this.priceList = this.getLista(true,parseInt(this.model.codMoeda).toString());
        this.model.listaPrecio = data.listaPrecio;
        this.getPaidSelect();
        this.model.numcotiz = numCotizActual;
        this.model.revision = 0;
        this.model.comercial_approv = '',
        this.model.admin_approv = '',
        this.model.validP = '',
        data = null;
        this.actualizaPrecios();
        this.dialogHistorial = false;
      } catch (e) {}
    },

    revisionItem(item){
      var numCotizActual = item.numcotiz;
      var ultimaRev = 0;
      
      if(!this.cotizConPedido(numCotizActual)){
        ultimaRev = this.buscaUltRev(numCotizActual);

        try {
          data = item;//JSON.parse(data);
          this.model = {
            ...this.model,
          ...data,
        };
        
        this.model.revision = ultimaRev + 1;  
        this.model.lRev = true;
        this.model.fecha = this.formatDate(this.fechaDelDia().toISOString().substring(0, 10)); 
        this.model.fechaSeg = this.formatDate(this.fechaDelDia(7).toISOString().substring(0, 10));
        this.model.comercial_approv = '',
        this.model.admin_approv = '',
        this.model.validP = '',
        
          this.priceList = this.getLista(true,parseInt(this.model.codMoeda).toString());
          this.model.listaPrecio = data.listaPrecio;
          this.getPaidSelect();
          this.actualizaPrecios();

        
        this.model.numcotiz = numCotizActual;
        //data = null;
        this.dialogHistorial = false;
        } catch (e) {}
      }else{
        alert("No se puede realizar la revision de una cotizacion que ya tiene Pedido de Venta asociado");
      }
    },

    buscaUltRev(numCotiz){
      var constraints = [];
      var maxRev = 0 ;
      constraints.push(DatasetFactory.createConstraint('numero_cotizacion', numCotiz, numCotiz, ConstraintType.MUST));
      var registro = DatasetFactory.getDataset("dsTestNumCotiz", null, constraints, null);
      for (var j = 0; j < registro.values.length; j++) {
        if (maxRev<parseInt(registro.values[j]['numero_revision'])){
          maxRev = parseInt(registro.values[j]['numero_revision'])
        }
      }

      return maxRev
    },
    
    cotizConPedido(numCotiz){
      var constraints = [];
      var ltienePed = false ;
      constraints.push(DatasetFactory.createConstraint('numero_cotizacion', numCotiz, numCotiz, ConstraintType.MUST));
      var registro = DatasetFactory.getDataset("dsTestNumCotiz", null, constraints, null);
      for (var j = 0; j < registro.values.length; j++) {
        if (registro.values[j]['pedidoVenta'] != '' ){
          ltienePed = true;
          break;
        }
      }

      return ltienePed
    },

    copyItem(item){
      this.model.itemsPrincipal.push({
        index:this.model.itemsPrincipal.length,
        codigo: item.codigo,
        producto: item.producto,
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
      this.enumeraItems();
      alert("Item agregado!");    
    },


    clientSelect(cod){
      this.model.codCli = cod;
      this.getClientSelect();
      this.dialogClientes = false;

    },

    productSelect(item){
      this.Prod.codigo = item.codigo;
      this.Prod.producto = item.descripcionL;
      this.getProdSelect(this.Prod, 'p');
      this.dialogProductos = false;
      this.refreshItTable();
    },

    getPlazoSegSelect(fechaSeg,fecha){
      //Obtengo partes de fecha en string y la convierto a tipo date
      var partesFechas = fecha.split("/");
      var fechaEmision = new Date(partesFechas[2], partesFechas[1]-1, partesFechas[0]);
      partesFechas = fechaSeg.split("-");
      fechaSeg = new Date(partesFechas[0], partesFechas[1]-1, partesFechas[2]);
      // Calculo la diferencia en milisegundos
      const diffTime = Math.abs(fechaSeg - fechaEmision); // Math.abs para obtener el valor absoluto
      // Convierto la diferencia de milisegundos a días
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); 


      this.model.plazoSeg = diffDays
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
        this.model.responsable_venta = clienteSel.respven;
        this.initCond(clienteSel.condicion);
        this.model.comex_ciudad = clienteSel.ciudad;
        this.model.codPais_comex = clienteSel.pais;
        this.initPais(clienteSel.pais);
        this.model.codVendedor = clienteSel.codVend;
        this.initVend(clienteSel.codVend);
        this.model.cod_trans = clienteSel.codTrans;
        this.initTrans(clienteSel.codTrans);
        this.contactos= this.getContactos(true, this.model.codCli.trim()+this.model.lojaCli.trim() );
        // this.priceList = this.getLista(true,null,clienteSel.lista);
        // if(this.valMonList(clienteSel.lista) == true){
          this.model.listaPrecio = clienteSel.lista
        // };
        this.refreshPrecio(clienteSel.lista);
        this.viewTrigger = true;
        if (clienteSel.estado === 'EX') {
          this.model.tipoCotiz = 'Comex';
        } else {
          this.model.tipoCotiz = 'Nacional';
        }
      }else{
        this.viewTrigger = false;
        this.model.razSoc = '';
        this.model.CUITCli = '';
        this.model.lojaCli = '';
        this.model.CodEstCli = '';
        this.model.EstCli = '';
        this.model.DirCli = '';
        this.model.metodoPago = '';
        this.model.comex_pais = '';
        this.model.comex_ciudad = '';
        this.model.codPais_comex = '';
        this.model.responsable_venta = ''
        this.model.codPago = '';
        this.model.codVendedor = '';
        this.model.cod_trans = '';
        this.contactos= [];
        this.model.listaPrecio = '';
        this.model.tipoCotiz = '';
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
    
    getPaisSelect(){
      const paisSel = this.paises.find(pais => pais.desc === this.model.comex_pais);
      if(paisSel){
        this.model.codPais_comex = paisSel.cod;
      }else{
        this.model.codPais_comex = '';
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

    getTransSelect(){
      const CarrSel = this.carriers.find(carrier => carrier.name === this.model.name_trans);
      if(CarrSel){
        this.model.cod_trans = CarrSel.cod;
      }else{
        this.model.cod_trans = '';
      }
    },
   
    getContactSelect(grupo){
      const ContactSel = this.contactos.find(contacto => contacto.nombre.trim() === this.model.adic_nomecontact.trim());
      if(ContactSel){
        if(grupo == "01"){
          this.model.contactAdmin_em = ContactSel.email;
          this.model.contactAdmin_tlf = ContactSel.telefono;
        }else if(grupo == "02"){
          this.model.contactInspecc_em = ContactSel.email;
          this.model.contactInspecc_tlf = ContactSel.telefono;
        }else{
        this.model.adic_emailcontact = ContactSel.email;
        this.model.adic_phonecontact = ContactSel.telefono;
        }
      }else{
        if(grupo == "01"){
          this.model.contactAdmin_em = '';
          this.model.contactAdmin_tlf = '';
        }else if(grupo == "02"){
          this.model.contactInspecc_em = '';
          this.model.contactInspecc_tlf = '';
        }else{
        this.model.adic_emailcontact = '';
        this.model.adic_phonecontact = '';
        }
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

    getProdSelect(item, tipo){
      var retLista = [];
      const prodSel = tipo == 'p' ? this.productos.find(producto => producto.descripcionL === item.producto && producto.codigo.trim() === item.codigo.trim()) : this.productos.find(producto => producto.codigo.toLowerCase().trim() === item.codigo.toLowerCase().trim());

      if(item.mejora_plazo){
        item.mejora_plazo = true;
      }else{
        item.mejora_plazo = false;
      }

      if(prodSel){
        if (tipo != 'c'){
          item.codigo       = prodSel.codigo;
        }
        retLista = this.getPrecioLista(prodSel.codigo.trim(), this.model.listaPrecio);
        item.producto = prodSel.descripcionL;
        item.um = prodSel.um;
        item.um2 = prodSel.um2;
        item.stock = prodSel.stock;
        item.moq = prodSel.moq;
        item.fact_conv = prodSel.fact_conv;
        item.tipconv = prodSel.tipconv;
        item.empaq = prodSel.empaque;
        item.peso = prodSel.peso;
        item.volumen = prodSel.volumen;
        item.ncm = prodSel.ncm;
        item.precio_lista = retLista[0];
        // item.cantidad     = 1;
        item.plazo_entrega= prodSel.plazo;
        item.plazo_sin_stock = prodSel.plazo;
        item.desc_item    = retLista[1]; // aca iria el campo de descuento obtenido desde la api de productos
        // item.desc_adic    = '0'; // se inicializa en este valor 
        this.totalCalc(item);
        if (this.model.tipoCotiz == 'Comex' || this.model.tipoCotiz == 'Budgetaria Comex'){
          if (item.peso === 0 || item.volumen === 0){ //Comprueba si el peso o volumen tiene info y si alguno no tiene, grisa y marca. No calcula
            if (this.linfo){
              this.setTotPesoVol();
              this.setTrueCheck();
              this.grisaCheckNoCalc();
              this.linfo = false;
            }
          } else {
            if (this.model.calc_pes_vol === false){ // Solamente si el check está desmarcado se calcula
              this.totPeVol(false);
            }
          }
        }
        
      }else{
        item.codigo       ='';
        item.producto     ='';
        item.um           ='';
        item.um2          ='';
        item.stock        ='';
        item.moq          ='';
        item.fact_conv    ='';
        item.tipconv      ='';
        item.precio_lista ='';
        item.cantidad     ='';
        item.empaq        ='';
        item.ncm          ='';
        item.peso         ='';
        item.volumen      ='';
        item.desc_item    ='';
        item.desc_adic    ='';
        item.precio_neto  ='';
        item.importe      ='';
      }
    },

    verificaStock(item){
      // caso sin stock
      if (this.viewPlazo){
        if (item.stock === 0){
          return true
        } else {
          //caso con stock y cantidad supera moq
          if (item.stock > item.cantidad && item.cantidad > item.moq){
            return false
          } else {
            return true
          }
        }
      }else if(this.viewComplej&&item.es_complejo){
        return false
      }else{
        return true
      }
    },
    
    validaStockyPlazo(){
      var conStock = true;
      var sinPlazo = false;
      var fechaValidez = this.calcFecha(this.model.fecha,this.model.adic_plazoValidez);
      var fechaActual = new Date();
      // if (this.viewValP){
      //   var prods = this.getProducts(item.codigo);

      //   for (var j = 0; j < prods.length; j++){
      //     if(prods[j].codigo === item.codigo){
      //       prodSel = prods[j];
      //       break;
      //     }
      //   }

      //   if(prodSel){
      //     if (item.cantidad > prodSel.stock){
      //       return true;
      //     } else {
      //       return false;
      //     }
      //   }
      // }
      
      for (var i = 0; i < this.model.itemsPrincipal.length; i++){
        var prods = this.getProducts(true,this.model.itemsPrincipal[i].codigo);

        for (var j = 0; j < prods.length; j++){
          if(prods[j].codigo === this.model.itemsPrincipal[i].codigo){
            prodSel = prods[j];
            break;
          }
        }

        if(prodSel){
          if (this.model.itemsPrincipal[i].cantidad > prodSel.stock){
            this.model.itemsPrincipal[i].sin_stock = true;
            if(this.model.itemsPrincipal[i].item_ganado){
              conStock = false;
            }
          } else {
            this.model.itemsPrincipal[i].sin_stock = false;
          }
        }
      };     
    
      if (fechaActual >= fechaValidez){
        this.messageAlert="- La fecha actual excede la fecha de validez establecida para esta cotizacion. La misma se encuentra fuera de plazo \n\n" 
        this.viewAlerts = true;
        sinPlazo = true;
      };
      
      if(!conStock){
        this.messageAlert="- Hay algunos items que se encuentran sin stock. De no continuar con el Pedido, genere una nueva Revision \n\n" 
        this.viewAlerts = true;
      };
      this.refreshItTable()
      return conStock

    },


    calcFecha(fechaString, plazoEntrega) {
      var partesFechas = fechaString.split("/");
      var fechaEmision = new Date(partesFechas[2], partesFechas[1]-1, partesFechas[0]);
      var fechaEntrega = new Date();
  
      fechaEntrega.setDate(fechaEmision.getDate() + parseInt(plazoEntrega));
  
      return (fechaEntrega)
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
        const prodSel = this.productos.find(producto => producto.descripcionL === this.model.itemsPrincipal[i].producto && producto.codigo.trim() === this.model.itemsPrincipal[i].codigo.trim());
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
      
      this.enumeraItems();
      
    },

    grisaCheckNoCalc(){
      if (this.viewFirst) {
      return this.viewNoCalcula;
      } else {
        return true;
      }
    },

    checkNoCalcula(){
      if (this.model.calc_pes_vol === true){
        this.setTotPesoVol();
      } else {
        this.totPeVol(false);
      }
    },

    setTotPesoVol(){
      this.model.comex_vol = 0;
      this.model.comex_peso = 0;
    },

    setTrueCheck(){
      this.model.calc_pes_vol = true;
      this.viewNoCalcula = true;
    },

    setFalseCheck(){
      this.model.calc_pes_vol = false;
      this.viewNoCalcula = false;
    },

    totPeVol(elim, item){
      if (elim){
        if (this.model.calc_pes_vol === false){ // Verifico que el check esté desmarcado para descontar, sino no se calcula
          if (this.model.comex_peso != 0 ){
        this.model.comex_peso -= item.peso;
          }
          if (this.model.comex_vol != 0 ){
        this.model.comex_vol -= item.volumen;
          }
        }
        this.verificaItems();
      } else {
        this.setTotPesoVol();
        for(var i=0 ; i < this.model.itemsPrincipal.length; i++){
          this.model.comex_peso += this.model.itemsPrincipal[i].peso;
          this.model.comex_vol += this.model.itemsPrincipal[i].volumen;
      }
      }
    },

    verificaItems(){
      if(this.model.itemsPrincipal.length != 0){
        var igualCero = false;
        for(var i=0 ; i < this.model.itemsPrincipal.length; i++){
          if(this.model.itemsPrincipal[i].peso === 0 || this.model.itemsPrincipal[i].volumen === 0){
            igualCero = true;
            break;
          }
        }
        if (igualCero){
          this.setTotPesoVol();
          this.setTrueCheck();
        } else {
          this.setFalseCheck();
          this.checkNoCalcula();
          this.linfo = true;
        }
      } else {
        this.setTotPesoVol();
        this.setFalseCheck();
        if(this.linfo == false){
          this.linfo = true;
        }
      }
      this.grisaCheckNoCalc();
    },

    totalCalc(item){
      item.precio_neto  = (item.desc_adic)? getDiscont(item.desc_item, item.desc_adic, item.precio_lista) : getDiscont(item.desc_item, '0', item.precio_lista);
      item.importe      = (item.cantidad)? getTotal( item.precio_neto, item.cantidad) :0 ;

      if(!this.viewMode){
        const cantidad = item.cantidad;

        if (cantidad != undefined){
          
          if (cantidad != ''){
            const value = parseInt(cantidad);
            const prodSel = this.productos.find(producto => producto.descripcionL === item.producto && producto.codigo.trim() === item.codigo.trim());
                           
            
            if (value != 0 || value > 0){
              if(value <= parseInt(prodSel.stock) && value <= parseInt(prodSel.moq)){
                item.plazo_entrega = 'En Stock';
                if(item.mejora_plazo){
                  item.mejora_plazo = false;
                }

              } else {
                item.plazo_entrega = item.plazo_sin_stock;
                item.mejora_plazo = true;
              }
            }
          }
        }
      }
      this.refreshItTable();
    },
    
    refreshItTable(){
      this.model.itemsPrincipal.push({});
      this.model.itemsPrincipal.pop();
      vm.$forceUpdate();
    },

    refreshPrecio(clienteSelLista){

      // const listaSel = this.priceList.find(lista => lista.cod_lista === this.model.listaPrecio);

      // if(listaSel){
      //   this.initMoed(listaSel.moneda)
      // }

      //Se desestima por no tener que disparar moneda nuevamente si actualizo la lista de precios, la moneda se debe mantener
      if(this.valMonList(clienteSelLista) == true){
        if(this.model.itemsPrincipal.length > 0)  
          for(var i=0 ; i< this.model.itemsPrincipal.length; i++){
          
            this.getProdSelect(this.model.itemsPrincipal[i])
          
          }
        }else{
          this.model.listaPrecio = ''
        };

    },

    valMonList(listCli){
      const listaSel = this.priceList.find(lista => lista.cod_lista === (listCli ? listCli : this.model.listaPrecio));

      
      if((this.model.listaPrecio.trim() == '' || this.model.listaPrecio == undefined) && (listCli.trim() == '' || listCli == undefined)){
        return false || "Campo requerido"
      }else{
        if(listaSel){
          if (listaSel.moneda != this.model.codMoeda){
            this.priceListError = "Codigo de lista invalido. La lista informada debe estar en moneda: " + this.model.abrevMoe ;
            return false
          }else{
            this.priceListError = ""
            return true
          }
        }else{
          this.priceListError = "Lista invalida. La lista '"+ listCli +"' informada debe estar en la moneda de cotizacion" ;
          return false 
        }
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
     
     initPais(codP){
        const paisSel = this.paises.find(pais => pais.cod === codP);

        if(paisSel){
          this.model.comex_pais = paisSel.desc;
        }else{
          this.model.comex_pais = '';
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

     initTrans(codT){
        const CarrSel = this.carriers.find(carrier => carrier.cod.trim() === codT.trim());

        if(CarrSel){
          this.model.name_trans = CarrSel.name;
        }else{
          this.model.name_trans = '';
        }
     },

     validaCodigo(item){

      if (this.viewFirst && item.es_complejo) {
        return true
        
      } else {
        if (item.codigo != undefined){
          var cod = this.productos.find(producto => producto.codigo.toLowerCase().trim() === item.codigo.toLowerCase().trim());
      if(!cod){
        return false || "El código ingresado no existe";
          }
        } else {
          return true
        }
        }
     },
     
     validaPlazos(value){
         // Verificar si el valor está vacío
        if (value === null || value.trim() === '') {
          return true; // Valor vacío permitido
        }

        const plazoGlobal = parseInt(value)
        const itemConMayorPlazo = this.model.itemsPrincipal.reduce((anterior, actual) => {
          
          if(actual.plazo_entrega.toLowerCase() == 'en stock'){
            return anterior;
          } else if(anterior.plazo_entrega.toLowerCase() == 'en stock'){
            return actual
          }else{
          return parseInt(actual.plazo_entrega) > parseInt(anterior.plazo_entrega) ? actual : anterior;
          }
        }, this.model.itemsPrincipal[0]); // Se inicia con el primer elemento como referencia

        return plazoGlobal >= parseInt(itemConMayorPlazo.plazo_entrega) || "El plazo de entrega global debe ser mayor o igual al mayor plazo de entrega de los ítems.";
     },

    validaItemOC(item){
      
      if (item.item == undefined && this.validaCpoVacio()) {
        return false || "Debe cargar el valor del itemOC";
      } else{
        return true;
      };
    },

    validaCpoVacio(){

      for(var i=0 ; i< this.model.itemsPrincipal.length; i++){
        if (this.model.itemsPrincipal[i].item){
          return true;
        }
      };
      
      return false;
    },

    infoStock(item){
      if(!this.viewMode||this.viewComplej&&item.es_complejo){
      const cantidad = item.cantidad;
        if (cantidad != undefined && cantidad.trim() != ''){
          const value = parseInt(cantidad);
          const prodSel = this.productos.find(producto => producto.descripcionL === item.producto && producto.codigo.trim() === item.codigo.trim());

          if (item.tiene_emp){
            return ""
          }else{

          if(value > parseInt(prodSel.stock)){
            return "Valor indicado supera el stock.";
          } else if(value > parseInt(prodSel.moq)){
            return "Valor indicado supera el moq.";
            } 
          } 
        }
      }
    },

    checkMejPlazo(item){
      item.mejora_plazo;
      vm.$forceUpdate();
    },

    validaCtaAbierta(value){
      if (value === null || value.trim() === '') {
        if (this.model.codCli == undefined || this.model.codCli == ''){
          return true; // Valor vacío permitido
        }else{
          return false || "Campo requerido"
        }
          
      }

    },


    validaCantEmp(item){
      if(!this.viewMode){

        if (this.viewFirst && item.es_complejo){
          return true
        } else {

      const cantidad = item.cantidad;

          if (cantidad != undefined && cantidad != ''){
    
          const value = parseInt(cantidad);
          
            if (value <= 0){
              return false || "Ingrese un valor distinto de " + value
            } 

            // Validacion con productos empaque cerrado
            if (item.empaq == '1'){
            if(item.tipconv == 'D'){
                var conv = item.cantidad == undefined ? '' : parseInt(item.cantidad)/parseFloat(item.fact_conv)
                if (conv){
                // return item.um2+ '('+ item.fact_conv +') -  ' + conv.toFixed(1)
                if ((Math.ceil(conv)*parseFloat(item.fact_conv)) != item.cantidad){
                    item.tiene_emp = true;
                  return false || item.um2+ '('+ item.fact_conv +') - C.Oblig.: ' + (Math.ceil(conv)*parseFloat(item.fact_conv)).toString()
                  }
                }
              }
            }
            item.tiene_emp = false;
            
          } else {
            return false || "Campo requerido"
          }
        }
      }else{
        return true
      }

    },

      refreshPlazo(value){
        const validation = this.validaPlazos(value)
        if(validation === true && !(value === null || value.trim() === '')){
            // Se procede a reemplazar los plazos de entrega de los items con el nuevo valor global
            this.model.itemsPrincipal.forEach(item => {
              if(item.plazo_entrega.toLowerCase() != 'en stock'){
              item.plazo_entrega = value.trim();
              }
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
      
      setAdminApproved(estado) {
      	this.model.admin_approv = estado
      },

			async getAllDataSelect(firstCharge){
      try {
          const [clientes, sellers, carriers, monedas, paidmetods, paises] = await Promise.all([
            this.getClientes(firstCharge),
            this.getSellers(firstCharge),
            this.viewGenPed ? this.getCarriers(firstCharge) : Promise.resolve([]),
            this.getMonedas(firstCharge),
            this.getPaidMethod(firstCharge),
            this.getPaises(firstCharge),
           
          ]);


          this.clientes= clientes;
          this.sellers= sellers;
          if(this.viewGenPed){
            this.carriers= carriers;
          }
          this.monedas= monedas;
          if (firstCharge){
            this.initMoed(null,'USD');
            this.model.user_cotiz = this.nombreUsuario;
          }
          this.paidmetods= paidmetods;
          this.paises= paises;
          if(this.viewPlazo||this.viewComplej){
            this.productos=  this.getProducts(true);
          }else{
            this.productos=  this.getProducts(firstCharge);
          }
          this.priceList= this.getLista(firstCharge, parseInt(this.model.codMoeda).toString());
          vm.$forceUpdate(); 
        } catch (error) {
          console.error('Error loading datasets:', error);
        }
			},

      async getDatasetAsync(datasetName, constraints) {
        return new Promise((resolve, reject) => {
            try {
                var dataset = DatasetFactory.getDataset(datasetName, null, constraints, null);
                resolve(dataset);
            } catch (error) {
                reject(error);
            }
        });
      },
			
			async getClientes(firstCharge,idCliente) {
				var constraints = []
				var clientesResult = []
				
				if(firstCharge){
					if (idCliente){
						constraints.push(DatasetFactory.createConstraint('searchKey', idCliente, idCliente, ConstraintType.MUST));
					}
					constraints.push(DatasetFactory.createConstraint('pageSize', "10000", "10000", ConstraintType.MUST));
			
					var clientes = await this.getDatasetAsync("clientes_Protheus", constraints);
							for (var j = 0; j < clientes.values.length; j++) {
									clientesResult.push({
                    name: clientes.values[j]["name"],
                    cod: clientes.values[j]["id"],
                    cuit: clientes.values[j]["cuit"],
                    estado: clientes.values[j]["estado"],
                    descont: clientes.values[j]["descont"],
                    loja: clientes.values[j]["branch"],
                    direccion: clientes.values[j]["address"],
                    condicion: clientes.values[j]["condicion"],
                    lista: clientes.values[j]["lista"],
                    codVend: clientes.values[j]["codVend"],
                    provincia: clientes.values[j]["provincia"],
                    codTrans: clientes.values[j]["transportista"],
                    respven: clientes.values[j]["respon_venta"],
                    ciudad: clientes.values[j]["municipio"],
                    pais: clientes.values[j]["pais"],
                    limiteCred: clientes.values[j]["limiteCred"],
                    moedLC: clientes.values[j]["moedLC"],
                  });
					}
				}else{
					clientesResult.push({name: this.model.razSoc, cod: this.model.codCli})
				}
			
				return clientesResult
			},

			async getSellers(firstCharge,idSeller) {
				var constraints = []
				var sellersResult = []
				
				if(firstCharge){
					if (idSeller){
						constraints.push(DatasetFactory.createConstraint('searchKey', idSeller, idSeller, ConstraintType.MUST));
					}
					constraints.push(DatasetFactory.createConstraint('pageSize', "10000", "10000", ConstraintType.MUST));
				
					var sellers = await this.getDatasetAsync("vendedores_Protheus", constraints);
          
							for (var j = 0; j < sellers.values.length; j++) {
								sellersResult.push({ name: sellers.values[j]['name'], cod: sellers.values[j]['cod'] })
					}
				}else{
					sellersResult.push({name: this.model.vendedor, cod: this.model.codVendedor})
				}
				return sellersResult
			},
			
      async getCarriers(firstCharge,idCarrier) {
				var constraints = []
				var carriersResult = []
				
				if(firstCharge){
					if (idCarrier){
						constraints.push(DatasetFactory.createConstraint('searchKey', idCarrier, idCarrier, ConstraintType.MUST));
					}
					constraints.push(DatasetFactory.createConstraint('pageSize', "10000", "10000", ConstraintType.MUST));
				
					var carriers = await this.getDatasetAsync("transportistas_Protheus", constraints);
          
							for (var j = 0; j < carriers.values.length; j++) {
								carriersResult.push({ name: carriers.values[j]['name'], cod: carriers.values[j]['id'], address: carriers.values[j]['address'], cuit: carriers.values[j]['cuit'], estado: carriers.values[j]['estado'], provincia: carriers.values[j]['provincia'], municipio: carriers.values[j]['municipio'] })
					}
				}else{
					carriersResult.push({name: this.model.name_trans, cod: this.model.cod_trans})
				}
				return carriersResult
			},
      
      getContactos(firstCharge,idCliente,grupo) {
				var constraints = []
				var contactosResult = []
				
				if(firstCharge){
					if (idCliente){
						constraints.push(DatasetFactory.createConstraint('searchKey', idCliente, idCliente, ConstraintType.MUST));
					}
          if(grupo){
            constraints.push(DatasetFactory.createConstraint('grupo', grupo, grupo, ConstraintType.MUST));
          }

					constraints.push(DatasetFactory.createConstraint('pageSize', "1000", "1000", ConstraintType.MUST));
				
					var contactos = DatasetFactory.getDataset("contactos_Protheus", null, constraints, null);
          for (var j = 0; j < contactos.values.length; j++) {
								contactosResult.push({ cod: contactos.values[j]['codigo'], nombre: contactos.values[j]['nombre'], email: contactos.values[j]['email'], telefono: contactos.values[j]['telefono']})
					}
				}else{
					contactosResult.push({name: this.model.adic_nomecontact})
				}
				return contactosResult
			},
			
			
			async getMonedas(firstCharge,idMoneda) {
				var constraints = []
				var monedasResult = []

				if(firstCharge){	
					if (idMoneda){
						constraints.push(DatasetFactory.createConstraint('searchKey', idMoneda, idMoneda, ConstraintType.MUST));
					}
					constraints.push(DatasetFactory.createConstraint('pageSize', "1000", "1000", ConstraintType.MUST));
				
					var monedas = await this.getDatasetAsync("monedas_Protheus", constraints);
          
							for (var j = 0; j < monedas.values.length; j++) {
								monedasResult.push({ cod: monedas.values[j]['cod'], desc: monedas.values[j]['description'],symb: monedas.values[j]['symb'], desc2:monedas.values[j]['symb'] + ' - ' + monedas.values[j]['description'],abrev: monedas.values[j]['abrev']})
					}
				}else{
					monedasResult.push({desc: this.model.moneda})
				}

			
				return monedasResult
			},
			
			
			async getPaidMethod(firstCharge,idMethod) {
				var constraints = []
				var methodsResult = []

				if(firstCharge){
					if (idMethod){
						constraints.push(DatasetFactory.createConstraint('searchKey', idMethod, idMethod, ConstraintType.MUST));
					}
					constraints.push(DatasetFactory.createConstraint('pageSize', "1000", "1000", ConstraintType.MUST));
				
					var paidmethods = await this.getDatasetAsync("metodosDePago_Protheus", constraints);
          
							for (var j = 0; j < paidmethods.values.length; j++) {
								methodsResult.push({ cod: paidmethods.values[j]['cod'], desc: paidmethods.values[j]['descriptionlarge'],cond: paidmethods.values[j]['condition'] })
					}
				}else{
					methodsResult.push({cod:this.model.codPago, desc:this.model.metodoPago})
				}
			
				return methodsResult
			},
			
      async getPaises(firstCharge,idPais) {
				var constraints = []
				var paisesResult = []

				if(firstCharge){
					if (idPais){
						constraints.push(DatasetFactory.createConstraint('searchKey', idPais, idPais, ConstraintType.MUST));
					}
					constraints.push(DatasetFactory.createConstraint('pageSize', "1000", "1000", ConstraintType.MUST));
				
					var paises = await this.getDatasetAsync("paises_Protheus", constraints);
          
							for (var j = 0; j < paises.values.length; j++) {
								paisesResult.push({ cod: paises.values[j]['codpais'], desc: paises.values[j]['description']})
					}
				}else{
					paisesResult.push({desc:this.model.comex_pais})
				}
			
				return paisesResult
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
								productsResult.push({
                  codigo: productos.values[j]["codigo"],
                  producto: productos.values[j]["descripcion"],
                  grupo: productos.values[j]["grupo"],
                  plazo: productos.values[j]["plazo"],
                  moq: productos.values[j]["moq"],
                  stock: productos.values[j]["cantidad"],
                  descripcionL: productos.values[j]["descripcionL"],
                  um: productos.values[j]["um"],
                  um2: productos.values[j]["um2"],
                  tipconv: productos.values[j]["tipconv"],
                  fact_conv: productos.values[j]["fact_conv"],
                  deposito: productos.values[j]["deposito"],
                  empaque: productos.values[j]["empaque"],
                  peso: productos.values[j]["peso"],
                  volumen: productos.values[j]["volumen"],
                  ncm: productos.values[j]["posipi"],
                });
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
				
				
					var pricelist =  DatasetFactory.getDataset("listaPrecios_Protheus", null, constraints, null);
          
							for (var j = 0; j < pricelist.values.length; j++) {
                pricelistResult.push({
                  codpro: pricelist.values[j]["codpro"],
                  cod_lista: pricelist.values[j]["cod_lista"],
                  prcven: pricelist.values[j]["prcven"],
                  discont: pricelist.values[j]["discont"],
                  moneda: pricelist.values[j]["moneda"],
                });
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

    openCloseInfoAtajos(open){
      this.dialogInfoAtajos = open;
      //vm.$forceUpdate();
    },

    async refreshClientes(firstCharge){

      const [clientes] = await Promise.all([
        this.getClientes(firstCharge),    
      ]);
      this.clientes= clientes;
      vm.$forceUpdate();
    },

    imprimir(tecnica,borrador) {
      this.model.ofTecnica = tecnica;
      this.model.borrador = borrador;
      const vm = this;
      $("#btnExportarPdf").trigger("click")
    },
    
    
    abrirUrl() {
      // const url = "http://172.16.23.226:8080/portal/p/DEL/ecmnavigation?app_ecm_navigation_doc=71";
      const url = document.getElementById("documento_adjunto").getAttribute("value") || "";;
      window.open(url, '_blank');
    },

  },

  mounted() {
    window.addEventListener('keyup', this.handleShortcut);
  },

  beforeDestroy() {
    window.removeEventListener('keyup', this.handleShortcut);
  }
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


var beforeSendValidate = function (numState, nextState){
  return vm.save(numState, nextState);
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

function StrFecha(fecha){
  var partesFechas = fecha.split("/");
  var fechaEmision = new Date(partesFechas[2], partesFechas[1]-1, partesFechas[0]);
  var fechaStr = fechaStr = fechaEmision.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });

  return (fechaStr)
};


function campoDefecto(campo){
  if ((campo == undefined) || (campo == '')){
    return '-'
  }
};


function getLegendas(){
  var constraints = []
  var legendasResult = [[],[]]
  var count = 1
  var letter = 0;

  var legendas = DatasetFactory.getDataset("dsMaestroLeyendas", null, null, null);
  for (var j = 0; j < legendas.values.length; j++) {
    if(legendas.values[j]['impresion'] == 'on'){
      if(legendas.values[j]['seccion'] == 'particular'){
        legendasResult[0].push({ num:count++, cod: legendas.values[j]['leyenda'], text: legendas.values[j]['textLegend'],titulo: legendas.values[j]['titulo']})
      }else if(legendas.values[j]['seccion'] == 'general'){
        legendasResult[1].push({ num:String.fromCharCode(65 + letter++), cod: legendas.values[j]['leyenda'], text: legendas.values[j]['textLegend'],titulo: legendas.values[j]['titulo']})     
      } 
    }
  }

  return legendasResult
};


$("#btnExportarPdf").totreport({
  "templateUrl": "/static/totvs-templates/DelgaTemplate.html",
  "log": 1,
  "generateData": function () {
    console.log("entro a la funcion de impresion")
    var productos = [];
    var rowCount = vm.model.itemsPrincipal.length;
    var idFluig = document.getElementById("requestId").value;
    var aLegendas = getLegendas();

     // Reemplaza los placeholders en las leyendas
     for (var j = 0; j < 2; j++) {
      for (var i = 0; i < aLegendas[j].length; i++) {
        aLegendas[j][i].text = aLegendas[j][i].text.replace('{{moneda}}', vm.model.moneda || ' - ');
        aLegendas[j][i].text = aLegendas[j][i].text.replace('{{condiciondepago}}', vm.model.metodoPago || ' - ');
        aLegendas[j][i].text = aLegendas[j][i].text.replace('{{fechavigencia}}', vm.model.fechaVenc || ' - ');
        aLegendas[j][i].text = aLegendas[j][i].text.replace('\n',  '{{lineBreak}}');
      }
    }
      

    for (var i = 0; i < rowCount  ; i++) {
      if (vm.model.itemsPrincipal[i]){
        
        productos.push({
          id: vm.model.itemsPrincipal[i].codigo || ' - ' ,
          descripcionProducto: vm.model.itemsPrincipal[i].producto || ' - ',
          cantidad: parseInt(vm.model.itemsPrincipal[i].cantidad) || 0,
          // stock: (vm.model.itemsPrincipal[i].plazo_entrega.toLowerCase() == 'en stock') ? parseInt(vm.model.itemsPrincipal[i].stock),
          stock: parseInt(vm.model.itemsPrincipal[i].stock)>parseInt(vm.model.itemsPrincipal[i].cantidad) ? parseInt(vm.model.itemsPrincipal[i].cantidad) : parseInt(vm.model.itemsPrincipal[i].stock) || 0,
          codigo: vm.model.itemsPrincipal[i].codigo ? vm.model.itemsPrincipal[i].codigo.trim() : '-',
          item: (vm.model.itemsPrincipal[i].item == undefined||vm.model.itemsPrincipal[i].item == '')? vm.model.itemsPrincipal[i].item_cotiz : vm.model.itemsPrincipal[i].item,
          precioVenta: parseFloat(vm.model.itemsPrincipal[i].precio_neto) || 0,
          precioUnitario: parseFloat(vm.model.itemsPrincipal[i].precio_lista) || 0,
          descuento: parseInt(vm.model.itemsPrincipal[i].desc_item) || 0,
          plazo_entrega: vm.model.itemsPrincipal[i].plazo_entrega || ' - ',
          descuentoAdd: 0,
          precioTotal: parseFloat(vm.model.itemsPrincipal[i].importe) || 0,
        });
      };
      console.log("array de productos armados:" );
      console.log(productos);
    }
    var datos = {
      "numeroCotizacion": vm.model.numcotiz,
      "revision":vm.model.revision,
      "fecha": vm.model.fecha,
      "fechaStr": StrFecha(vm.model.fecha),
      "cliente": vm.model.razSoc ? vm.model.razSoc.trim() : '-',
      "cuit": vm.model.CUITCli || ' - ' ,
      "empresa": "empresa",
      "observaciones": vm.model.adic_obsImp || '' ,
      "direccion": vm.model.DirCli || ' - ',
      "tel": vm.model.adic_phonecontact || ' - ',
      "mail": vm.model.adic_emailcontact || ' - ' ,
      "idFluig": idFluig == '' ? ' - ' : idFluig,
      "tipoCotiz": vm.model.tipoCotiz || ' - ',
      "discontCli": vm.model.dtoCliente || ' - ',
      "discontAdd": vm.model.dtoAdicional || ' - ',
      "precioTotal": vm.model.totalItems || 0 ,
      "condicionPago": vm.model.metodoPago || ' - ',
      "moneda": vm.model.moneda || ' - ' ,
      "fechaVigencia": vm.model.fechaVenc || ' - ',
      "emitidoPor": vm.model.user_cotiz || ' - ',
      "productos": productos,
      "leyendasP": aLegendas[0],
      "leyendasG": aLegendas[1],
      "noTecnica": vm.model.ofTecnica ? 'false' : 'true',
      "borrador": vm.model.borrador ? 'true': 'false', 
     };
    console.log("json de cabecera:" );
    console.log(JSON.stringify(datos));
    return JSON.stringify(datos);
  },
  "generateFileName": function () { 
    var currentDate = new Date();
    var formattedDate = currentDate.getFullYear() + ('0' + (currentDate.getMonth() + 1)).slice(-2) + ('0' + currentDate.getDate()).slice(-2);
    var numCotizacion = vm.model.numcotiz;

    return "Cotizacion_"+ numCotizacion + "_" + formattedDate + ".pdf"; },
});



