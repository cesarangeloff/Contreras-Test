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
        var numCotizMax = '';

        
        data = JSON.parse(numCotizModel);
    
        hAPI.setCardValue("numero_revision", data.revision);
        if (data.lRev){
            hAPI.setCardValue("numero_cotizacion", data.numcotiz);
            
        } else {
            numCotizMax = DatasetFactory.getDataset("dsTestMaxNumCotiz", null, null, null);
        
        if (numCotizMax.getValue(0, 'NumCotizMax') != null){
            valorActual= parseInt(numCotizMax.getValue(0, "NumCotizMax"), 10);
        }
        //log.info("VALOR ACTUAL ->>>>>" + valorActual);
        
    
        valorNuevo = valorActual + 1;

        //log.info("VALOR NUEVO  ->>>>>>" + valorNuevo);
        
        valorNuevoComp = formatNumber(valorNuevo, 6);
        //log.info("VALOR NUEVO COMPUESTO ->>>>>>" + valorNuevoComp);
            

        hAPI.setCardValue("numero_cotizacion", valorNuevoComp);
        
        if ( valorNuevoComp != data.numcotiz){
            log.info("*************************************");
            log.info("Se modificará el valor de la cotización por uno nuevo");
            log.info("*************************************");

            data.numcotiz = valorNuevoComp;

            formatFormPadre(data);
        }
        }

		
		//poner aqui la funcion de after process create de ADJUDICACION PEDIDO de los documentos adjuntos    
		criaUrlDocAdj()
        
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

function criaUrlDocAdj(){
    log.info("*************************************");
	log.info("entra en criaUrlDocAdj(afterTaskSave- Adjudicacion)  - inicio");
	log.info("*************************************");
	
	var numeroSolicitud = hAPI.getCardValue("numero_cotizacion");
	var parentFolderId = 26 ; //248 para dev
	var urlConnect = "http://172.16.23.226:8080/portal/p/DEL/ecmnavigation?app_ecm_navigation_doc=" //"http://172.16.23.222:8080/portal/p/DEL/ecmnavigation?app_ecm_navigation_doc=" EN DEV 
	var idFolder = null;	
	var attachments = hAPI.listAttachments();

	// Creo parámetros para la consulta del dataset de documentos
	var constraints = new Array();
	constraints.push(DatasetFactory.createConstraint("documentType", "1", "1", ConstraintType.MUST)); // Tipo carpeta
    constraints.push(DatasetFactory.createConstraint("parentDocumentId", parentFolderId.toString(), parentFolderId.toString(), ConstraintType.MUST));
    constraints.push(DatasetFactory.createConstraint("documentDescription", numeroSolicitud, numeroSolicitud, ConstraintType.MUST));
	// Ejecuto la consulta para ver si existe la carpeta
    var dataset = DatasetFactory.getDataset("document", null, constraints, null);

	if (dataset != null && dataset.rowsCount > 0) {
        idFolder = dataset.getValue(0, "documentPK.documentId");
		log.info('****folderExistente: '+idFolder);
	}else{

		var folderDto = docAPI.newDocumentDto();
		folderDto.setDocumentDescription(numeroSolicitud);
		folderDto.setDocumentType("1");
		folderDto.setParentDocumentId(parentFolderId); //Id de la carpeta principal donde se crearan los documentos
		var folder = docAPI.createFolder(folderDto, null, null);
		idFolder = folder.getDocumentId();
		log.info('****folderNuevo: '+idFolder);
	}
	
		hAPI.setCardValue("documento_adjunto", urlConnect + idFolder); 

		for (var i = 0; i < attachments.size(); i++) {
			var attachment = attachments.get(i);

			docAPI.copyDocumentToUploadArea(
				attachment.getDocumentId(),
				attachment.getVersion()
			);

			attachment.setDocumentId(0);

			attachment.setParentDocumentId(idFolder);

			var attachArray = new java.util.ArrayList();
			var mainAttach = docAPI.newAttachment();

			mainAttach.setFileName(attachment.getPhisicalFile());
			mainAttach.setPrincipal(true);
			mainAttach.setAttach(false);
			attachArray.add(mainAttach);

			attachment.setPublisherId(getValue("WKUser"));
			attachment.setInheritSecurity(true);
	        attachment.setUserNotify(false);
			attachment.setActiveVersion(true);

			try {
				var doc = docAPI.createDocument(
					attachment,
					attachArray,
					null,
					null,
					null
				);
				log.info("DOCUMENTO CREADO CON ID: " + doc.getDocumentId());
			} catch (e) {
				log.error("Problemas en la creación del documento:\n" + e);
			}
		}

}

