

function optionChanged() {

    d3.json("samples.json").then(function(data){

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
        console.log(metadata)
        var guageData = [
            {
                domain: { x: [0, 9] },
                value: metadata.wfreq,
                title: { text: `Belly Button Washing Frequency (Per Week)` },
                type: "indicator",
                mode: "gauge+number",
                gauge:{
                    steps:[
                        {range:[0,1], color:"C0DE90", line:{width:3}},
                        {range:[1,2], color:"B8DE80", line:{width:3}},
                        {range:[2,3], color:"B0DE70", line:{width:3}},
                        {range:[3,4], color:"A8DE60", line:{width:3}},
                        {range:[4,5], color:"A0DE50", line:{width:3}},
                        {range:[5,6], color:"98DE40", line:{width:3}},
                        {range:[6,7], color:"90DE30", line:{width:3}},
                        {range:[7,8], color:"88DE20", line:{width:3}},
                        {range:[8,9], color:"80DE10", line:{width:3}}
                    ],
                    threshold: {
                        line: { color: "red", width: 6 },
                        value: metadata.wfreq
                    },
                    axis:{range:[0,9]}
                }
            }
        ];
        
        var guageLayout = { width: 600, height: 500, margin: { t: 0, b: 0 } };

        Plotly.newPlot('gauge', guageData, guageLayout);

    };

optionChanged()