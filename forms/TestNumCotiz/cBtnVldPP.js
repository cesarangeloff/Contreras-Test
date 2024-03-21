Vue.component('btnvldpp', {
    props:['valp', 'validp'],
    methods: {
        eventValidPlazo($event){
            this.$emit('setvalidplazo', $event);
        }  
    },
    template: `
    <v-item-group v-if="valp" @change="eventValidPlazo($event)" :value="validp">
        <v-container>
            <v-row>
                <v-col cols="12" md="2" offset-md="4">
                    <v-item v-slot="{ active, toggle }" value="S">
                        <v-card :color="active ? 'success' : 'grey'" :outlined="!active"
                            class="d-flex align-center" dark height="50" @click="toggle"
                            :disabled="!valp">
                            <v-scroll-y-transition>
                                <div class="text-h4 flex-grow-1 text-center">
                                    Valida
                                </div>
                            </v-scroll-y-transition>
                        </v-card>
                    </v-item>
                </v-col>
                <v-col cols="12" md="2">
                    <v-item v-slot="{ active, toggle }" value="N">
                        <v-card :color="active ? 'error' : 'grey'" :outlined="!active"
                            class="d-flex align-center" dark height="50" @click="toggle"
                            :disabled="!valp">
                            <v-scroll-y-transition>
                                <div class="text-h4 flex-grow-1 text-center">
                                    No valida 
                                </div>
                            </v-scroll-y-transition>
                        </v-card>
                    </v-item>
                </v-col>
            </v-row>
        </v-container>
    </v-item-group>
    `
});
