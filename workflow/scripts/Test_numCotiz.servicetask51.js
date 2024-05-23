/////////////////////////////////////////////////////////////////////////////////////////
/* 
Tarea de servicio para la inclusión de un Pedido de venta en Protheus
*/
/////////////////////////////////////////////////////////////////////////////////////////

function servicetask51(attempt, message) {
    log.info("################################# ENTRA SERVICE TASK 51 ")
    
	var integrationStatus = "";
	var success = true;
    var constraint= []
    var model = getJsonModel();
    var modelData = JSON.parse(model);

	try {
            
		constraint.push(DatasetFactory.createConstraint("jsonModel", model, model, ConstraintType.MUST));
		constraint.push(DatasetFactory.createConstraint("pedidoVenta", hAPI.getCardValue("pedidoVenta"), hAPI.getCardValue("pedidoVenta"), ConstraintType.MUST));
		constraint.push(DatasetFactory.createConstraint("documento_adjunto", hAPI.getCardValue("documento_adjunto"), hAPI.getCardValue("documento_adjunto"), ConstraintType.MUST));
		
		var dataset = DatasetFactory.getDataset("dsIntegracionProtheus", null, constraint, null);
		
		for (var i=0; i < dataset.getRowsCount(); i++) {
			var status = dataset.getValue(i, 'status');
			var message = dataset.getValue(i, 'message');
			
			if(status == 'ERROR'){
				success = false;
				integrationStatus += status + ": " + message + "\n";
                
                modelData.erroIntegracion=message;
			}
			else{
                integrationStatus += status + ": " + message + "\n";
                log.info("################################# PEDIDO DE VENTA GENERADO ")
                log.info(message)
			    hAPI.setCardValue("pedidoVenta",message);
			}	
		}
		formatFormPadre(modelData);
        
	} catch (ex) {
		integrationStatus = "Internal ERROR: " + ex;
		
	}
	
	
	integrationStatus += "\n --------------------- \n" + hAPI.getCardValue("integrationStatus");
	hAPI.setCardValue("integrationStatus", integrationStatus);
	

	log.info("*** fin integracion Protheus *** ");
	return true;
};




