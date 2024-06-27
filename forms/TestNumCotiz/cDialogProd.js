Vue.component('dialogprod', {

    props: ['dialog', 'itemsproductos'],
  
    data(){
        return {
            search: "",
            dialog: false,
        }
    },
  
    computed: {
        headersProductos() {
          return [
                  { text: 'Código', align: 'center', value: 'codigo', width: '6rem', inputType: 'text', sortable: false },
                  { text: 'Nombre', align: 'center', value: 'nombre', width: '15rem', inputType: 'text', sortable: false },
                  { text: 'Descripcion Larga', align: 'center', value: 'desclarg', width: '18rem', inputType: 'text', sortable: false },
                  { text: 'Stock', align: 'center', value: 'stock', width: '4rem', inputType: 'text', sortable: false },
                  { text: 'Moq', align: 'center', value: 'moq', width: '4rem', inputType: 'text', sortable: false },
                  { text: 'Seleccionar', align: 'center', value: 'seleccion', type: 'icon', width: '4rem', sortable: false},
          ];
        },
    },
  
    methods: {
      
        customFilter(item, queryText, itemText) {
        const searchText = queryText.toLowerCase();
        return (  
            itemText.codigo.toLowerCase().includes(searchText) ||
            itemText.producto.toLowerCase().includes(searchText) ||
            itemText.descripcionL.toLowerCase().includes(searchText) 
        );
        },
  
        handleEscapeClick() {
            this.dialog = false;
            this.$emit('onclosedialog', this.dialog);
        },
  
        eventProductSelect(item){
            this.$emit('productselect', item);
        }
  },
   
    template: `
  
      <v-dialog v-model="dialog" width="85%" height="60%" @keydown.esc="handleEscapeClick" @click:outside="handleEscapeClick">
          <v-card>
          
          <v-container>
              <v-row>
                  <v-card-title>Productos</v-card-title>
                  <v-spacer></v-spacer>
                  <v-col class="d-flex justify-end" cols="12" sm="3" md="3">
                      <v-text-field v-model="search" append-icon="mdi-magnify" label="Buscar" single-line variant="outlined" hide-details></v-text-field>
                  </v-col>
              </v-row>
          </v-container>
      
          <v-data-table :headers="headersProductos" :items="itemsproductos" :search="search"  :custom-filter="customFilter" class="elevation-1 pa-2" item-key="name" no-data-text="No hay datos" mobile-breakpoint="0" style="width:100%;">
              <template v-slot:item="{ item, headers }">
                  <tr>
                      <td v-for="header in headers" :key="header.value" 
                          :class="{'text-center': header.align === 'center', 'text-end': header.align === 'end'}">
                            <template v-if="header.type === 'icon'"> 
                                <v-icon medium @click="eventProductSelect(item)">
                                  mdi-send
                                </v-icon>
                            </template>
                          <template v-else>
                            <template v-if="header.value === 'codigo'"> 
                                {{ item.codigo }}
                            </template>
                            <template v-if="header.value === 'nombre'"> 
                                {{ item.producto }}
                            </template>
                            <template v-if="header.value === 'desclarg'"> 
                                {{ item.descripcionL }}
                            </template>
                            <template v-if="header.value === 'stock'"> 
                                {{ item.stock }}
                            </template>
                            <template v-if="header.value === 'moq'"> 
                                {{ item.moq }}
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
  
      </v-dialog>
      `
  });



//   <v-divider></v-divider>
//           <v-card-actions>
//               <v-spacer></v-spacer>
//               <v-btn @click="closeDialog">Cerrar</v-btn>
//           </v-card-actions>