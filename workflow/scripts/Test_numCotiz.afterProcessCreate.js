function afterProcessCreate(processId){
    log.info("*************************************");
	log.info("entra en afterProcessCreate  - inicio");
	log.info("*************************************");
	
	log.info('process: '+processId);
	
	hAPI.setCardValue("requestId",processId);

}
