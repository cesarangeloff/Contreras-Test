Vue.component('historial', {

  props: ['dialog'],

  data(){
      return {
          itemsHistorial: this.getHistorial(),
          itemsProductos: this.getItemsProd(),
          search: "",
      }
  },

  computed: {
      headersHistorial() {
        return [
                { text: 'Nro. Formulario', align: 'center', value: 'nroForm', width: '3rem', inputType: 'text', sortable: false },
                { text: 'Nro. Cotización', align: 'center', value: 'numcotiz', width: '5rem', inputType: 'text', sortable: false },
                { text: 'Cliente', align: 'center', value: 'razSoc', width: '10rem', inputType: 'text', sortable: false },
                { text: 'Vendedor', align: 'center', value: 'vendedor', width: '6rem', inputType: 'text', sortable: false },
                { text: 'Fecha Emisión', align: 'center', value: 'fecha', width: '6rem', inputType: 'text', sortable: false },
                { text: 'Fecha Seguimiento', align: 'center', value: 'fechaSeg', width: '6rem', inputType: 'text', sortable: false },
                { text: 'Tipo Cotización', align: 'center', value: 'tipoCotiz', width: '5rem', inputType: 'text', sortable: false },
                { text: 'Cotización Asociada', align: 'center', value: 'cotizAsoc', width: '5rem', inputType: 'text', sortable: false },
                { text: 'Nro Revision', align: 'center', value: 'revision', width: '3rem', inputType: 'text', sortable: false },
                { text: 'Copiar', align: 'center', value: 'copy', type: 'icon', width: '4rem', sortable: false},
                { text: 'Revision', align: 'center', value: 'rev', type: 'icon', width: '4rem', sortable: false},
                { text: '', value: 'data-table-expand' }
        ];
      },
      headersItems() {
        return [
                { text: 'Producto', align: 'center', value: 'producto', width: '3rem', inputType: 'text', sortable: false },
                { text: 'Cantidad', align: 'center', value: 'cantidad', width: '6rem', inputType: 'text', sortable: false },
                { text: 'Precio Lista', align: 'center', value: 'precio_lista', width: '10rem', inputType: 'text', sortable: false },
                { text: 'Precio Neto', align: 'center', value: 'precio_neto', width: '8rem', inputType: 'text', sortable: false },
                { text: 'Importe', align: 'center', value: 'importe', width: '10rem', inputType: 'text', sortable: false },
                { text: 'Copiar', align: 'center', value: 'copy', type: 'icon', width: '8rem', sortable: false},
        ];
      },
  },

  methods: {
    getHistorial() {
      var constraints = [];
      var historialResult = [];
      var string = "";
      var historial = DatasetFactory.getDataset("dsTestNumCotiz", null, constraints, ['numero_cotizacion']);
    
      for (var j = 0; j < historial.values.length; j++) {
    
        for (var k = 1; k <= 30; k++){
          string = "historial.values["+j+"].jsonModel_"+k+"";
          model = eval(string);
          if (model != ''){
            data = JSON.parse(model);
            data["nroForm"] = historial.values[j].requestId;
            data["pedVenta"] = historial.values[j].pedidoVenta;
            historialResult.push(data);
          }
        }
      }
      
      return historialResult;  
    },

    getItemsProd() {
      var itemsResult = [];
      var itemsHistorial = this.getHistorial();
    
      for (var k = 0; k < itemsHistorial.length; k++) {

        for (var l = 0; l < itemsHistorial[k].itemsPrincipal.length; l++){
        
          data = itemsHistorial[k].itemsPrincipal[l];
          
          data["nroForm"] = itemsHistorial[k].nroForm;

          itemsResult.push(data);
        }
      }
      
      return itemsResult;  
    },

    expandedItem(item) {
      // Filtrar itemsProductos basado en el nroForm seleccionado
      const filteredDesserts = this.itemsProductos.filter(itemsProducto => itemsProducto.nroForm === item.nroForm);
      
      // Devolver los items filtrados
      return filteredDesserts;
    },

    closeDialog() {
      this.dialog = false;
      this.$emit('onclosedialog', this.dialog);
    },

    eventCopyCotiz(cotiz){
      this.$emit('oncopycotiz', cotiz);
    },

    eventCopyItem(item){
      this.$emit('oncopyitem', item);
    },

    eventRevisionItem(item){
      this.$emit('onrevisionitem', item);
    }
},
 
  template: `

    <v-dialog v-model="dialog" width="85%" height="60%" persistent>
        <v-card>
                <v-container>
            <v-row>
                <v-card-title>Historial Cotizaciones</v-card-title>
                <v-spacer></v-spacer>
                <v-col class="d-flex justify-end" cols="12" sm="3" md="3">
                    <v-text-field v-model="search" append-icon="mdi-magnify" label="Buscar" single-line variant="outlined" hide-details></v-text-field>
                </v-col>
            </v-row>
        </v-container>
    
        <v-data-table 
              :headers="headersHistorial" 
              :items="itemsHistorial"
              item-key="nroForm"
              show-expand 
              :search="search" 
              class="elevation-1 pa-2" no-data-text="No hay datos" mobile-breakpoint="0" style="width:100%;">
            <template v-slot:item.copy="{ item }">
                <v-icon
                    small
                    @click="eventCopyCotiz(item)"
                  >
                            mdi-content-copy
                          </v-icon>
                </template>  

                <template v-slot:item.rev="{ item }">
                  <template v-if="item.pedVenta === ''">
                  <v-icon 
                    small 
                    @click="eventRevisionItem(item)"
                    >
                    mdi-restore
                  </v-icon>
                  </template>
                        </template>
                        
                <template v-slot:expanded-item="{ headers, item }">
                  <td :colspan="headers.length">
                    <v-data-table
                      :headers="headersItems"
                      :items="expandedItem(item)"
                      hide-default-footer
                      class="elevation-1"
                      item-key="nroForm"
                      style="width:100%;"
                      >
                            <template v-slot:item.copy="{ item }">
                            <v-icon
                          small
                          @click="eventCopyItem(item)"
                        >
                          mdi-content-copy
                        </v-icon>
                        </template>
                    </v-data-table>
                    </td>
                            </template>


          <template v-slot:no-results>
            <v-alert :value="true" color="error" icon="mdi-alert">
              No se encontraron coincidencias con "{{ search }}".
            </v-alert>
          </template>
 
        </v-data-table>
        <v-divider></v-divider>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="closeDialog">Cerrar</v-btn>
        </v-card-actions>
<v-card>
    </v-dialog>
    `
});


