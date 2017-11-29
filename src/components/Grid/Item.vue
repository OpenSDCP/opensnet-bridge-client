<style>
  /* Make the cards full height and let the footer section float to the bottom */
  .resizable-card-wrapper {
    height: 100%!important;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
  }
  /* Center elements in the inner cards section */
  .resizable-card-wrapper-section-main {
    flex: 0 1 auto!important;
  }
  /* Make vue-grid-layout colors uniform */
  .vue-grid-item:not(.vue-grid-placeholder) {
    background: transparent;
    border: 0;
  }
  .vue-grid-layout {
    background: transparent;
  }
  /* Make the drag handle uniform with the rest of the ui */
  .vue-draggable-handle {
    position: absolute;
    width: auto!important;
    height: auto!important;
    top: auto!important;
    height: auto!important;
    background: transparent!important;
    background-position: bottom right;
    padding: 0!important;
    background-repeat: no-repeat;
    background-origin: content-box;
    box-sizing: border-box;
    cursor: pointer;
    right: 0px!important;
  }
  /* Add spacing to cards on md and up to distinguish cards */
  .read-card-spacing {
    margin-right: 8px;
  }
  .hybrid-card-spacing {
    margin-right: 8px;
    margin-left: 8px;
  }
  .write-card-spacing {
    margin-left: 8px;
  }
  /* Fix the card's breadcrumb's spacing */
  .first-breadcrumb-item .breadcrumbs__item {
    padding-left: 0;
  }
  /* Make the resize card's resize handle go to the right spot */
  .card-resize-handle {
    /* bottom: -15px; */
    /* left: -7px; */
  }
  .card-footer-section {
    padding-bottom: 0!important;
    padding-left: 0!important;
    padding-right: 2px!important;
  }
</style>

