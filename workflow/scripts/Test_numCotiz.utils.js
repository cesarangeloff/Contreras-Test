function verificaMejora() {
    log.info("==============================================");
	log.info("MEJORA_PLAZO");
    log.info("==============================================");
    var model = getJsonModel();
    data = JSON.parse(model);

    for (var i=0; i < data.itemsPrincipal.length; i++){
        if (data.itemsPrincipal[i].mejora_plazo){
            return true
        } 
    }
    return false
};


function validaPlazo(){
    var lret = false;
    var valorCpo = hAPI.getCardValue("deadline_validation");

    if (valorCpo == 'S'){
        lret = true
    }

    return lret
};

function aprobadoComercial(){
    var lret = false;
    var valorCpo = hAPI.getCardValue("commercial_approved");
    
    if (valorCpo == 'A'){
        lret = true
    }
    
    return lret
};


function cargaCliente() {
    var lret = false;
    var model = getJsonModel();
    data = JSON.parse(model);
    
    if (!data.codCli && !data.CUITCli){
        lret = true
    }
    
    return lret
};

function isSuccess(){
    var success = true;
    var status = hAPI.getCardValue("integrationStatus");
    var pedidoVenta = hAPI.getCardValue("pedidoVenta");
    log.info("==============================================");
	log.info("INTEGRACION STATUS");
    log.info("==============================================");
	log.info(status);
	log.info(pedidoVenta);
    
    if(pedidoVenta == ''){
        var model = getJsonModel();
        data = JSON.parse(model);
        
        if (data.erroIntegracion == ''){
            
            data.erroIntegracion = status
            formatFormPadre(data);
        }

        success = false;
    }	

    return success
};


function aceptaVigencia(){
    var lret = true;
    var model = getJsonModel();
    var data = JSON.parse(model);
    var fechaValidez = calcFecha(data.fecha,data.adic_plazoValidez);
    var fechaActual = new Date();
    log.info("==============================================");
	log.info("ACEPTA VIGENCIA");
    log.info("==============================================");


    if (fechaActual >= fechaValidez){
        lret = false
    }
    
    return lret
};



function calcFecha(fechaString, plazoEntrega) {
    var partesFechas = fechaString.split("/");
    var fechaEmision = new Date(partesFechas[2], partesFechas[1]-1, partesFechas[0]);
    var fechaEntrega = new Date();

    fechaEntrega.setDate(fechaEmision.getDate() + parseInt(plazoEntrega));

    return (fechaEntrega)
};


function validateItemsGanados() {
    var model = getJsonModel();
    var data = JSON.parse(model);

    if (data.tipoCotiz.toUpperCase().indexOf("BUDGETARIA") === -1){   
        for (var i=0; i < data.itemsPrincipal.length; i++){
            if (data.itemsPrincipal[i].item_ganado){
                return true
            } 
        }
    }
    return false;
};


function validSeg() {
	var model = getJsonModel();
    var data = JSON.parse(model);

    if(data.plazoSeg == '0'){
    	//tratar para sin seguimiento
    	return true
    }else{
    	return false
    }
    	
    
};



function aprComercial() {
	//de no requerir aprobacion devolver false, de lo contrario,devolver true
    var model = getJsonModel();
    data = JSON.parse(model);

    log.info("=====================================")
    log.info("Aprobación comercial")
    log.info("=====================================")
    

    if (validaMonto(data) || validaDtoCliente(data) || validaDtoAdExtra(data) || validaDtoAdItem(data) || validaMetodoPago(data)){
        return true
    }
   
	return false
};


function apruebaAdmin() {
	//de no requerir aprobacion devolver false, de lo contrario,devolver true
	return false
};

function validaMonto(data) {
    if (parseInt(data.totalItems) < 250 && data.abrevMoe == 'USD'){
        return true
    }
    return false
};

function validaDtoCliente(data) { 
    var constraints = []
    constraints.push(DatasetFactory.createConstraint('searchKey', data.codCli, data.codCli, ConstraintType.MUST));
    var clientes = DatasetFactory.getDataset("clientes_Protheus", null, constraints, null);
    if (parseInt(data.dtoCliente) > parseInt(clientes.descont)){
        return true
    } 
    return false
};

function validaDtoAdExtra(data) { 
    if (parseInt(data.dtoAdicional) > 2){
        return true
    }
    return false 
};

function validaDtoAdItem(data) { 
    for (var i=0; i < data.itemsPrincipal.length; i++){
        if (parseInt(data.itemsPrincipal[i].desc_item) > 2){
            return true
        } 
    }
    return false 
};

function validaMetodoPago(data) {
    var constraints = []
    constraints.push(DatasetFactory.createConstraint('searchKey', data.codCli, data.codCli, ConstraintType.MUST));
    var clientes = DatasetFactory.getDataset("clientes_Protheus", null, constraints, null);
    //Está tomando la descripción del formulario y no el código, cuidado!!
    if (data.metodoPago != clientes.condicion){
        return true
    }
    return false 
};