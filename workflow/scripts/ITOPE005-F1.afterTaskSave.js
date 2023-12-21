function afterTaskSave(colleagueId, nextSequenceId, userList) {
	var actividades = {
		"inicio": 3, //Número de tarea inicial
		"aprobacion": 2, //Número de tarea "Aproación Formulario"
		"finalCust": 5 //Número de tarea final
	}

	var currentActivity = getValue("WKNumState")
	var status = 0
	var model = JSON.parse(getJsonModel());
	var constraints = [];

	log.info('#############################################################')
	log.info(nextSequenceId)
	log.info(actividades.aprobacion)

	if (actividades.aprobacion == nextSequenceId) {
		status = 1
	} else if (actividades.finalCust == nextSequenceId) {
		status = model.estado
	}

	constraints.push(DatasetFactory.createConstraint("idPadre", model.cliente, model.cliente, ConstraintType.MUST))
	constraints.push(DatasetFactory.createConstraint("form", getValue("WKDef"), getValue("WKDef"), ConstraintType.MUST))
	constraints.push(DatasetFactory.createConstraint("idSolicitud", getValue("WKNumProces"), getValue("WKNumProces"), ConstraintType.MUST))
	constraints.push(DatasetFactory.createConstraint("status", status, status, ConstraintType.MUST))

	var dataset = DatasetFactory.getDataset("CON_actualizaPadre", null, constraints, null);
	
	log.info('TESTMEM 004-F2 afterTaskSave')
	
	if (dataset.getRowsCount() > 0) {
		log.info('resultados')
	}
}