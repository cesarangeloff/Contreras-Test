function getFormPadre(idCliente) {
	var constraints = []
	var jsonClientes = ''
	var clientesResult = []
	if (idCliente)
		constraints.push(DatasetFactory.createConstraint('requestId', idCliente, idCliente, ConstraintType.MUST));

	var clientes = DatasetFactory.getDataset('dsCheckList', null, constraints, null);

	if (clientes.rowsCount == 1) {
		jsonClientes = ''
		for (i = 1; i <= 30; i++) {
			jsonClientes += clientes.getValue(0, 'jsonModel_' + i)
		}
		data = JSON.parse(jsonClientes)
	}
	return data
}



function getMovementSequence(idPadre) {
	try {
		var endpoint = '/process-management/api/v2/requests/' + idPadre + '/tasks?status=NOT_COMPLETED';
		var clientService = fluigAPI.getAuthorizeClientService();
		var data = {
			companyId: "" + getValue("WKCompany"),
			serviceCode: "Fluig_rest", //nome do serviço cadastrado no fluig
			endpoint: endpoint,
			method: "GET",
			timeoutService: "100" //segundos
		}
		var response = clientService.invoke(JSON.stringify(data));
		var respObj = JSON.parse(response.getResult());
		if (respObj.hasOwnProperty("items")) { //items
			return respObj.items[0].movementSequence
		} else if (respObj.hasOwnProperty("detailedMessage"))
			throw respObj.detailedMessage;
		else
			throw response.getResult();
	} catch (err) {
		log.info("=======================> ERRO getMovementSequence: " + err);
	} finally {
		log.info("=======================> FIM getMovementSequence");
	}
}


function assumeProcessTask(idPadre, movementSequence) {
	try {
		var endpoint = 'api/public/2.0/workflows/assumeProcessTask';
		var clientService = fluigAPI.getAuthorizeClientService();
		var data = {
			companyId: "" + getValue("WKCompany"),
			serviceCode: "Fluig_rest", //nome do serviço cadastrado no fluig
			endpoint: endpoint,
			method: "POST",
			params: {
				"colleagueId": "aplicacionparaconsumodeserviciosrestfluig",
				"processInstanceId": idPadre,
				"movementSequence": movementSequence
			},
			timeoutService: "100" //segundos
		}
		var response = clientService.invoke(JSONUtil.toJSON(data));
		var respObj = JSON.parse(response.getResult());
		if (respObj.hasOwnProperty("content")) { //items
			if (respObj.content.status == 'SUCCESS') {
				return true
			} else
				throw response.getResult();
		} else
			throw response.getResult();
	} catch (err) {
		log.info("=======================> ERRO assumeProcessTask: " + err);
	} finally {
		log.info("=======================> FIM assumeProcessTask");
	}
}

function guardoDatos(idPadre, movementSequence, newItems) {
	try {
		var endpoint = '/process-management/api/v2/requests/' + idPadre + '/move';
		var httpStatus = "";
		var clientService = fluigAPI.getAuthorizeClientService();
		var jsonData = {
			movementSequence: movementSequence,
			targetState: 50,
			targetAssignee: "aplicacionparaconsumodeserviciosrestfluig",
			comment: "CON_actualizaPadre",
			asManager: false,
			formFields: formatFormPadre(newItems)
		}
		var data = {
			companyId: "" + getValue("WKCompany"),
			serviceCode: "Fluig_rest", //nome do serviço cadastrado no fluig
			endpoint: endpoint,
			method: "POST",
			params: jsonData,
			timeoutService: "100" //segundos
		}

		var response = clientService.invoke(JSON.stringify(data));
		httpStatus = String(response.getHttpStatusResult());
		if (response.getResult()) {
			var respObj = JSON.parse(response.getResult());
			if (respObj.hasOwnProperty("detailedMessage"))
				throw respObj.detailedMessage;

		} else
			throw "Error al obtener resultado de consulta.";

	} catch (err) {
		log.info("=======================> ERRO guardoDatos: " + err);
	} finally {
		log.info("=======================> FIM guardoDatos");
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
	log.info('Form data saved.')
	return jsonData
}

function chunkSubstr(str, size) {
	var numChunks = Math.ceil(str.length() / size);
	var chunks = new Array(numChunks);

	for (i = 0, o = 0; i < numChunks; ++i, o += size) {
		chunks[i] = str.substr(o, size)
	}
	return chunks
}

function fechaActual() {
	var data = new Date();
	var dia = data.getDate();
	var mes = data.getMonth() + 1;
	var ano = data.getFullYear();

	dia = (dia <= 9 ? "0" + dia : dia);
	mes = (mes <= 9 ? "0" + mes : mes);

	var newData = dia + "/" + mes + "/" + ano;

	return newData;
}