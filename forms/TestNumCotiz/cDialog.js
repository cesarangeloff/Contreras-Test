Vue.component('historial', {

  props: ['dialog'],

  data(){
      return {
          itemsHistorial: this.getHistorial(),
          search: "",
      }
  },

  computed: {
      headersHistorial() {
        return [
                { text: 'Nro. Formulario', align: 'center', value: 'nroForm', width: '3rem', inputType: 'text', sortable: false },
                { text: 'Nro. Cotización', align: 'center', value: 'nroCotiz', width: '6rem', inputType: 'text', sortable: false },
                { text: 'Cliente', align: 'center', value: 'cliente', width: '10rem', inputType: 'text', sortable: false },
                { text: 'Vendedor', align: 'center', value: 'vendedor', width: '8rem', inputType: 'text', sortable: false },
                { text: 'Fecha Emisión', align: 'center', value: 'fechEmis', width: '10rem', inputType: 'text', sortable: false },
                { text: 'Fecha Seguimiento', align: 'center', value: 'fechSeg', width: '10rem', inputType: 'text', sortable: false },
                { text: 'Tipo Cotización', align: 'center', value: 'tipCotiz', width: '10rem', inputType: 'text', sortable: false },
                { text: 'Cotización Asociada', align: 'center', value: 'cotizAsoc', width: '6rem', inputType: 'text', sortable: false },
                // { text: 'Revisión', align: 'center', value: 'revision', width: '6rem', inputType: 'text', sortable: false },
                { text: 'Copiar', align: 'center', value: 'deleteRow', type: 'icon', width: '8rem', sortable: false},
        ];
      },
  },

  methods: {
    getHistorial() {
      var constraints = [];
      var historialResult = [];
      var string = "";
      //constraints.push(DatasetFactory.createConstraint("sqlLimit", "10", "10", ConstraintType.MUST));
      //var dataset = DatasetFactory.getDataset("dsSolicitudCotizacion", ['numero_cotizacion'], constraints, ['numero_cotizacion DESC']);
      
      var historial = DatasetFactory.getDataset("dsSolicitudCotizacion", null, constraints, ['numero_cotizacion ASC']);
    
      for (var j = 0; j < historial.values.length; j++) {
    
        for (var k = 1; k <= 30; k++){
          string = "historial.values["+j+"].jsonModel_"+k+"";
          model = eval(string);
          if (model != ''){
            data = JSON.parse(model);
            data["nroForm"] = historial.values[j].requestId;
            historialResult.push(data);
          }
        }
      }
      
      return historialResult;  
    },

    customFilter(item, queryText, itemText) {
      const searchText = queryText.toLowerCase();
      return (
        itemText.nroForm.includes(searchText) ||
        itemText.numcotiz.includes(searchText) ||
        itemText.razSoc.toLowerCase().includes(searchText) ||
        itemText.tipoCotiz.toLowerCase().includes(searchText)
        // itemText.codVendedor.includes(searchText) ||
      );
    },

    closeDialog() {
      this.dialog = false;
      this.$emit('onclosedialog', this.dialog);
    },

    eventCopyItem(item){
      this.$emit('oncopy', item);
    }
},
 
  template: `

    <v-dialog v-model="dialog" width="1300" height="1100" persistent>
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
    
        <v-data-table :headers="headersHistorial" :items="itemsHistorial" :search="search" :custom-filter="customFilter" class="elevation-1 pa-2" item-key="name" no-data-text="No hay datos" mobile-breakpoint="0" style="width:100%;">
            <template v-slot:item="{ item, headers }">
                <tr>
                    <td v-for="header in headers" :key="header.value" 
                        :class="{'text-center': header.align === 'center', 'text-end': header.align === 'end'}">
                        <template v-if="header.type === 'icon'"> 
                          <v-icon medium @click="eventCopyItem(item)" v-show="!viewMode">
                            mdi-content-copy
                          </v-icon>
                        </template>
                        <template v-else>
                            <template v-if="header.value === 'nroForm'"> 
                                {{ item.nroForm }}
                            </template>
                            <template v-if="header.value === 'nroCotiz'"> 
                                {{ item.numcotiz }}
                            </template>
                            <template v-if="header.value === 'cliente'"> 
                                {{ item.razSoc }}
                            </template>
                            <template v-if="header.value === 'vendedor'"> 
                                {{ item.codVendedor }}
                            </template>
                            <template v-if="header.value === 'fechEmis'"> 
                                {{ item.fecha }}
                            </template>
                            <template v-if="header.value === 'fechSeg'"> 
                                {{ item.fechaSeg }}
                            </template>
                            <template v-if="header.value === 'tipCotiz'"> 
                                {{ item.tipoCotiz }}
                            </template>
                            <template v-if="header.value === 'cotizAsoc'"> 
                                {{ item.cotizAsoc }}
                            </template>
                        </template>
                    </td>
                </tr>
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
    </v-dialog>
    `
});