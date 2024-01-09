function getJsonModel() {
	var jsonModel = "";
	for (var i=1; i<=30; i++) {
		jsonModel += hAPI.getCardValue("jsonModel_" + i);
	}	
	log.info(jsonModel)
	return jsonModel;
}