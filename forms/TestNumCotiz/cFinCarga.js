Vue.component('fincargacli', {
	props:['razsoc'],
    template: `
    <v-card class="pa-4" outlined>
		<div class="text-h5 mb-4">Instrucción de finalización:</div>
		<div class="mb-4">
		  <p><strong>Paso 1:</strong> Diríjase al sistema Protheus</p>
		  <p><strong>Paso 2:</strong> Ingrese al maestro de Clientes</p>
		  <p><strong>Paso 3:</strong> Cargue los datos impositivos necesarios para el cliente: <strong>{{ razsoc }}</strong></p>
		  <p><strong>Paso 4:</strong> Una vez completado, refrescar los códigos de clientes y seleccionar el cliente en el formulario presente para poder continuar con la cotización</p>
		  <p><strong>Paso 5:</strong> Presione "Enviar".</p>
		</div>
	</v-card>
    `
});