<template>
    <div ref="item"
         class="vue-grid-item"
         :class="{ 'vue-resizable' : resizable, 'resizing' : isResizing, 'vue-draggable-dragging' : isDragging, 'cssTransforms' : useCssTransforms }"
         :style="style"
    >
        <slot></slot>
        <v-card class="resizable-card-wrapper">

          <!-- Card Header Section-->
          <v-card-title>
            <v-layout row align-center>

              <v-breadcrumbs divider="/" class="pa-0">
                <v-breadcrumbs-item class="first-breadcrumb-item" v-show="!cardMobileMode">
                  Group
                </v-breadcrumbs-item>
                <v-breadcrumbs-item>
                  Module
                </v-breadcrumbs-item>
              </v-breadcrumbs>

              <v-spacer></v-spacer>

              <!-- VCS Section -->
              <v-card class="mr-2">
                <v-layout row class="top-toolbar-group top-toolbar-group-upload">
                  <v-flex xs6>
                    <v-btn
                           icon
                           v-tooltip:bottom="{ html: 'Undo last action on this module', visible: topToolbar.tooltips.active }"
                           class="top-toolbar-item top-toolbar-item-upload-1"
                           >
                      <v-icon>undo</v-icon>
                    </v-btn>
                  </v-flex>
                  <v-flex xs6>
                    <v-btn
                           icon
                           v-tooltip:bottom="{ html: 'Redo last action on this module', visible: topToolbar.tooltips.active }"
                           class="top-toolbar-item top-toolbar-item-upload-1"
                           >
                      <v-icon>redo</v-icon>
                    </v-btn>
                  </v-flex>
                </v-layout>
              </v-card>

              <!-- Options Section -->
              <v-card class="mx-2" v-if="!cardMobileMode">
                <v-layout row class="top-toolbar-group top-toolbar-group-upload">
                  <v-flex xs4>
                    <v-btn
                           icon
                           v-tooltip:bottom="{ html: 'Pin to top', visible: topToolbar.tooltips.active }"
                           class="top-toolbar-item top-toolbar-item-upload-1"
                           >
                      <v-icon>place</v-icon>
                    </v-btn>
                  </v-flex>
                  <v-flex xs4>
                    <v-btn
                           icon
                           v-tooltip:bottom="{ html: 'Edit source code', visible: topToolbar.tooltips.active }"
                           class="top-toolbar-item top-toolbar-item-upload-1"
                           >
                      <v-icon>mode_edit</v-icon>
                    </v-btn>
                  </v-flex>
                  <v-flex xs4>
                    <v-btn
                           icon
                           v-tooltip:bottom="{ html: 'View blog, description, ...', visible: topToolbar.tooltips.active }"
                           class="top-toolbar-item top-toolbar-item-upload-1"
                           >
                      <v-icon>more_vert</v-icon>
                    </v-btn>
                  </v-flex>
                </v-layout>
              </v-card>

              <!-- Movement Section -->
              <v-card class="ml-2">
                <v-layout row class="top-toolbar-group top-toolbar-group-upload">
                  <v-flex xs4 v-if="draggable">
                    <v-btn
                           icon
                           v-tooltip:bottom="{ html: 'Move/drag the module', visible: topToolbar.tooltips.active }"
                           class="top-toolbar-item top-toolbar-item-upload-1"
                           >
                        <v-icon ref="dragHandle" class="vue-draggable-handle">open_with</v-icon>
                    </v-btn>
                  </v-flex>
                  <v-flex :xs4="draggable" :xs6="!draggable">
                    <v-btn
                           icon
                           v-tooltip:bottom="{ html: 'Open module in fullscreen', visible: topToolbar.tooltips.active }"
                           class="top-toolbar-item top-toolbar-item-upload-1"
                           >
                      <v-icon>fullscreen</v-icon>
                    </v-btn>
                  </v-flex>
                  <v-flex :xs4="draggable" :xs6="!draggable">
                    <v-btn
                           icon
                           v-tooltip:left="{ html: 'Remove module from dashboard layout', visible: topToolbar.tooltips.active }"
                           class="top-toolbar-item top-toolbar-item-upload-1"
                           @click="removeItem(item)"
                           >
                      <v-icon>close</v-icon>
                    </v-btn>
                  </v-flex>
                </v-layout>
              </v-card>
            </v-layout>
          </v-card-title>

          <!-- Card Message Section -->
          <v-layout row v-show="alert" class="mb-3 resizable-card-wrapper-section-main">
            <v-flex>
              <v-alert info dismissible v-model="alert">
                Info section
              </v-alert>
            </v-flex>
          </v-layout>

          <!-- Card Main Section -->
          <v-card-text class="pt-0">

            <!-- Card XTerm Section -->
            <v-layout row class="mb-3">
              <v-flex>XTerm here</v-flex>
            </v-layout>

            <!-- Card Controls Section -->
            <v-layout v-bind="column">

              <!-- Read-only Section -->
              <v-flex sm-6 v-bind:class="readCardClass" class="text-md-left text-sm-left">
                <v-expansion-panel expand>
                  <v-expansion-panel-content>
                    <div slot="header">Read</div>
                    <v-card>
                      <v-card-text class="px-4">
                        Read-only UI here
                      </v-card-text>
                    </v-card>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-flex>

              <!-- Read-Write Section -->
              <v-flex sm-6 v-bind:class="hybridCardClass" class="text-md-center text-sm-left">
                <v-expansion-panel expand>
                  <v-expansion-panel-content>
                    <div slot="header">Hybrid</div>
                    <v-card>
                      <v-card-text class="px-4">
                        Read-Write (Hybrid) UI here
                      </v-card-text>
                    </v-card>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-flex>

              <!-- Write-only Section -->
              <v-flex sm-6 v-bind:class="writeCardClass" class="text-md-right text-sm-left">
                <v-expansion-panel expand>
                  <v-expansion-panel-content>
                    <div slot="header">Write</div>
                    <v-card>
                      <v-card-text class="px-4">
                        Write-only UI here
                      </v-card-text>
                    </v-card>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-flex>

            </v-layout>

          </v-card-text>
          <!-- Card Footer Section -->
          <v-card-actions class="pa-0 ma-0">
            <v-layout row class="px-3 pb-3 pt-0 ma-0 card-footer-section" align-center>
              <!-- Info Section -->
              <v-flex class="text-xs-left">
                <v-btn
                       icon
                       v-tooltip:right="{ html: 'View module info', visible: topToolbar.tooltips.active }"
                       class="top-toolbar-item top-toolbar-item-upload-1 ma-0"
                       >
                  <v-icon>info</v-icon>
                </v-btn>
                <v-btn
                       icon
                       v-tooltip:right="{ html: 'View module documentation', visible: topToolbar.tooltips.active }"
                       class="top-toolbar-item top-toolbar-item-upload-1 ma-0"
                       >
                  <v-icon>help</v-icon>
                </v-btn>
              </v-flex>
              <v-spacer></v-spacer>
              <!-- Resize Section -->
              <v-flex class="text-xs-right">
                <v-flex
                       icon
                       v-tooltip:bottom="{ html: 'Move/drag the module', visible: topToolbar.tooltips.active }"
                       class="top-toolbar-item top-toolbar-item-upload-1"
                       style="margin-top: 30px!important;"
                       >
                       <v-icon
                         v-if="resizable"
                         ref="handle"
                         :class="resizableHandleClass"
                         class="card-resize-handle"
                       >transform</v-icon>
                </v-flex>
              </v-flex>
            </v-layout>
          </v-card-actions>
        </v-card>
    </div>
