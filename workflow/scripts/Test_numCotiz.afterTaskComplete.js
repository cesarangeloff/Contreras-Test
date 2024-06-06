function afterTaskComplete(colleagueId,nextSequenceId,userList){
	if (nextSequenceId == 20){
        var userId = getValue("WKUser");
        var processInstanceId = getValue("WKNumProces");
        var comments = "Numero de Pedido Generado: " + hAPI.getCardValue("pedidoVenta");
        hAPI.setTaskComments(userId, processInstanceId, 0, comments);
    }
}