// function to build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Inspect the data in the console
    console.log(data);

    // get the metadata field
    let metadataField = data.metadata;

    // Filter the metadata for the object with the desired sample number
    let selectedMetadata = metadataField.filter(item => item.id == sample);    
    
    // Use d3 to select the panel with id of `#sample-metadata`
    let panel = d3.select('#sample-metadata');
    
    // Use `.html("") to clear any existing metadata
    panel.html("");

    // Create an array that contains the keys of filtered metadata and convert them to uppercase
    let keys = Object.keys(selectedMetadata[0]).map(str => str.toUpperCase());
    
    // Create an array of each key's value
    let values = Object.values(selectedMetadata[0]);
  
    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.  
    for (let i= 0; i < keys.length; i++){
      let key = keys[i];
      let value = values[i];
      panel.append('div').text(`${key}: ${value}`);
    };
  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    let sampleField = data.samples;
    
    // Filter the samples for the object with the desired sample number
    let selectedSample = sampleField.filter(item => item.id == sample);

    // Get the otu_ids, otu_labels, and sample_values
    let otuIds = selectedSample[0].otu_ids;
    let otuLabels = selectedSample[0].otu_labels;
    let sampleValues = selectedSample[0].sample_values;
    
    // Build a Bubble Chart
    let bubbleTrace1 = {
      x: otuIds,
      y: sampleValues,
      text: otuLabels,
      mode: 'markers',
      marker: {
        size: sampleValues,
        color: otuIds,
      }
    };

    // Data array
    let bubbleData = [bubbleTrace1];

    // Apply a title and titles for the x-axis and y-axis to the layout
    let bubbleLayout = {
      title: 'Bacteria Cultures Per Sample',
      xaxis: {
        title: 'OTU ID'
      },
      yaxis: {
        title: 'Number of Bacteria'
      }
    };

    // Render the Bubble Chart
    Plotly.newPlot('bubble', bubbleData, bubbleLayout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    let barYticks = otuIds.map(item => `OTU ${item} `);

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    let barTrace1 = {
      x: sampleValues.slice(0,10).reverse(),
      y: barYticks.slice(0,10).reverse(),
      text: otuLabels.slice(0,10).reverse(),
      type: 'bar',
      orientation: 'h'
    };

    // Data array
    let barData = [barTrace1];

    // Apply a title and title of x-axis to the layout
    let barLayout = {
      title: 'Top 10 Bacteria Cultures Found',
      xaxis: {
        title: 'Number of Bacteria'
      }
    };

    // Render the Bar Chart
    Plotly.newPlot('bar', barData, barLayout);
  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    let nameField = data.names;
    
    // Use d3 to select the dropdown with id of `#selDataset`
    let dropdownMenu = d3.select('#selDataset');
    
    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    for (i = 0; i < nameField.length; i++) {
      dropdownMenu.append('option').text(nameField[i]);
    }

    // Get the first sample from the list
    let firstSample = nameField[0];
    
    // Build charts and metadata panel with the first sample
    buildMetadata(firstSample);
    buildCharts(firstSample);
  });
}

// Function for event listener
function optionChanged(newSample) {
  
  // Build charts and metadata panel each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
}

// Initialize the dashboard
init();