</template>
<style>
    .vue-grid-item {
        transition: all 200ms ease;
        transition-property: left, top, right;
    }

    .vue-grid-item.cssTransforms {
        transition-property: transform;
    }

    .vue-grid-item.resizing {
        opacity: 0.6;
        z-index: 3;
    }

    .vue-grid-item.vue-draggable-dragging {
        transition:none;
        z-index: 3;
    }

    .vue-grid-item.vue-grid-placeholder {
        background: red;
        opacity: 0.2;
        transition-duration: 100ms;
        z-index: 2;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        -o-user-select: none;
        user-select: none;
    }

    .vue-grid-item > .vue-resizable-handle {
        position: absolute;
        width: 20px;
        height: 20px;
        bottom: 0;
        right: 0;
        background: url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/Pg08IS0tIEdlbmVyYXRvcjogQWRvYmUgRmlyZXdvcmtzIENTNiwgRXhwb3J0IFNWRyBFeHRlbnNpb24gYnkgQWFyb24gQmVhbGwgKGh0dHA6Ly9maXJld29ya3MuYWJlYWxsLmNvbSkgLiBWZXJzaW9uOiAwLjYuMSAgLS0+DTwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DTxzdmcgaWQ9IlVudGl0bGVkLVBhZ2UlMjAxIiB2aWV3Qm94PSIwIDAgNiA2IiBzdHlsZT0iYmFja2dyb3VuZC1jb2xvcjojZmZmZmZmMDAiIHZlcnNpb249IjEuMSINCXhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbDpzcGFjZT0icHJlc2VydmUiDQl4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjZweCIgaGVpZ2h0PSI2cHgiDT4NCTxnIG9wYWNpdHk9IjAuMzAyIj4NCQk8cGF0aCBkPSJNIDYgNiBMIDAgNiBMIDAgNC4yIEwgNCA0LjIgTCA0LjIgNC4yIEwgNC4yIDAgTCA2IDAgTCA2IDYgTCA2IDYgWiIgZmlsbD0iIzAwMDAwMCIvPg0JPC9nPg08L3N2Zz4=');
        background-position: bottom right;
        padding: 0 3px 3px 0;
        background-repeat: no-repeat;
        background-origin: content-box;
        box-sizing: border-box;
        cursor: se-resize;
    }

    .vue-grid-item > .vue-rtl-resizable-handle {
        bottom: 0;
        left: 0;
        background: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAuMDAwMDAwMDAwMDAwMDAyIiBoZWlnaHQ9IjEwLjAwMDAwMDAwMDAwMDAwMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KIDwhLS0gQ3JlYXRlZCB3aXRoIE1ldGhvZCBEcmF3IC0gaHR0cDovL2dpdGh1Yi5jb20vZHVvcGl4ZWwvTWV0aG9kLURyYXcvIC0tPgogPGc+CiAgPHRpdGxlPmJhY2tncm91bmQ8L3RpdGxlPgogIDxyZWN0IGZpbGw9Im5vbmUiIGlkPSJjYW52YXNfYmFja2dyb3VuZCIgaGVpZ2h0PSIxMiIgd2lkdGg9IjEyIiB5PSItMSIgeD0iLTEiLz4KICA8ZyBkaXNwbGF5PSJub25lIiBvdmVyZmxvdz0idmlzaWJsZSIgeT0iMCIgeD0iMCIgaGVpZ2h0PSIxMDAlIiB3aWR0aD0iMTAwJSIgaWQ9ImNhbnZhc0dyaWQiPgogICA8cmVjdCBmaWxsPSJ1cmwoI2dyaWRwYXR0ZXJuKSIgc3Ryb2tlLXdpZHRoPSIwIiB5PSIwIiB4PSIwIiBoZWlnaHQ9IjEwMCUiIHdpZHRoPSIxMDAlIi8+CiAgPC9nPgogPC9nPgogPGc+CiAgPHRpdGxlPkxheWVyIDE8L3RpdGxlPgogIDxsaW5lIGNhbnZhcz0iI2ZmZmZmZiIgY2FudmFzLW9wYWNpdHk9IjEiIHN0cm9rZS1saW5lY2FwPSJ1bmRlZmluZWQiIHN0cm9rZS1saW5lam9pbj0idW5kZWZpbmVkIiBpZD0ic3ZnXzEiIHkyPSItNzAuMTc4NDA3IiB4Mj0iMTI0LjQ2NDE3NSIgeTE9Ii0zOC4zOTI3MzciIHgxPSIxNDQuODIxMjg5IiBzdHJva2Utd2lkdGg9IjEuNSIgc3Ryb2tlPSIjMDAwIiBmaWxsPSJub25lIi8+CiAgPGxpbmUgc3Ryb2tlPSIjNjY2NjY2IiBzdHJva2UtbGluZWNhcD0idW5kZWZpbmVkIiBzdHJva2UtbGluZWpvaW49InVuZGVmaW5lZCIgaWQ9InN2Z181IiB5Mj0iOS4xMDY5NTciIHgyPSIwLjk0NzI0NyIgeTE9Ii0wLjAxODEyOCIgeDE9IjAuOTQ3MjQ3IiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9Im5vbmUiLz4KICA8bGluZSBzdHJva2UtbGluZWNhcD0idW5kZWZpbmVkIiBzdHJva2UtbGluZWpvaW49InVuZGVmaW5lZCIgaWQ9InN2Z183IiB5Mj0iOSIgeDI9IjEwLjA3MzUyOSIgeTE9IjkiIHgxPSItMC42NTU2NCIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2U9IiM2NjY2NjYiIGZpbGw9Im5vbmUiLz4KIDwvZz4KPC9zdmc+);
        background-position: bottom left;
        padding-left: 3px;
        background-repeat: no-repeat;
        background-origin: content-box;
        cursor: sw-resize;
        right: auto;
    }
