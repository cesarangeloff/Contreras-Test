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

    for (var i=0; i < data.itemsPrincipal.length; i++){
        if (data.itemsPrincipal[i].item_ganado){
            return true
        } 
    }

    return false;
};