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