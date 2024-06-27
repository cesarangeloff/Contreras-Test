Vue.component('dialogcli', {

    props: ['dialog', 'itemsclientes'],
  
    data(){
        return {
            search: "",
        }
    },
  
    computed: {
        headersClientes() {
          return [
                  { text: 'Código', align: 'center', value: 'codigo', width: '6rem', inputType: 'text', sortable: false },
                  { text: 'Tienda', align: 'center', value: 'tienda', width: '3rem', inputType: 'text', sortable: false },
                  { text: 'Razón Social', align: 'center', value: 'razsoc', width: '10rem', inputType: 'text', sortable: false },
                  { text: 'Cuit', align: 'center', value: 'cuit', width: '8rem', inputType: 'text', sortable: false },
                  { text: 'Dirección', align: 'center', value: 'dir', width: '10rem', inputType: 'text', sortable: false },
                  { text: 'Provincia', align: 'center', value: 'provincia', width: '6rem', inputType: 'text', sortable: false },
                  { text: 'Seleccionar', align: 'center', value: 'seleccion', type: 'icon', width: '8rem', sortable: false},
          ];
        },
    },
  
    methods: {
      
          customFilter(item, queryText, itemText) {
            const searchText = queryText.toLowerCase();
            return (   
              itemText.cod.toLowerCase().includes(searchText) ||
              itemText.loja.includes(searchText) ||
              itemText.name.toLowerCase().includes(searchText) ||
              itemText.direccion.toLowerCase().includes(searchText) ||
              itemText.provincia.toLowerCase().includes(searchText) ||
              itemText.cuit.includes(searchText)
            );
          },
  
        handleEscapeClick() {
        this.dialog = false;
        this.$emit('onclosedialog', this.dialog);
      },
  
      eventClientSelect(item){
        this.$emit('clientselect', item.cod);
      }
  },
   
    template: `
  
      <v-dialog v-model="dialog" width="85%" height="60%" @keydown.esc="handleEscapeClick" @click:outside="handleEscapeClick">
          <v-card>
          
          <v-container>
              <v-row>
                  <v-card-title>Clientes</v-card-title>
                  <v-spacer></v-spacer>
                  <v-col class="d-flex justify-end" cols="12" sm="3" md="3">
                      <v-text-field v-model="search" append-icon="mdi-magnify" label="Buscar" single-line variant="outlined" hide-details></v-text-field>
                  </v-col>
              </v-row>
          </v-container>
      
          <v-data-table :headers="headersClientes" :items="itemsclientes" :search="search"  :custom-filter="customFilter" class="elevation-1 pa-2" item-key="name" no-data-text="No hay datos" mobile-breakpoint="0" style="width:100%;">
              <template v-slot:item="{ item, headers }">
                  <tr>
                      <td v-for="header in headers" :key="header.value" 
                          :class="{'text-center': header.align === 'center', 'text-end': header.align === 'end'}">
                          <template v-if="header.type === 'icon'"> 
                            <v-icon medium @click="eventClientSelect(item)" v-show="!viewMode">
                              mdi-send
                            </v-icon>
                          </template>
                          <template v-else>
                              <template v-if="header.value === 'codigo'"> 
                                  {{ item.cod }}
                              </template>
                              <template v-if="header.value === 'tienda'"> 
                                  {{ item.loja }}
                              </template>
                              <template v-if="header.value === 'razsoc'"> 
                                  {{ item.name }}
                              </template>
                              <template v-if="header.value === 'cuit'"> 
                                  {{ item.cuit }}
                              </template>
                              <template v-if="header.value === 'dir'"> 
                                  {{ item.direccion }}
                              </template>
                              <template v-if="header.value === 'provincia'"> 
                                  {{ item.provincia }}
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