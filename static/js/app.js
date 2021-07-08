
 // Import json file 
var data = d3.json("samples.json").then(function(data) {
    //create variable to hold the names object from the dataset
    var names = data.names;
    console.log(names);
    //Building the drop down menu options from the names data
    d3.select("#selDataset")
      .selectAll('option')
      .data(names)
      .enter()
      .append('option')
      .text(function (d) { return d; })
      .attr("value", function (d) { return d; })
});

//function to grab vlaue when changed and build plots
function optionChanged(value) {
    //Grab the dataset
    var data = d3.json("samples.json").then(function(data) {
    //create variable to hold the sample data
    var samples = Object.values(data.samples);
    //create variable to hold the metadata
    var metadata = Object.values(data.metadata);
    //filter the metadata by the selected participant id
    var mdfiltered = metadata.filter(d => d.id == value );
    console.log(mdfiltered);
    //unpack the objects from the filtered metadata and assign to variable
    var mdunpacked = Object.values(mdfiltered);
    console.log(mdunpacked);
    //select the divider element where the metadata will be displayed
    var mddiv = d3.select("#sample-metadata")
    //clear any previous data, then add the key value pairs to the element
    mdunpacked.forEach(function(mdupdate) {
        console.log(mdupdate);
        mddiv.html('');
        var row = mddiv.append("p");
        Object.entries(mdupdate).forEach(function([key, value]) {
          console.log(key, value);
          var cell = row.append("p");
          cell.text(`${key}: ${value}`);
        });
      });

    
    //filter the sample data by the selected participant id  
    var filtered = samples.filter(d => d.id == value );
    //unpack the filtered data
    var sampleData = filtered[0]
    //assign the sample_values to a variable
    var sampleValues = sampleData.sample_values;
    //grab the top 10
    var tensampleval = sampleValues.slice(0, 10);
    //assign the otu_ids to a variable
    var otu_ids = sampleData.otu_ids;
    //grab the top 10
    var tenotu_ids = otu_ids.slice(0, 10);
    //add 'OTU' to the id values - also turns int into string in the array
    var otu_idsString = tenotu_ids.map(i => 'OTU '+i)
    //assign otu_labels to variable
    var otu_labels = sampleData.otu_labels;
    //grab the top 10
    var tenotu_labels = otu_labels.slice(0, 10);
    //check your work
    console.log(filtered);
    console.log(sampleData);
    console.log(tensampleval);
    console.log(tenotu_ids);
    console.log(tenotu_labels);
    console.log(otu_idsString);
    
    //build the trace for the bar graph
    var trace1 = {
        type: "bar",
        y: otu_idsString,
        x: tensampleval,
        orientation: 'h',
        marker:{
            color: 'lightblue'
        }
    };
    //assign the trace to the data variable
    var data = [trace1];

    //configure the graph layout
    var layout = {
        width: 800,
        height: 800,
        title: `${value} Top 10 OTU values`,
        yaxis: {
            tickmode: "array", 
            tickvals:otu_idsString,
            ticktext: otu_idsString
          }
    };
    //draw the plot
    Plotly.newPlot("bar", data, layout);

    //build the trace for the bubble chart
    var trace2 = {
        x: otu_ids,
        y: sampleValues,
        mode: 'markers',
        text: otu_labels,
        marker: {
          size: sampleValues,
          color: otu_ids
        }
      };
      
      //assign the trace to the data variable
      var data2 = [trace2];
      
      //configure the graph layout
      var layout = {
          
        title: `${value} OTU Sample Values`,
        showlegend: false,
        height: 800,
        width: 1500
      };
      //draw the plot
      Plotly.newPlot('bubble', data2, layout);
});
}
