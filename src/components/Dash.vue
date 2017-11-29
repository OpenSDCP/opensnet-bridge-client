<template lang="html">
    <div id="app">
      <v-card>
        <!-- <v-card-title>
          <h3 class="headline">Dashboard</h3>
        </v-card-title>
        <v-card-title> -->

        </v-card-title>
      </v-card>
              <v-card-text>
                <b  class="px-2">Current layout's counted name:</b>
                Layout {{ currentLayoutIndex }}
                <br>
                <v-btn
                  v-for="dashboardLayout in updateDashboardLayouts()"
                  :key="dashboardLayout.index"
                  @click="selectDashboardLayout(dashboardLayout.index)"
                >
                  Load  dashboard {{ dashboardLayout.name }}
                </v-btn>
                <v-btn
                  v-for="dashboardLayout in updateDashboardLayouts()"
                  :key="dashboardLayout.name"
                  @click="deleteDashboardLayout(dashboardLayout.index)"
                  error
                >
                  Delete  dashboard {{ dashboardLayout.name }}
                </v-btn>
                <br>
                <v-btn success @click="addItem(currentLayout)">Insert module into current layout modes</v-btn>
                <v-btn success @click="addMultipleItems(layoutMdAndUp, layoutSmAndDown)">Insert module into all layout modes</v-btn>
                <br>
                <v-btn error @click="removeItem(this.item, currentLayout)">Remove module from all layout modes</v-btn>
                <v-btn error @click="removeMultipleItems(this.item, layoutMdAndUp, layoutSmAndDown)">Remove module from all layout modes</v-btn>
                <br>
                <v-btn
                  info
                  @click="changeDashboardModeTo(layoutSmAndDown)"
                  v-if="thisLayoutIsNotLoaded(layoutSmAndDown)"
                >
                  Change to mobile mode
                </v-btn>
                <v-btn
                  info
                  @click="changeDashboardModeTo(layoutMdAndUp)"
                  v-if="thisLayoutIsNotLoaded(layoutMdAndUp)"
                >
                  Change to desktop mode
                </v-btn>
                <v-btn warning @click="createDashboardLayout">
                  Create dashboard
                </v-btn>
                <v-flex xs12 class="px-2">
                  <v-checkbox label="Items are draggable"
                              v-model="draggable"
                              hide-details></v-checkbox>
                  <v-checkbox label="Items are resizable"
                              v-model="resizable"
                              hide-details></v-checkbox>
                </v-flex>
              </v-card-text>
            </v-card>

            <!-- Grid Wrapper section -->
            <grid-layout
                    :layout="currentLayout"
                    :col-num="12"
                    :row-height="rowHeight"
                    :is-draggable="draggable"
                    :is-resizable="resizable"
                    :vertical-compact="true"
                    :use-css-transforms="true"
            >
                <!-- Grid Item Section -->
                <grid-item v-for="item in currentLayout" :key="item.i"
                           :x="item.x"
                           :y="item.y"
                           :w="item.w"
                           :h="item.h"
                           :min-w="4"
                           :min-h="11"
                           :i="item.i"
                           @resize="resize"
                           @move="move"
                           @resized="resized"
                           @moved="moved"
                           drag-allow-from=".vue-draggable-handle"
                           drag-ignore-from=".no-drag"
                           :item="item"
                           :text="item.i"
                           :layout="currentLayout"
                >
                </grid-item>
            </grid-layout>
    </div>
</template>

<script>
/* eslint-disable */
var testLayout = [
	    {"x":0,"y":0,"w":2,"h":2,"i":"0"},
	    {"x":2,"y":2,"w":2,"h":4,"i":"1"},
	    {"x":4,"y":0,"w":2,"h":5,"i":"2"},
	    {"x":6,"y":0,"w":2,"h":3,"i":"3"},
	];


import Vue from 'vue'
import Vuetify from 'vuetify'
import vMediaQuery from 'v-media-query'
import VueGridLayout from 'vue-grid-layout'
import GridLayout from '@/components/Grid/Layout'
import GridItem from '@/components/Grid/Item'

Vue.use(Vuetify)
Vue.use(vMediaQuery)
Vue.use(VueGridLayout)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
})

