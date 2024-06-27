Vue.component('infoatajos', {

	props:['dialog'],

    methods: {
        closeDialog(){
            this.dialog = false;
            this.$emit('onclosedialog', this.dialog);
        }
    },

    template: `
    <v-dialog
      v-model="dialog"
      width="500"
      persistent>

      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          Atajos de teclado
        </v-card-title>

        <v-card-text>
            <strong>
            1) alt + c : Agrega un nuevo item especial complejo<br>
            2) alt + u : Abre url de anexos<br>
            3) alt + r : Agrega nuevo item estándar<br>
            4) alt + h : Abre el dialog historial<br>
            5) alt + p : Descarga pdf de cotización<br>
            </strong>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="closeDialog"
          >
            Cerrar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    `
});