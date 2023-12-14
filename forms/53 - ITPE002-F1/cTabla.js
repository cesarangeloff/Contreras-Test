Vue.component('c-tabla', {
  props: {
    columns: {
      type: Array,
      default: []
    },
    rows: {
      type: Array,
      default: []
    },
    titletable: {
      type: String,
      default: ''
    },
  },
  data() {
    return {
      loading: false,
      pagination: {
        page: 1,
        itemsPerPage: 10,
        sortBy: [],
        sortDesc: []
      },
    }
  },
  methods: {
    updateValue(value, row, key) {
      row[key] = value;
    }
  },
  template: `
<div>
  <h3 v-if="titletable != ''" class="text-center"> {{titletable}} </h3>
  <v-data-table
    :headers="columns"
    :items="rows"
    class="elevation-1"
    item-key="name"
    :options.sync="pagination"
  	:server-items-length="rows.length"
  >
  <template v-slot:item="{ item, headers }">
        <tr>
          <td v-for="header in headers" :key="header.value">
            <template v-if="header.value === 'formulario'">
              {{ item[header.value] }}
            </template>
            <template v-else>
              <template v-if="header.type === 'input'">
                <v-text-field
                  v-model="item[header.value]"
                  @input="updateValue($event, item, header.value)"
                  class="align-center"
                ></v-text-field>
              </template>
              <template v-else-if="header.type === 'switch'">
                <v-switch
                  color="success"
                  v-model="item[header.value]"
                  @change="updateValue($event, item, header.value)"
                  class="align-center"
                ></v-switch>
              </template>
              <template v-else-if="header.type === 'slider'">
                <v-slider
        		  v-model="item[header.value]"
        		  step="10"
        		  :track-fill-color="success"
				  color="success"
        		  ticks
        		  hide-details
      			>
      			  <template v-slot:append>
              		<v-text-field
                		v-model="item[header.value]"
                		class="mt-0 pt-0"
                		hide-details
                		single-line
                		type="number"
                		style="width: 60px"
              		></v-text-field>
            	  </template>
      			</v-slider>
              </template>
            </template>
          </td>
        </tr>
      </template>
  </v-data-table>
</div>
  `,
})