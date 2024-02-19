Vue.component('cargacli', {
    props:['razsoc'],
    template: `
    <v-card class="pa-4" outlined>
        <div class="text-h5 mb-4">Instrucción de carga:</div>
        <div class="mb-4">
            <p><strong>Paso 1:</strong> Diríjase al sistema Protheus</p>
            <p><strong>Paso 2:</strong> Ingrese al maestro de Clientes</p>
            <p><strong>Paso 3:</strong> Cargue los datos necesarios para el cliente: {{razsoc}}</p>
            <p><strong>Paso 4:</strong> Una vez completado, presione "Enviar".</p>
        </div>
    </v-card>
    `
});
