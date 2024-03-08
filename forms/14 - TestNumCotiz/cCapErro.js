Vue.component('capturaerro', {
    props:['erro'],
    template: `
    <v-card class="pa-4" outlined>
        <div class="text-h5 mb-4">Captura de resultado Integracion Protheus:</div>
        <div class="mb-4">
            <p><strong>Paso 1:</strong> Diríjase al sistema Protheus</p>
            <p><strong>Paso 2:</strong> Realice las modificaciones pertinentes para que la integracion se realice correctamente</p>
            <br>
            <p> {{ erro }}</p>
            <br>
            <p><strong>Paso 4:</strong> Una vez completado, presione "Enviar".</p>
        </div>
    </v-card>
    `
});
