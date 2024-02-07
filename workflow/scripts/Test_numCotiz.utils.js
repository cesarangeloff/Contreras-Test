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
}