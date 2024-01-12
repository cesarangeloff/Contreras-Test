function afterTaskSave(colleagueId,nextSequenceId,userList){
    log.info("==============================================");
	log.info(nextSequenceId);
    log.info("==============================================");
	if (nextSequenceId == 2){
        log.info("*************************************");
        log.info("entra en after task save - inicio");
        log.info("*************************************");
        
        var dataset = DatasetFactory.getDataset("dsTestNumCotiz", ['numero_cotizacion'], [], ['numero_cotizacion DESC']);
        var maxValor = parseInt(dataset.getValue(0, "numero_cotizacion")) + 1 
        // var maxValor = parseInt(dataset.getValue(0, "numero_cotizacion"))
        
        // log.info(maxValor.toString());
        hAPI.setCardValue("numero_cotizacion", maxValor.toString());
        // hAPI.setCardValue(JSON.parse(getJsonModel()).numcotiz, maxValor.toString());
        // -consultar dataset trayendo un max 
        // -a ese max, sumarle uno y asignarlo al modelo "numero_cotizacion"
    }
	
}