export default {
  components: {
    'grid-layout' : GridLayout ,
	  'grid-item' : GridItem,
  },
  data () {
            return {
                dashboardLayouts: {
                  layout1: {
                    name: 'Layout 1',
                    index: '1',
                    mobile: [
                      {"x":0,"y":0,"w":12,"h":11,"i":"0", resizable: true, draggable: true},
                      {"x":0,"y":0,"w":12,"h":11,"i":"1", resizable: true, draggable: true},
                    ],
                    desktop: [
                      {"x":0,"y":0,"w":6,"h":11,"i":"0", resizable: true, draggable: true},
                      {"x":6,"y":0,"w":6,"h":11,"i":"1", resizable: true, draggable: true},
                    ],
                  },
                },
                // Initialy selected dashboard layouts
                initiallySelectedLayoutName: 'this.dashboardLayouts.layout1',
                initiallySelectedLayout: null,
                // Current grid layout that has been loaded
                currentLayout:  null,
                layoutToCheckFor: null,
                // Current desktop grid layout
                layoutMdAndUp: null,
                // Current mobile grid layout
                layoutSmAndDown: null,
                // Display usefull information about the current state of the grid
                currentLayoutName: null,
                currentLayoutIndex: null,
                // Wether the grid's elements are draggable/resizable
                draggable: true,
                resizable: true,
                // Choose the resolution of the grid
                rowHeight: 30,
                colNum: 0,
                index: 0
            }
        },
        watch: {
          // Make the layout responsive when resizing
          '$mq.resize': 'layoutResponsiveMaker'
        },
        created() {
          // Assign the initial dashboard layout to the one that will be loaded
          this.assignDashboardLayouts()
          // Load the initial dashboard layout
          this.loadDashboardLayout(this.initiallySelectedLayout)
          // Set the index of the layout to the amount of elements in the mdAndUp-Layout
          this.index = this.layoutMdAndUp.length;
        },
        methods: {
            // Helper function to make loading dashboard layouts simpler
            selectDashboardLayout: function(index) {
              var dashboardToSelect = eval('this.dashboardLayouts.layout' + index)
              this.loadDashboardLayout(dashboardToSelect)
            },
            // The function that actually loads the dashboard layouts
            loadDashboardLayout: function(layoutToLoad) {
              this.currentLayout = layoutToLoad.mobile
              this.layoutSmAndDown = layoutToLoad.mobile
              this.layoutMdAndUp = layoutToLoad.desktop
              this.currentLayoutName = layoutToLoad.name
              this.currentLayoutIndex = layoutToLoad.index
            },
            // Loop through dashboard layouts and assign them to a helper array for easiser access
            updateDashboardLayouts: function() {
              var i = 0
              var numberOfDashboardLayouts = Object.keys(this.dashboardLayouts).length;
              var updateDashboardLayouts = []
              for (i = 1; i <= numberOfDashboardLayouts; i++) {
                var dashboardLayoutProperties = {}
                if(this.dashboardLayouts.hasOwnProperty('layout' + i)) {
                  dashboardLayoutProperties.name = eval('this.dashboardLayouts.layout' + i + '.name')
                  dashboardLayoutProperties.index = i
                  updateDashboardLayouts.push(dashboardLayoutProperties)
                }
              }
              return updateDashboardLayouts
            },
            // Provide an option to log the dashboard layouts into the console for debugging
            logDashboardLayouts: function() {
              console.log(this.dashboardLayouts)
            },
            // Create a new dashboard layout and navigate to it
            createDashboardLayout: function() {
              this.tmpLayoutSmAndDown = []
              this.tmpLayoutMdAndUp = []
              var newDashboardLayoutObjectName = 'layout' + (Object.keys(this.dashboardLayouts).length + 1)
              console.log(newDashboardLayoutObjectName)
              this.dashboardLayouts[newDashboardLayoutObjectName] = {}
              var newDashboardLayoutName = 'Layout ' + (Object.keys(this.dashboardLayouts).length)
              this.dashboardLayouts[newDashboardLayoutObjectName].name = newDashboardLayoutName
              this.dashboardLayouts[newDashboardLayoutObjectName].index = Object.keys(this.dashboardLayouts).length
              this.dashboardLayouts[newDashboardLayoutObjectName].mobile = this.tmpLayoutSmAndDown
              this.dashboardLayouts[newDashboardLayoutObjectName].desktop = this.tmpLayoutMdAndUp
              this.rejoinTemporaryDashboardSubLayouts()
              console.log(this.dashboardLayouts)
              this.updateDashboardLayouts()
              this.selectDashboardLayout(Object.keys(this.dashboardLayouts).length)
            },
            // Delete a dashboard layout and navigate to the last one to prevent glitching
            deleteDashboardLayout: function(dashboardLayoutToDelete) {
              var dashboardLayoutNameToDelete = 'layout' + dashboardLayoutToDelete
              delete this.dashboardLayouts[dashboardLayoutNameToDelete]
              this.updateDashboardLayouts()
              this.selectDashboardLayout(Object.keys(this.dashboardLayouts).length)
            },
            // Reassign the temporary sublayouts created with the createDashboardLayout function and assign them to the ones that are loaded
            rejoinTemporaryDashboardSubLayouts: function() {
              this.layoutSmAndDown = this.tmpLayoutSmAndDown
              this.layoutMdAndUp = this.tmpLayoutMdAndUp
            },
            // Assign the intial layout with the content of the set variable
            assignDashboardLayouts: function() {
              this.initiallySelectedLayout = eval(this.initiallySelectedLayoutName)
            },
            // Make trigger mobile/desktop mode (make UI responsive) by activing the right layout accordingly
            layoutResponsiveMaker: function() {
              if (this.$mq.below(1024)) {
                this.changeDashboardModeTo(this.layoutSmAndDown)
              } else {
                this.changeDashboardModeTo(this.layoutMdAndUp)
              }
            },
            // Check whether desktop of mobile mode is activated to show/hide the switching button
            thisLayoutIsNotLoaded: function(layoutToCheckFor) {
              var isLoaded = null
              if (this.currentLayout === eval(layoutToCheckFor)) {
                isLoaded = false
              } else {
                isLoaded = true
              }
              return isLoaded
            },
            // Change between mobile and desktop modes
            changeDashboardModeTo: function(modeToChangeTo) {
              this.currentLayout = modeToChangeTo
            },
            // Remove last item from a layout in one mode
            removeItem: function(item, layoutToRemoveItemFrom) {
                layoutToRemoveItemFrom.splice(layoutToRemoveItemFrom.indexOf(item), 1);
            },
            // Remove last item from layout in both modes
            removeMultipleItems: function(item, layout1ToRemoveItemFrom, layout2ToRemoveItemFrom) {
                layout1ToRemoveItemFrom.splice(layout1ToRemoveItemFrom.indexOf(item), 1);
                layout2ToRemoveItemFrom.splice(layout2ToRemoveItemFrom.indexOf(item), 1);
            },
            // Add item to the end of the layout in one mode
            addItem: function(layoutToAddItemTo) {
                var self = this;
                var item = {"x":0,"y":0,"w":12,"h":11,"i":this.index+"", whatever: "bbb"};
                this.index++;
                layoutToAddItemTo.push(item);
            },
            // Add item to the end of the layout in both modes
            addMultipleItems: function(layout1ToAddItemTo, layout2ToAddItemTo) {
                var self = this;
                var item = {"x":0,"y":0,"w":12,"h":11,"i":this.index+"", whatever: "bbb"};
                this.index++;
                layout1ToAddItemTo.push(item);
                layout2ToAddItemTo.push(item);
            },
            // Vue-grid-layout helper functions
            move: function(i, newX, newY){
                console.log("MOVE i=" + i + ", X=" + newX + ", Y=" + newY);
            },
            resize: function(i, newH, newW){
                console.log("RESIZE i=" + i + ", H=" + newH + ", W=" + newW);
            },
            moved: function(i, newX, newY){
                console.log("### MOVED i=" + i + ", X=" + newX + ", Y=" + newY);
            },
            resized: function(i, newH, newW, newHPx, newWPx){
                console.log("### RESIZED i=" + i + ", H=" + newH + ", W=" + newW + ", H(px)=" + newHPx + ", W(px)=" + newWPx);
            },
        },
}
</script>

<style lang="css">
</style>
