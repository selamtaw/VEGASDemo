var map;
require([
        'appWidgets/analysiswidget/mapAnalysis',
        'app/addisInfo',

        'dojo/dom',
        'dojo/dom-class',
        'dojo/dom-construct',
        'dojo/on',
        'dojo/_base/Color',
        'dojo/parser',

        'dojox/charting/Chart',
        'dojox/charting/themes/Dollar',

        'esri/geometry/Extent',
        'esri/InfoTemplate',
        'esri/layers/FeatureLayer',
        'esri/map',
        'esri/symbols/SimpleMarkerSymbol',
        'esri/symbols/SimpleFillSymbol',
        'esri/tasks/query',
        'esri/tasks/QueryTask',
        'esri/renderers/ClassBreaksRenderer',

        'esri/dijit/Search',
        'esri/dijit/Popup',
        'esri/dijit/PopupTemplate',
        'esri/dijit/Legend',
        'esri/dijit/Scalebar',

        'dojo/domReady!'
    ],
    function (
        MapAnalysis,
        addisInfo,

        dom,
        domClass,
        domConstruct,
        on,
        Color,
        parser,

        Chart,
        theme,

        Extent,
        InfoTemplate,
        FeatureLayer,
        Map,
        SimpleMarkerSymbol,
        SimpleFillSymbol,
        Query,
        QueryTask,
        ClassBreaksRenderer,

        Search,
        Popup,
        PopupTemplate,
        Legend,
        Scalebar
    ) {
        'use strict';
        //Initialize the analysis widget
        // var analysisWidget = new MapAnalysis({}, "analysisWidgetDiv");
        // analysisWidget.startup();
        parser.parse();
        //Initial Map extent
        var initialExtent = new Extent({

            "type": "extent",
            "xmin": 439052.03684105584,
            "ymin": 969670.7376126263,
            "xmax": 524814.6006568756,
            "ymax": 1009723.7404340052,
            "spatialReference": {
                "wkid": 20137,
                "latestWkid": 20137
            }
        });
        var fill = new SimpleFillSymbol("solid", null, new Color("#E9CE67"));

        var popup = new Popup({
            titleInBody: false,
        }, domConstruct.create("div"));

        map = new Map("mapDiv", {
            extent: initialExtent,
            infoWindow: popup
        });
        //Add a scale bar to the map
        var scaleBar = new Scalebar({
            map: map,
            scalebarUnit: 'metric'
        });

        map.infoWindow.resize(300, 300);
        //capitalization of attributes name in the layer matters!
        //Addis Ababa city layer
        var template = new InfoTemplate();
        template.setTitle("<span style='color: #ffffff'><b>${WOREDANAME}</b> Subcity</span>", );
        template.setContent(addisInfo.getInfoWindowContent);

        var symbol = new SimpleFillSymbol();
        symbol.setColor(new Color([150, 150, 150, 0.5]));

        var addisRenderer = new ClassBreaksRenderer(symbol, "POPULATION");
        addisRenderer.addBreak(0, 3000, new SimpleFillSymbol().setColor(new Color([100, 255, 0, 1])));
        addisRenderer.addBreak(3000, 4000, new SimpleFillSymbol().setColor(new Color([120, 200, 0, 1])));
        addisRenderer.addBreak(4000, 5000, new SimpleFillSymbol().setColor(new Color([254, 209, 180, 1])));
        addisRenderer.addBreak(5000, 6000, new SimpleFillSymbol().setColor(new Color([254, 191, 150, 1])));
        addisRenderer.addBreak(6000, 9000, new SimpleFillSymbol().setColor(new Color([255, 184, 114, 1])));
        addisRenderer.addBreak(9000, 10000, new SimpleFillSymbol().setColor(new Color([255, 173, 91, 1])));
        addisRenderer.addBreak(10000, Infinity, new SimpleFillSymbol().setColor(new Color([255, 149, 43, 1])));

        var addisAbabaInfo = new InfoTemplate("Subcity info", "Name: <b>${WOREDANAME}</b><br>Region Name: ${REGIONNAME}<br>Population: ${POPULATION}<br> Male: <b>${MALE}</b> <br>Female: <b>${FEMALE}</b> <br><b>Disablity</b><br>Deaf: <b>${DIS_DEAF}</b> <br>Blind<b>${DIS_BLIND}</b>");
        var addisAbabaLayer = new FeatureLayer("http://localhost:6080/arcgis/rest/services/vegas/MapServer/2", {
            outFields: ["*"]
        });
        addisAbabaLayer.setInfoTemplate(template);

        //addisAbabaLayer.setDefinitionExpression("POPULATION = 3000");
        addisAbabaLayer.setRenderer(addisRenderer);

        //School Layer,
        var schoolInfo = new InfoTemplate("School Info", "Name: <b>${NAME}</b><br>Type: <b>${TYPE}</b><br>");
        var schoolLayer = new FeatureLayer("http://localhost:6080/arcgis/rest/services/vegas/MapServer/1", {
            outFields: ["*"]
        });
        schoolLayer.setInfoTemplate(schoolInfo);

        //Health Centers Layer
        var healthInfo = new InfoTemplate("Health Center Info", "Name: <b>${NAME}</b><br>Type: <b>${TYPE}</b>");
        var healthCenterLayer = new FeatureLayer("http://localhost:6080/arcgis/rest/services/vegas/MapServer/0", {
            outFields: ["*"]
        });
        healthCenterLayer.setInfoTemplate(healthInfo);

        //Ethiopia wereda layer
        var ethiopia_layer = new FeatureLayer("http://localhost:6080/arcgis/rest/services/vegas/MapServer/3", {
            id: "Ethiopia-regions"
        });

        map.addLayer(ethiopia_layer);
        map.addLayer(addisAbabaLayer);
        map.addLayer(schoolLayer);
        map.addLayer(healthCenterLayer);

        //Setup searching
        var search = new Search({
            enableInfoWindow: true,
            enableLabel: false,
            map: map
        }, 'search');

        var sources = search.get("sources");

        sources.push({
            featureLayer: schoolLayer,
            searchFields: ["NAME"],
            displayField: "NAME",
            exactMatch: false,
            outFields: ["NAME"],
            name: "Schools, colleges and Universities",
            placeholder: "Addis Abab Institute",
            maxResults: 10,
            maxSuggestions: 6,
            autoNavigate: false,
            enableHighlight: false,
            //Create an InfoTemplate and include three fields
            infoTemplate: schoolInfo,
            enableSuggestions: true,
            minCharacters: 0
        });
        sources.push({
            featureLayer: healthCenterLayer,
            searchFields: ["NAME"],
            displayField: "NAME",
            exactMatch: false,
            outFields: ["NAME"],
            name: "Health Center",
            placeholder: "Yekatit 12 Hospital",
            maxResults: 10,
            maxSuggestions: 6,
            autoNavigate: false,
            enableHighlight: false,
            //Create an InfoTemplate and include three fields
            infoTemplate: healthInfo,
            enableSuggestions: true,
            minCharacters: 0
        });

        search.set("sources", sources);
        search.startup();
        on(search, 'search-results', function (e) {
            showResults(e);
        });

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
        //Searching Features in the map
        var queryTask;
        var query;

        //Displays search result features on the map
        function showResults(rslt) {
            var result = rslt;
            console.log("length: " + result.numResults)
            if (result.numResults == 0) {
                console.log("No result found");
                return;
            }
            console.log(result);
            var featureArray = result.results;
            var symbol = new SimpleMarkerSymbol();
            symbol.setSize(30);
            symbol.setColor(new Color([255, 255, 0, 0.5]));

            map.graphics.clear();
            var jsonResult = JSON.stringify(featureArray);

            console.log(featureArray[1]);

            featureArray[1].forEach(function (element) {
                console.log(element)
                var feature = element.feature;
                feature.setSymbol(symbol);

                map.graphics.add(feature);

            }, this);

            featureArray[2].forEach(function (element) {
                console.log(element)
                var feature = element.feature;
                feature.setSymbol(symbol);

                map.graphics.add(feature);

            }, this);

        }

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
    });