</style>
<script>
  /* eslint-disable */
    import {setTopLeft, setTopRight, setTransformRtl, setTransform, createMarkup, getLayoutItem} from '../../../node_modules/vue-grid-layout/src/utils.js';
    import {getControlPosition, offsetXYFromParentOf, createCoreData} from '../../../node_modules/vue-grid-layout/src/utils/draggableUtils.js';
    //    var eventBus = require('./eventBus');

    var interact = require("interactjs");

    export default {
        name: "GridItem",
          props: {
            text : {
                type: String,
                default: "x",
            },
            layout : {
                type: [Array, String],
                default: "x",
            },
            item : {
                type: [Object, String],
                default: "x",
            },
            isDraggable: {
                type: Boolean,
                required: false,
                default: null
            },
            isResizable: {
                type: Boolean,
                required: false,
                default: null
            },
            minH: {
                type: Number,
                required: false,
                default: 1
            },
            minW: {
                type: Number,
                required: false,
                default: 1
            },
            maxH: {
                type: Number,
                required: false,
                default: Infinity
            },
            maxW: {
                type: Number,
                required: false,
                default: Infinity
            },
            x: {
                type: Number,
                required: true
            },
            y: {
                type: Number,
                required: true
            },
            w: {
                type: Number,
                required: true
            },
            h: {
                type: Number,
                required: true
            },
            i: {
                required: true
            },
            dragIgnoreFrom: {
                type: String,
                required: false,
                default: 'a, button'
            },
            dragAllowFrom: {
                type: String,
                required: false,
                default: null
            },
            resizeIgnoreFrom: {
                type: String,
                required: false,
                default: 'a, button'
            },
        },
        inject: ["eventBus"],
        data: function () {
            return {
                // Start of custom edits
                alert: true,
                readCardClassValue: '',
                hybridCardClassValue: '',
                writeCardClassValue: '',
                topToolbar: {
                  tooltips: {
                    active: true
                  }
                },
                cardMobileMode: true,
                // End of custom edits
                cols: 1,
                containerWidth: 100,
                rowHeight: 30,
                margin: [10, 10],
                maxRows: Infinity,
                draggable: null,
                resizable: null,
                useCssTransforms: true,

                isDragging: false,
                dragging: null,
                isResizing: false,
                resizing: null,
                lastX: NaN,
                lastY: NaN,
                lastW: NaN,
                lastH: NaN,
                style: {},
                rtl: false,

                dragEventSet: false,
                resizeEventSet: false,

                previousW: null,
                previousH: null,
                previousX: null,
                previousY: null,
            }
        },
        created () {
            var self = this;

            // Accessible refernces of functions for removing in beforeDestroy
            self.updateWidthHandler = function (width) {
                self.updateWidth(width);
            };

            self.compactHandler = function (layout) {
                self.compact(layout);
            };

            self.setDraggableHandler = function (isDraggable) {
                if (self.isDraggable === null) {
                    self.draggable = isDraggable;
                }
            };

            self.setResizableHandler = function (isResizable) {
                if (self.isResizable === null) {
                    self.resizable = isResizable;
                }
            };

            self.setRowHeightHandler = function (rowHeight) {
                self.rowHeight = rowHeight;
            };

            self.directionchangeHandler = (direction) => {
                var direction = (document.dir !== undefined) ?
                    document.dir :
                    document.getElementsByTagName("html")[0].getAttribute("dir");
                this.rtl = (direction === "rtl");
                this.compact();
            };

            this.eventBus.$on('updateWidth', self.updateWidthHandler);
            this.eventBus.$on('compact', self.compactHandler);
            this.eventBus.$on('setDraggable', self.setDraggableHandler);
            this.eventBus.$on('setResizable', self.setResizableHandler);
            this.eventBus.$on('setRowHeight', self.setRowHeightHandler);
            this.eventBus.$on('directionchange', self.directionchangeHandler);

            /*this.eventBus.$on('setColNum', function(colNum) {
             self.cols = colNum;
             });*/
            var direction = (document.dir !== undefined) ?
                document.dir :
                document.getElementsByTagName("html")[0].getAttribute("dir");
            this.rtl = (direction === "rtl");
        },
        beforeDestroy: function(){
            var self = this;
            //Remove listeners
            this.eventBus.$off('updateWidth', self.updateWidthHandler);
            this.eventBus.$off('compact', self.compactHandler);
            this.eventBus.$off('setDraggable', self.setDraggableHandler);
            this.eventBus.$off('setResizable', self.setResizableHandler);
            this.eventBus.$off('setRowHeight', self.setRowHeightHandler);
            this.eventBus.$off('directionchange', self.directionchangeHandler);
        },
        mounted: function () {
            this.cols = this.$parent.colNum;
            this.rowHeight = this.$parent.rowHeight;
            this.containerWidth = this.$parent.width !== null ? this.$parent.width : 100;
            this.margin = this.$parent.margin !== undefined ? this.$parent.margin : [10, 10];
            this.maxRows = this.$parent.maxRows;
            if (this.isDraggable === null) {
                this.draggable = this.$parent.isDraggable;
            } else {
                this.draggable = this.isDraggable;
            }
            if (this.isResizable === null) {
                this.resizable = this.$parent.isResizable;
            } else {
                this.resizable = this.isResizable;
            }
            this.useCssTransforms = this.$parent.useCssTransforms;
            this.createStyle();
        },
        watch: {
            isDraggable: function () {
                this.draggable = this.isDraggable;
            },
            draggable: function () {
                var self = this;
                if (this.interactObj === null || this.interactObj === undefined) {
                    this.interactObj = interact(this.$refs.item);
                }
                if (this.draggable) {
                    var opts = {
                        ignoreFrom: this.dragIgnoreFrom,
                        allowFrom: this.dragAllowFrom
                    }
                    this.interactObj.draggable(opts);
                    /*this.interactObj.draggable({allowFrom: '.vue-draggable-handle'});*/
                    if (!this.dragEventSet) {
                        this.dragEventSet = true;
                        this.interactObj.on('dragstart dragmove dragend', function (event) {
                            self.handleDrag(event);
                        });
                    }
                } else {
                    this.interactObj.draggable({
                        enabled: false
                    });
                }
            },
            isResizable: function () {
                this.resizable = this.isResizable;
            },
            resizable: function () {
                var self = this;
                if (this.interactObj === null || this.interactObj === undefined) {
                    this.interactObj = interact(this.$refs.item);
                }
                if (this.resizable) {
                    var opts = {
                        preserveAspectRatio: false,
                        edges: {left: false, right: true, bottom: true, top: false},
                        ignoreFrom: this.resizeIgnoreFrom
                    };

                    this.interactObj.resizable(opts);
                    if (!this.resizeEventSet) {
                        this.resizeEventSet = true;
                        this.interactObj
                            .on('resizestart resizemove resizeend', function (event) {
                                self.handleResize(event);
                            });
                    }
                } else {
                    this.interactObj.resizable({
                        enabled: false
                    });
                }
            },
            rowHeight: function () {
                this.createStyle();
            },
            cols: function () {
                this.createStyle();
            },
            containerWidth: function () {
                this.createStyle();
            },
            x: function () {
                this.createStyle();
            },
            y: function () {
                this.createStyle();
            },
            h: function () {
                this.createStyle();
            },
            w: function () {
                this.createStyle();
            }
        },
        computed: {
            resizableHandleClass() {
                if (this.rtl) {
                    return 'vue-resizable-handle vue-rtl-resizable-handle';
                } else {
                    return 'vue-resizable-handle';
                }
            },
            column () {
              var column = {}

              if ((this.item.w > 5) && (this.$mq.resize && this.$mq.above('1270px'))) {
                column.row = true
                this.cardMobileMode = false
              } else {
                column.column = true
                this.cardMobileMode = true
              }

              return column
            },
            readCardClass () {
              if ((this.item.w > 5) && (this.$mq.resize && this.$mq.above('1270px'))) {
                this.readCardClassValue = "read-card-spacing"
              } else {
                this.readCardClassValue = ""
              }

              return this.readCardClassValue
            },
            hybridCardClass () {
              if ((this.item.w > 5) && (this.$mq.resize && this.$mq.above('1270px'))) {
                this.hybridCardClassValue = "hybrid-card-spacing"
              } else {
                this.hybridCardClassValue = ""
              }

              return this.hybridCardClassValue
            },
            writeCardClass () {
              if ((this.item.w > 5) && (this.$mq.resize && this.$mq.above('1270px'))) {
                    this.writeCardClassValue = "write-card-spacing"
              } else {
                this.writeCardClassValue = ""
              }

              return this.writeCardClassValue
            }
        },
        methods: {
            removeItem: function(item) {
                console.log("### REMOVED" + this.text);
                this.layout.splice(this.layout.indexOf(item), 1);
            },
            createStyle: function () {
                if (this.x + this.w > this.cols) {
                    this.x = 0;
                    this.w = this.cols;
                }

                var pos = this.calcPosition(this.x, this.y, this.w, this.h);

                if (this.isDragging) {
                    pos.top = this.dragging.top;
//                    Add rtl support
                    if (this.rtl) {
                        pos.right = this.dragging.left;
                    } else {
                        pos.left = this.dragging.left;
                    }
                }
                if (this.isResizing) {
                    pos.width = this.resizing.width;
                    pos.height = this.resizing.height;
                }

                let style;
                // CSS Transforms support (default)
                if (this.useCssTransforms) {
//                    Add rtl support
                    if (this.rtl) {
                        style = setTransformRtl(pos.top, pos.right, pos.width, pos.height);
                    } else {
                        style = setTransform(pos.top, pos.left, pos.width, pos.height);
                    }

                } else { // top,left (slow)
//                    Add rtl support
                    if (this.rtl) {
                        style = setTopRight(pos.top, pos.right, pos.width, pos.height);
                    } else {
                        style = setTopLeft(pos.top, pos.left, pos.width, pos.height);
                    }
                }
                this.style = style;

            },
            handleResize: function (event) {
                const position = getControlPosition(event);
                // Get the current drag point from the event. This is used as the offset.
                if (position == null) return; // not possible but satisfies flow
                const {x, y} = position;

                const newSize = {width: 0, height: 0};
                switch (event.type) {
                    case "resizestart":
                        this.previousW = this.w;
                        this.previousH = this.h;
                        var pos = this.calcPosition(this.x, this.y, this.w, this.h);
                        newSize.width = pos.width;
                        newSize.height = pos.height;
                        this.resizing = newSize;
                        this.isResizing = true;
                        break;
                    case "resizemove":
//                        console.log("### resize => " + event.type + ", lastW=" + this.lastW + ", lastH=" + this.lastH);
                        const coreEvent = createCoreData(this.lastW, this.lastH, x, y);
                        if (this.rtl) {
                            newSize.width = this.resizing.width - coreEvent.deltaX;
                        } else {
                            newSize.width = this.resizing.width + coreEvent.deltaX;
                        }
                        newSize.height = this.resizing.height + coreEvent.deltaY;

                        ///console.log("### resize => " + event.type + ", deltaX=" + coreEvent.deltaX + ", deltaY=" + coreEvent.deltaY);
                        this.resizing = newSize;
                        break;
                    case "resizeend":
                        //console.log("### resize end => x=" +this.x + " y=" + this.y + " w=" + this.w + " h=" + this.h);
                        var pos = this.calcPosition(this.x, this.y, this.w, this.h);
                        newSize.width = pos.width;
                        newSize.height = pos.height;
//                        console.log("### resize end => " + JSON.stringify(newSize));
                        this.resizing = null;
                        this.isResizing = false;
                        break;
                }

                // Get new WH
                var pos = this.calcWH(newSize.height, newSize.width);
                if (pos.w < this.minW) {
                    pos.w = this.minW;
                }
                if (pos.w > this.maxW) {
                    pos.w = this.maxW;
                }
                if (pos.h < this.minH) {
                    pos.h = this.minH;
                }
                if (pos.h > this.maxH) {
                    pos.h = this.maxH;
                }

                if (pos.h < 1) {
                    pos.h = 1;
                }
                if (pos.w < 1) {
                    pos.w = 1;
                }

                this.lastW = x;
                this.lastH = y;

                if (this.w !== pos.w || this.h !== pos.h) {
                    this.$emit("resize", this.i, pos.h, pos.w);
                }
                if (event.type === "resizeend" && (this.previousW !== this.w || this.previousH !== this.h)) {
                    this.$emit("resized", this.i, pos.h, pos.w, newSize.height, newSize.width);
                }
                this.eventBus.$emit("resizeEvent", event.type, this.i, this.x, this.y, pos.h, pos.w);
            },
            handleDrag(event) {
                if (this.isResizing) return;

                const position = getControlPosition(event);

                // Get the current drag point from the event. This is used as the offset.
                if (position === null) return; // not possible but satisfies flow
                const {x, y} = position;

                var shouldUpdate = false;
                const newPosition = {top: 0, left: 0};
                switch (event.type) {
                    case "dragstart":
                        this.previousX = this.x;
                        this.previousY = this.y;

                        var parentRect = event.target.offsetParent.getBoundingClientRect();
                        var clientRect = event.target.getBoundingClientRect();
                        if (this.rtl) {
                            newPosition.left = (clientRect.right - parentRect.right) * -1;
                        } else {
                            newPosition.left = clientRect.left - parentRect.left;
                        }
                        newPosition.top = clientRect.top - parentRect.top;
                        this.dragging = newPosition;
                        this.isDragging = true;
                        break;
                    case "dragend":
                        if (!this.isDragging) return;
                        parentRect = event.target.offsetParent.getBoundingClientRect();
                        clientRect = event.target.getBoundingClientRect();
//                        Add rtl support
                        if (this.rtl) {
                            newPosition.left = (clientRect.right - parentRect.right) * -1;
                        } else {
                            newPosition.left = clientRect.left - parentRect.left;
                        }
                        newPosition.top = clientRect.top - parentRect.top;
//                        console.log("### drag end => " + JSON.stringify(newPosition));
//                        console.log("### DROP: " + JSON.stringify(newPosition));
                        this.dragging = null;
                        this.isDragging = false;
                        shouldUpdate = true;
                        break;
                    case "dragmove":
                        const coreEvent = createCoreData(this.lastX, this.lastY, x, y);
//                        Add rtl support
                        if (this.rtl) {
                            newPosition.left = this.dragging.left - coreEvent.deltaX;
                        } else {
                            newPosition.left = this.dragging.left + coreEvent.deltaX;
                        }
                        newPosition.top = this.dragging.top + coreEvent.deltaY;
//                        console.log("### drag => " + event.type + ", x=" + x + ", y=" + y);
//                        console.log("### drag => " + event.type + ", deltaX=" + coreEvent.deltaX + ", deltaY=" + coreEvent.deltaY);
//                        console.log("### drag end => " + JSON.stringify(newPosition));
                        this.dragging = newPosition;
                        break;
                }

                // Get new XY
                if (this.rtl) {
                    var pos = this.calcXY(newPosition.top, newPosition.left);
                } else {
                    var pos = this.calcXY(newPosition.top, newPosition.left);
                }

                this.lastX = x;
                this.lastY = y;

                if (this.x !== pos.x || this.y !== pos.y) {
                    this.$emit("move", this.i, pos.x, pos.y);
                }
                if (event.type === "dragend" && (this.previousX !== this.x || this.previousY !== this.y)) {
                    this.$emit("moved", this.i, pos.x, pos.y);
                }
                this.eventBus.$emit("dragEvent", event.type, this.i, pos.x, pos.y, this.h, this.w);
            },
            calcPosition: function (x, y, w, h) {
                const colWidth = this.calcColWidth();
                // add rtl support
                if (this.rtl) {
                    var out = {
                        right: Math.round(colWidth * x + (x + 1) * this.margin[0]),
                        top: Math.round(this.rowHeight * y + (y + 1) * this.margin[1]),
                        // 0 * Infinity === NaN, which causes problems with resize constriants;
                        // Fix this if it occurs.
                        // Note we do it here rather than later because Math.round(Infinity) causes deopt
                        width: w === Infinity ? w : Math.round(colWidth * w + Math.max(0, w - 1) * this.margin[0]),
                        height: h === Infinity ? h : Math.round(this.rowHeight * h + Math.max(0, h - 1) * this.margin[1])
                    };
                } else {
                    var out = {
                        left: Math.round(colWidth * x + (x + 1) * this.margin[0]),
                        top: Math.round(this.rowHeight * y + (y + 1) * this.margin[1]),
                        // 0 * Infinity === NaN, which causes problems with resize constriants;
                        // Fix this if it occurs.
                        // Note we do it here rather than later because Math.round(Infinity) causes deopt
                        width: w === Infinity ? w : Math.round(colWidth * w + Math.max(0, w - 1) * this.margin[0]),
                        height: h === Infinity ? h : Math.round(this.rowHeight * h + Math.max(0, h - 1) * this.margin[1])
                    };
                }


                return out;
            },
            /**
             * Translate x and y coordinates from pixels to grid units.
             * @param  {Number} top  Top position (relative to parent) in pixels.
             * @param  {Number} left Left position (relative to parent) in pixels.
             * @return {Object} x and y in grid units.
             */
            // TODO check if this function needs change in order to support rtl.
            calcXY(top, left) {
                const colWidth = this.calcColWidth();

                // left = colWidth * x + margin * (x + 1)
                // l = cx + m(x+1)
                // l = cx + mx + m
                // l - m = cx + mx
                // l - m = x(c + m)
                // (l - m) / (c + m) = x
                // x = (left - margin) / (coldWidth + margin)
                let x = Math.round((left - this.margin[0]) / (colWidth + this.margin[0]));
                let y = Math.round((top - this.margin[1]) / (this.rowHeight + this.margin[1]));

                // Capping
                x = Math.max(Math.min(x, this.cols - this.w), 0);
                y = Math.max(Math.min(y, this.maxRows - this.h), 0);

                return {x, y};
            },
            // Helper for generating column width
            calcColWidth() {
                var colWidth = (this.containerWidth - (this.margin[0] * (this.cols + 1))) / this.cols;
//                console.log("### COLS=" + this.cols + " COL WIDTH=" + colWidth);
                return colWidth;
            },

            /**
             * Given a height and width in pixel values, calculate grid units.
             * @param  {Number} height Height in pixels.
             * @param  {Number} width  Width in pixels.
             * @return {Object} w, h as grid units.
             */
            calcWH(height, width) {
                const colWidth = this.calcColWidth();

                // width = colWidth * w - (margin * (w - 1))
                // ...
                // w = (width + margin) / (colWidth + margin)
                let w = Math.round((width + this.margin[0]) / (colWidth + this.margin[0]));
                let h = Math.round((height + this.margin[1]) / (this.rowHeight + this.margin[1]));

                // Capping
                w = Math.max(Math.min(w, this.cols - this.x), 0);
                h = Math.max(Math.min(h, this.maxRows - this.y), 0);
                return {w, h};
            },
            updateWidth: function (width, colNum) {
                this.containerWidth = width;
                if (colNum !== undefined && colNum !== null) {
                    this.cols = colNum;
                }
            },
            compact: function () {
                this.createStyle();
            }
        },
    }
</script>
