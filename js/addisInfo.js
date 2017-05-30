define(
    [
        'dojo/dom',
        'dojo/dom-class',
        'dojo/dom-construct',
        'dojo/on',
        'dojo/_base/Color',
        'dojo/number',
        'dojo/_base/array',
        'dojo/dom-style',

        'dojox/charting/Chart',
        'dojox/charting/plot2d/Pie',
        'dojox/charting/themes/Bahamation',
        "dojox/charting/action2d/Highlight",
        "dojox/charting/action2d/Tooltip",
        "dojox/charting/action2d/MoveSlice",

        'esri/graphic',
        'esri/InfoTemplate',
        'esri/symbols/SimpleMarkerSymbol',
        'esri/symbols/SimpleFillSymbol',
        'esri/renderers/ClassBreaksRenderer',

        'esri/dijit/Popup',
        'esri/dijit/PopupTemplate',

        'dijit/layout/TabContainer',
        'dijit/layout/ContentPane',
        'dijit/layout/BorderContainer',

        'dojo/domReady!'
    ],

    function (
        dom,
        domClass,
        domConstruct,
        on,
        Color,
        number,
        array,
        domstyle,

        Chart,
        Pie,
        Bahamation,
        Highlight,
        Tooltip,
        MoveSlice,

        Graphic,
        InfoTemplate,
        SimpleMarkerSymbol,
        SimpleFillSymbol,
        ClassBreaksRenderer,

        Popup,
        PopupTemplate,
        TabContainer,
        ContentPane,
        BorderContainer) {
        return {
            getInfoWindowContent: function (graphic) {
                console.log("Content setted.");
                //Contain the two ContentPane's 
                var infoWindowTC = new TabContainer({
                    style: "height: 270px;"
                }, domConstruct.create("div"));

                var detailInfoCP = new ContentPane({
                    title: "Details",
                    content: "Total Population: " + graphic.attributes.POPULATION + " <br> Male: " + graphic.attributes.MALE + "<br> Female: " + graphic.attributes.FEMALE
                });
                var pieChartCP = new ContentPane({
                    title: "Pie Chart"
                });

                infoWindowTC.addChild(detailInfoCP);
                infoWindowTC.addChild(pieChartCP);

                var chartDiv = domConstruct.create("div", {
                    id: "infoChartDiv"
                }, domConstruct.create("div"));

                var chart = new Chart(chartDiv);
                domClass.add(chart, "chart");

                // Apply a color theme to the chart.
                chart.setTheme(Bahamation);

                chart.addPlot("default", {
                    type: "Pie",
                    radius: 70,
                    htmlLabels: true
                });
                infoWindowTC.watch("selectedChildWidget", function (name, oldVal, newVal) {
                    if (newVal.title === "Pie Chart") {
                        chart.resize(200, 200);
                    }
                });
                //Holds the number of residents in the selected subcity
                var totalPopulation = graphic.attributes.POPULATION;

                var male = {
                    value: number.round(graphic.attributes.MALE / totalPopulation * 100, 2),
                    label: "Male"
                };

                var female = {
                    value: number.round(graphic.attributes.FEMALE / totalPopulation * 100, 2),
                    label: "Female"
                };

                var chartFields = [male, female];
                var chartSeriesArray = [];

                array.forEach(chartFields, function (chartField) {
                    var chartObject = {
                        y: chartField.value,
                        tooltip: chartField.label + ' : ' + chartField.value + ' %',
                        text: chartField.label
                    }
                    chartSeriesArray.push(chartObject);
                });
                
                chart.addSeries("PopulationSplit", chartSeriesArray);

                new Highlight(chart, "default");
                new Tooltip(chart, "default");
                new MoveSlice(chart, "default");

                pieChartCP.set("content", chart.node);
                return infoWindowTC.domNode;
            }
        }
    });