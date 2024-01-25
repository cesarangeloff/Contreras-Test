function afterTaskSave(colleagueId,nextSequenceId,userList){
    log.info("==============================================");
	log.info(nextSequenceId);
    log.info("==============================================");
	if (nextSequenceId == 7){
        log.info("*************************************");
        log.info("entra en after task save - inicio");
        log.info("*************************************");
        var constraints = new Array();
        var valorActual = 0;
        var valorNuevo = 0;
        constraints.push(DatasetFactory.createConstraint("sqlLimit", "10", "10", ConstraintType.MUST))
        var dataset = DatasetFactory.getDataset("dsSolicitudCotizacion", ['numero_cotizacion'], constraints, ['numero_cotizacion DESC']);
    
        if (dataset.rowsCount > 0){
            if (dataset.getValue(0, 'numero_cotizacion') != ''){
                valorActual = parseInt(dataset.getValue(0, "numero_cotizacion"));
            }
        }
        
        valorNuevo = valorActual + 1;
        hAPI.setCardValue("numero_cotizacion", valorNuevo.toString());

        // hAPI.setCardValue(JSON.parse(getJsonModel()).numcotiz, maxValor.toString());
    }
	
}