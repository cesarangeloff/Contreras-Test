function afterProcessCreate(processId){
    log.info('##### checklist afterProcessCreate')
	log.info(processId)
	hAPI.setCardValue("requestId",processId);
}
