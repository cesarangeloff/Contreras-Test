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
data(){
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
			  	:server-items-length="rows.length">
			  
				  <template v-slot:item="{ item, headers }">
			        <tr>
			          <td v-for="header in headers" :key="header.value">
			            <template v-if="header.value === 'nomrow'">
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
			            </template>
			          </td>
			        </tr>
			      </template>
			  </v-data-table>
			</div>
  `
})