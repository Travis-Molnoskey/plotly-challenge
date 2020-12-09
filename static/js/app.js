

function optionChanged() {

    d3.json("../samples.json").then(function(data){

        var dropMenu = d3.select("#selDataset");

        dropMenu.selectAll("option")
            .data(data.names)
            .enter()
            .append("option")
            .attr("value",d=>d)
            .text(d=>d);

        updatePlotly(data);


    });
};


    function updatePlotly(data){

        var dropMenu = d3.select("#selDataset");

        let idChoice = dropMenu.property("value");

        otu_ids=[]
        otu_labels=[]
        sample_values=[]

        data.samples.forEach(function(d){
            if (d.id === idChoice){
                otu_ids = d.otu_ids;
                otu_labels = d.otu_labels;
                sample_values = d.sample_values;
            };
        });

        //create top 10 records for bar chart
        otu_ids.map(d=>`OTU ${d}`)

        var top_sample_values = sample_values.slice(0,10).reverse()
        var top_otu_labels = otu_labels.slice(0,10).reverse()
        var top_otu_ids = otu_ids.map(d=>`OTU ${d}`).slice(0,10).reverse()

        //create bar chart
        var traceBar = {
            type:"bar",
            y:top_otu_ids,
            x:top_sample_values,
            text:top_otu_labels,
            orientation: 'h'
        }

        var barData = [traceBar];

        Plotly.newPlot("bar",barData)

        //create bubble chart
        var traceBubble = {
            mode:'markers',
            x:otu_ids,
            y:sample_values,
            text:top_otu_labels,
            marker:{
                size:sample_values,
                color:otu_ids
            }
        };

        var bubbleData = [traceBubble];

        Plotly.newPlot("bubble", bubbleData);

        //fill metadata
        let metadata = {}
         
        data.metadata.forEach(function(d){
        if (d.id == idChoice){
            metadata = d
            };
        });

        sampleMetadata = d3.select("#sample-metadata").selectAll("ul").data(Object.entries(metadata));

        sampleMetadata.enter()
            .append("ul")
            .merge(sampleMetadata)
            .text(d=>`${d[0]}: ${d[1]}`);

    };

optionChanged()