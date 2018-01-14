<template>
    <div>
      Reaction Wheel Dummy Module Write-Only Content
      <v-btn @click="logDebugMessage({origin: 'alphaHorizonReactionWheel', message: 'A quick test debug message', code: 'TEST_DEBUG_MESSAGE', infoUrl: 'https://opensdcp.github.io/', dismissible: true})">
      Log a debug message
    </v-btn>
    </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  methods: {
    ...mapActions([
      'logDebugMessage'
    ])
  }
}
</script>
