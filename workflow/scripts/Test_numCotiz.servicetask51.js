/////////////////////////////////////////////////////////////////////////////////////////
/* 
Tarea de servicio para la inclusión de un Pedido de venta en Protheus
*/
/////////////////////////////////////////////////////////////////////////////////////////

function servicetask51(attempt, message) {
    log.info("################################# ENTRA SERVICE TASK 51 ")

	try {
		
		var pedidoVenta = hAPI.getCardValue("pedidoVenta");
		var endpoint = "";
		var model = getJsonModel();
        var modelData = JSON.parse(model);
        log.info("##### PEDIDO VENTA:" + pedidoVenta);
		if(pedidoVenta == ''){
			endpoint += "/api/v1/APIPedVentas";
		}
        log.info("##### Endpoint:" + endpoint);
        
		
        log.info("################################# MODEL DATA: " + JSON.stringify(modelData))
		var jsonData = {
            Pedido: {
                // empresa: "" + hAPI.getCardValue("codigoEmpresa"),
				// fechaEmision: "" + obtenerFecha(modelData.fecha,0),

                NormalBeneficio: "N",//Agregado en dudas azure
                CliPro: "" + modelData.codCli,
                Loja: "" + modelData.lojaCli,
                CondicionPago: "" + modelData.codPago,

                ListaPrecio: "" + modelData.listaPrecio,
                DescuentoCli: "" + modelData.dtoCliente, 
                Moneda: "" + modelData.codMoeda,
                // Tasa: 1,  //TODO DE DONDE SACAR LA TASA, ACTUALMENTE NO SE MANDA NADA
                Vendedor1: "" + modelData.codVendedor,      
                
                TipoPedido: "1",
                // OrdenDeCompra: "",
                // DireccionEntrega: "",
                // FormaEntrega: "5",  //TODO DE DONDE SACAR ESTO 
                
                ItemsPedidos: []
				
			},
		}
		
        log.info("################################# MODEL DATA ITEMS: " + (modelData.itemsPrincipal[0].codigo))
    	for (var i=0; i < modelData.itemsPrincipal.length; i++) {
			
			var productoDetalle = {
				Codigo: "" + modelData.itemsPrincipal[i].codigo,
                Cantidad: "" + modelData.itemsPrincipal[i].cantidad,
                PrecioUnitario: "" + modelData.itemsPrincipal[i].precio_lista,
                PrecioVenta: "" + modelData.itemsPrincipal[i].precio_neto,
                Importe: "" + modelData.itemsPrincipal[i].importe,
                FechaEntrega: "" + obtenerFecha(modelData.fecha, modelData.itemsPrincipal[i].plazo_entrega ),
			}
			
			jsonData.Pedido.ItemsPedidos.push(productoDetalle);
			
		}
		
        log.info("##### Endpoint:" + endpoint);
        var httpStatus = "";

	    var clientService = fluigAPI.getAuthorizeClientService();
	    var data = {
	    	companyId: getValue("WKCompany") + '',
	    	serviceCode: "api_protheus",
	    	endpoint: endpoint,
	    	method: "POST",
	    	params: jsonData,
	        options : {
	         	encoding : 'UTF-8',
	         	mediaType: 'application/json',
	        },
	        headers: {
	             'Content-Type': 'application/json;charset=UTF-8',
                 'Tenantid': '01,0101' //TODO VER ESTO, QUE NO VAYA HARDCODEADO
	        },
	    	timeoutService: "100"
	    }
	    
	    log.info("################################# JSON: " + JSON.stringify(data))
	    log.info("################################# PREVIO AL INVOKE " )
		var response = clientService.invoke(JSON.stringify(data));
	    log.info("################################# DESPUES DE INVOKE " )
	    httpStatus = String(response.getHttpStatusResult());
	    log.info("################################# GET STATUS " )
        
	    log.info("################################# PREGUNTA POR RESULTADO " )
	    log.info("################################# RESULTADO :" + response.getResult() )
        
		var lResponse = !!response.getResult()

        if (lResponse) {

            log.info("################################# ENTRA AL IF DE RESPONSE " )
            var respObj = JSON.parse(response.getResult());
            var cMsgErro = '';

			if (respObj.hasOwnProperty("SUCCESS")) { 
                log.info("*** Encuentra etiqueta success *** ")
                log.info("*** '" + respObj.SUCCESS + "' *** ")
                
				if(!!respObj.SUCCESS){ //Se niega dos veces para contextualizar la variable, ya que viene 'false'/'true' como string
                    cMsgErro = "*** Error integracion Protheus, error en generacion *** "
					if(respObj.hasOwnProperty("MENSAJE")){
                        cMsgErro += /* "\r\n" +  */ respObj.MENSAJE
                        log.info(cMsgErro);
                        log.info("*** antes de describir error *** ");
                        log.info(modelData.erroIntegracion);
                        modelData.erroIntegracion = cMsgErro;
                        modelData.abrevMoe = 'USD';
                        log.info("*** despues de describir error *** ");
                        log.info(modelData.erroIntegracion);
                        
                        log.info("*** Formatea modelo reescrito con error *** ");
                        formatFormPadre(modelData);    
                        log.info("*** Formateo de error realizado con exito *** ");
                    }
                    log.info("*** Error integracion Protheus, error en generacion *** ")
                    throw cMsgErro;
                }else{
                    if(pedidoVenta == ''){
                        log.info("*** Generacion exitosa, intento de grabacion numero pedventa *** ")
                        if(respObj.hasOwnProperty("DOCUMENTO")){
                            if(!(respObj.DOCUMENTO == '')){
                                hAPI.setCardValue("pedidoVenta",respObj.DOCUMENTO); //
                                log.info("*** Grabacion ped venta exitoso *** ")
                            }
                        }
                    }
				}

			}else{
                throw "Error al obtener el resultado de la consulta. No se encontro la propiedad Success";
            }
		} else{
            log.info("*** Error integracion Protheus, no existe resultado *** ");
			throw "Error al obtener el resultado de la consulta.";
        }
	} catch (ex) {
		log.info("*** Error integracion Protheus*** ");
        hAPI.setCardValue("pedidoVenta",'000123');
		throw ex;
	}
	log.info("*** fin integracion Protheus *** ");
	return true;
};

function obtenerFecha(fechaString, plazoEntrega) {
    var partesFechas = fechaString.split("/");
    var fechaEmision = new Date(partesFechas[2], partesFechas[1]-1, partesFechas[0]);
    var fechaEntrega = new Date();

    fechaEntrega.setDate(fechaEmision.getDate() + parseInt(plazoEntrega));

    return (formatoFecha(fechaEntrega))
};


function formatoFecha(fecha){
    var mes = fecha.getMonth()+1;
    var dia = fecha.getDate();
    var ano = fecha.getFullYear().toString().slice(-2);
    if(dia<10)
    dia='0'+dia;
    if(mes<10)
    mes='0'+mes
    
    return dia+"/"+mes+"/"+ano;
    
};


