// Use D3 to read samples.json file

function init() {
    d3.json("samples.json").then((data) => {

        // adding data to dropdown menu

        var DropdownMenu = d3.select("#selDataset");
        var dNames = data.names;
        dNames.forEach((name) => {
              var dNames = DropdownMenu.append("option")
                           .attr("value", name)
                           .text(name);
        })

        //Use sample_values and create a Horizontal bar chart
        //+ dropdown menu to display the top 10 OTUs found in that individual.

        var values = data.samples[0].sample_values;

        // otu_ids

        var labels = data.samples[0].otu_ids;

        // otu_labels

        var hovertext = data.samples[0].otu_labels;

        var top10Values = values.slice(0,10).reverse();
        var top10Labels = labels.slice(0,10).reverse();
        var top10Hovertext = hovertext.slice(0,10).reverse();
        var barChartDiv = d3.select("#bar");

        var trace1 = {
            y: top10Labels.map(Object => "OTU " + Object),
            x: top10Values,
            text: top10Hovertext,
            type: "bar",
            orientation: "h"

        };


        var layout = {
            margin: {
                t: 20,
                b: 20
            }
        };

        var barchartData = [trace1]

        Plotly.newPlot("bar", barchartData, layout);

        // create a bubble chart

        var trace2 = {
            x: labels,
            y: values,
            text: hovertext,
            mode: "markers",

            
            marker: {

                // Use sample_values for the marker size
                size: values,

                // Use otu_ids for the marker colors
                color: labels,
            }
        }

        var BubbleData = [trace2];
        
        var layoutBubble = {
            xaxis: {title: "OTU ID"},
        }

        Plotly.newPlot("bubble", BubbleData, layoutBubble);

        var sampleMd = d3.select("#sample-metadata");
        var FirstName = data.metadata[0];

        // display

        Object.entries(FirstName).forEach(([key, value]) => {
            sampleMd.append("p").text(`${key}: ${value}`);

        })
    });
}

// Update all plots and metadata when new sample is selected.

function optionChanged(selectValue) {
    d3.json("samples.json").then((data) => {

        var samples = data.samples;
        var newSample = samples.filter(sample => sample.id === selectValue);
        
        // sample_values = y values
        var values = newSample[0].sample_values;

        // otu_ids = x values
        var labels = newSample[0].otu_ids;

       // otu_labels = text values 
        var hovertext = newSample[0].otu_labels;
        var top10Values = values.slice(0,10).reverse();
        var top10Labels = labels.slice(0,10).reverse();
        var top10Hovertext = hovertext.slice(0,10).reverse();

        var barChartDiv = d3.select("#bar");

        // restyle to update barchart

        Plotly.restyle("bar", "y", [top10Labels.map(Object => "OTU " + Object)]);
        Plotly.restyle("bar", "x", [top10Values]);
        Plotly.restyle("bar", "text", [top10Hovertext]);

        // Update values for Bubblechart

        Plotly.restyle("bubble", "x", [labels]);
        Plotly.restyle("bubble", "y", [values]);
        Plotly.restyle("bubble", "size", [values]);
        Plotly.restyle("bubble", "text", [hovertext]);
        Plotly.restyle("bubble", "color", [labels]);


       // Display sample metadata (individual's demographic info).
        var sampleMd = d3.select("#sample-metadata");
        sampleMd.html("");
 
        var Demographics = data.metadata;
        var newMetaData = Demographics.filter(sample => sample.id === parseInt(selectValue));


       // Display each key-value pair from the metadata JSON object somewhere on the page.
        Object.entries(newMetaData[0]).forEach(([key, value]) => {
            sampleMd.append("p").text(`${key}: ${value}`);
        })
    });
}
 
init();
