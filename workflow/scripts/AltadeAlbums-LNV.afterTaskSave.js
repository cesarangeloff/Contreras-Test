function afterTaskSave(colleagueId,nextSequenceId,userList){
	hAPI.setCardValue("estado", JSON.parse(getJsonModel()).estado);
	hAPI.setCardValue("colleague", JSON.parse(getJsonModel()).colMatricula);
}
