Vue.component('btnaprobadm', {
    props:['apradm', 'adminapprov'],
    methods: {
        eventAdminApproved($event){
            this.$emit('setadmaprov', $event);
        }  
    },
    template: `
    <v-item-group v-if="apradm" @change="eventAdminApproved($event)" :value="adminapprov">
        <v-container>
            <v-row>
                <v-col cols="12" md="2" offset-md="4">
                    <v-item v-slot="{ active, toggle }" value="A">
                        <v-card :color="active ? 'success' : 'grey'" :outlined="!active"
                            class="d-flex align-center" dark height="50" @click="toggle"
                            :disabled="!apradm">
                            <v-scroll-y-transition>
                                <div class="text-h4 flex-grow-1 text-center">
                                    Aprobar
                                </div>
                            </v-scroll-y-transition>
                        </v-card>
                    </v-item>
                </v-col>
                <v-col cols="12" md="2">
                    <v-item v-slot="{ active, toggle }" value="R">
                        <v-card :color="active ? 'error' : 'grey'" :outlined="!active"
                            class="d-flex align-center" dark height="50" @click="toggle"
                            :disabled="!apradm">
                            <v-scroll-y-transition>
                                <div class="text-h4 flex-grow-1 text-center">
                                    Rechazar 
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
