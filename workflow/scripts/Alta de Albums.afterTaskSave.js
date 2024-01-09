function afterTaskSave(colleagueId,nextSequenceId,userList){
	var actividades = {
			"inicio": 4,
			"aprobacion": 5,
			"final": 9 
		}	
	
	if (actividades["final"] == nextSequenceId) {
		hAPI.setCardValue("estado", 1)
	}
}