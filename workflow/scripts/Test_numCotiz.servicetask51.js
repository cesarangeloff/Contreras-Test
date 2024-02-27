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
        // else{
		// 	endpoint += "/v1/solicitudcompra/modificarSC";
		// }


        //   "Pedido": {
        //     "NormalBeneficio": "N",
        //     "CliPro": "02151683",
        //     "Loja": "02",
        //     "CondicionPago": "001",
        //     "xCodigo": "00000023170",
        //     "ListaPrecio": "",
        //     "Moneda": 1,
        //     "Tasa": 1,
        //     "Vendedor1": "000001",
        //     "Vendedor2": "",
        //     "RespTecnico": "",
        //     "Observaciones": "",
        //     "Sector": "",
        //     "TipoPedido": "1",
        //     "OrdenDeCompra": "",
        //     "DireccionEntrega": "",
        //     "ItemsPedidos": [
        //     {
        //       "Codigo": "0002",
        //       "Cantidad": 2,
        //       "PrecioUnitario": 200,
        //       "FechaEntrega": "24/02/21",
        //       "TipoSalida": "528",
        //       "DepositoOrigen": "01",
        //       "DepositoDestino": "",
        //       "AvisoCarga": ""
        //     }
        //     ]
        //   }   
        // }
		
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
                Moneda: "" + modelData.codMoeda,
                // Tasa: 1,
                Vendedor1: "" + modelData.codVendedor,      
                Vendedor2: "",
                
                // TipoPedido: "1",
                // OrdenDeCompra: "",
                // DireccionEntrega: "",
                
                ItemsPedidos: []
				
			},
		}
		
        log.info("################################# MODEL DATA ITEMS: " + (modelData.itemsPrincipal[0].codigo))
    	for (var i=0; i < modelData.itemsPrincipal.length; i++) {
			
			var productoDetalle = {
				Codigo: "" + modelData.itemsPrincipal[i].codigo,
                Cantidad: "" + modelData.itemsPrincipal[i].cantidad,
                PrecioUnitario: "" + modelData.itemsPrincipal[i].precio_neto,
                FechaEntrega: "" + obtenerFecha(modelData.fecha, modelData.itemsPrincipal[i].plazo_entrega ),
                TipoSalida: "528",
                DepositoOrigen: "01",
                DepositoDestino: "",
                AvisoCarga: ""
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
		var response = clientService.invoke(JSON.stringify(data));
	    httpStatus = String(response.getHttpStatusResult());

		if (response.getResult()) {
			var respObj = JSON.parse(response.getResult());
            var cMsgErro = '';
			if (respObj.hasOwnProperty("success")) { 
                log.info("*** Encuentra etiqueta success *** ")
				if(!(respObj.success)){
                    cMsgErro = "*** Error integracion Protheus, error en generacion *** "
					if(respObj.hasOwnProperty("mensaje")){
                        cMsgErro += /* "\r\n" +  */ respObj.mensaje
                        modelData.erroIntegracion = cMsgErro;
                        
                        log.info("*** Formatea modelo reescrito con error *** ");
                        formatFormPadre(modelData);    
                        log.info("*** Formateo de error realizado con exito *** ");
                    }
                    log.info("*** Error integracion Protheus, error en generacion *** ")
                    throw cMsgErro;
				}else{
					if(pedidoVenta == ''){
                        log.info("*** Generacion exitosa, intento de grabacion numero pedventa *** ")
						if(respObj.hasOwnProperty("documento")){
                            hAPI.setCardValue("pedidoVenta",respObj.documento); //
                            log.info("*** Grabacion ped venta exitoso *** ")
                        }
					}
				}

			}
		} else
			throw log.info("*** Error integracion Protheus, no existe resultado *** ");

	} catch (ex) {
		log.info("*** Error integracion Protheus*** ");
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


