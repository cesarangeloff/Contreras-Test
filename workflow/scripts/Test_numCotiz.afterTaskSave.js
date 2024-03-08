function afterTaskSave(colleagueId,nextSequenceId,userList){
     log.info("==============================================");
	 log.info("AFTER TASK SAVE");
     log.info("==============================================");
	if (nextSequenceId == 7){
        log.info("*************************************");
        log.info("entra en after task save - inicio");
        log.info("*************************************");
        //var constraints = new Array();
        var numCotizModel = getJsonModel();
        var valorActual = 0;
        var valorNuevo = 0;
        var valorNuevoComp = '';
        var numCotizMax = DatasetFactory.getDataset("dsTestMaxNumCotiz", null, null, null);
    
        
        if (numCotizMax.getValue(0, 'NumCotizMax') != null){
            valorActual= parseInt(numCotizMax.getValue(0, "NumCotizMax"), 10);
        }

    
        //log.info("VALOR ACTUAL ->>>>>" + valorActual);
        
    
        valorNuevo = valorActual + 1;

        //log.info("VALOR NUEVO  ->>>>>>" + valorNuevo);
        
        valorNuevoComp = formatNumber(valorNuevo, 6);
        //log.info("VALOR NUEVO COMPUESTO ->>>>>>" + valorNuevoComp);

        hAPI.setCardValue("numero_cotizacion", valorNuevoComp);
        
        data = JSON.parse(numCotizModel);

        
        if ( valorNuevoComp != data.numcotiz){
            log.info("*************************************");
            log.info("Se modificará el valor de la cotización por uno nuevo");
            log.info("*************************************");

            data.numcotiz = valorNuevoComp;

            formatFormPadre(data);
        }
        
        // alert("Se modificará el valor de la cotización por uno nuevo");

        //hAPI.setCardValue("numero_cotizacion", valorNuevo.toString());

        // hAPI.setCardValue(JSON.parse(getJsonModel()).numcotiz, maxValor.toString());
    }
	
}


function formatFormPadre(jsonPadre) {
	var jsonData = {}
	log.info('Saving form data ...');
	var arr = chunkSubstr(JSONUtil.toJSON(jsonPadre).replace("\n", ""), 65000);
	if (arr.length > 30) {
		throw "Muchos datos"
	}

	for (i = 0; i < 30; i++) {
		jsonData['jsonModel_' + (i + 1)] = i < arr.length ? arr[i] : ''
	}
	

    for (var i = 0; i < 30; i++) {
        hAPI.setCardValue(["jsonModel_" + (i + 1)], i < arr.length ? arr[i] : "")
            }
    
    log.info('Form data saved.');
}

function chunkSubstr(str, size) {
	var numChunks = Math.ceil(str.length() / size);
	var chunks = new Array(numChunks);

	for (i = 0, o = 0; i < numChunks; ++i, o += size) {
		chunks[i] = str.substr(o, size)
	}
	return chunks
}