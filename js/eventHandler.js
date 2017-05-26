define([
    'esri/map',

    'dojo/dom',
    'dojo/dom-construct',
    'dojo/dom-style',
    'dojo/on',
    'dojo/parser',
    'dojo/domReady!'

], function (map, dom, domConstruct, on, parser) {
    return {
        handleEvent: function (map) {
            'use strict';
            parser.parse();
            //Holds currently selected layer id
            var activeLayerId = null;
            //Listen to All layer button click event
            on(dom.byId('allLayer'), 'click', function () {
                map.addLayer(schoolLayer);
                map.addLayer(healthCenterLayer);
                activeLayerId = null;
                map.graphics.clear();
            });
            //Listen to the school layer click button
            on(dom.byId('school'), 'click', function () {
                map.removeLayer(healthCenterLayer);
                map.addLayer(schoolLayer);
                activeLayerId = 1;
                map.graphics.clear();
            });

            //Listen to the health layer click button
            on(dom.byId('health'), 'click', function () {
                map.removeLayer(schoolLayer);
                map.addLayer(healthCenterLayer);
                activeLayerId = 0;
                map.graphics.clear();
            });

            //Listen to the addis ababa subcity layer click button
            on(dom.byId('subcity'), 'click', function () {
                map.removeLayer(healthCenterLayer);
                map.removeLayer(schoolLayer);
                map.addLayer(addisAbabaLayer);
                activeLayerId = 0;
                map.graphics.clear();
            });

            //Event lister to nav links
            $(document).ready(
                function () {
                    //listner to drawMenuItems menu
                    $('#drawMenuItems li').click(
                        function (event) {

                        }
                    );
                    $('.clickable').on('click', function () {
                        var effect = $(this).data('effect');
                        $(this).closest('.panel')[effect]();
                    });
                    //click event listner for legend link from the navbar
                    $("#analysisMenuItem").click(
                        function () {
                            $('#analysisWidgetDiv').toggle('slow');
                        }
                    );
                    //click event listner for legend link from the navbar
                    $('#legendMenuItem').click(
                        function (event) {
                            console.log('Legend');
                            $('#legendPanel').toggle('slow');
                        });
                    var legendParams = {
                            map: map
                        },
                        legend = new Legend(legendParams, 'legend');
                    legend.startup();
                }
            );
        }
    }
});