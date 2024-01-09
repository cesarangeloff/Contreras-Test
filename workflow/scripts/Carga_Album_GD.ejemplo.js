/////////////////////////////////////////////////////////////////////////////////////////
/* 
	Función que valida si la carga del album fue Aprobada o En Revisión.
*/
/////////////////////////////////////////////////////////////////////////////////////////

function estaAprobada() {
    var model = ''
    for (var i = 1; i <= 30; i++) {
        model += hAPI.getCardValue('jsonModel_' + i) || '';
    }
    model = JSON.parse(model);
    if(model.decisionAprobacion == 'Aprobado'){
        return true
    }
    return false
};