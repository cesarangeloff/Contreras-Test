function servicetask4(attempt, message) {
	try {
		var actividades = {
			"inicio": 3, //Número de tarea inicial
			"aprobacion": 2, //Número de tarea "Aproación Formulario"
			"finalCust": 5 //Número de tarea final
		}

		var currentActivity = getValue("WKNumState")
		var nextState = getValue("WKNextState")
		var status = 0
		var jsonModel = "";
		for (var i = 1; i <= 30; i++) {
			jsonModel += hAPI.getCardValue("jsonModel_" + i);
		}
		var model = JSON.parse(jsonModel);

		if (actividades.aprobacion == nextState) {
			status = 1
		} else if (actividades.finalCust == nextState) {
			status = model.estado

		}

		idPadre = model.cliente
		form = getValue("WKDef")
		idSolicitud = getValue("WKNumProces")
		estado = status

		var formPadre = getFormPadre(idPadre)
		var newItems = formPadre.items.map(function (item) {
			if (item.formulario == form) {
				data = JSON.parse(item.jsonData)
				var existe = false
				for (i = 0; i < data.length; i++) {
					if (data[i].idSolicitud == idSolicitud) {
						existe = true
						data[i].estado = estado
						data[i].ultimaActualizacion = fechaActual()
					}
				}
				if (!existe) {
					data.push({ "idSolicitud": idSolicitud, "estado": estado, 'fechaCreacion': fechaActual(), 'ultimaActualizacion': fechaActual() })
				}
				item.jsonData = JSONUtil.toJSON(data).replace("\n", "")
				return item
			}
			return item;
		})
		formPadre.items = newItems
		var movementSequence = getMovementSequence(idPadre)

		if (assumeProcessTask(idPadre, movementSequence)) {
			guardoDatos(idPadre, movementSequence, formPadre)
		}


	} catch (err) {
		log.info("=======================> ERRO servicetask4: " + err);
		throw err;

	} finally {
		log.info("=======================> FIM servicetask4");
	}
	return true;
}