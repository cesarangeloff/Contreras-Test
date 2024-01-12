function afterTaskSave(colleagueId,nextSequenceId,userList){
    log.info("==============================================");
	log.info(nextSequenceId);
    log.info("==============================================");
	if (nextSequenceId == 2){
        log.info("*************************************");
        log.info("entra en after task save - inicio");
        log.info("*************************************");
        var constraints = new Array();
        constraints.push(DatasetFactory.createConstraint("sqlLimit", "10", "10", ConstraintType.MUST))
        var dataset = DatasetFactory.getDataset("dsTestNumCotiz", ['numero_cotizacion'], constraints, ['numero_cotizacion DESC']);
        var maxValor = parseInt(dataset.getValue(0, "numero_cotizacion")) + 1 

        hAPI.setCardValue("numero_cotizacion", maxValor.toString());
        // hAPI.setCardValue(JSON.parse(getJsonModel()).numcotiz, maxValor.toString());
    }
	
}