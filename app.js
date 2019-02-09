var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("data.csv").then(function(hairData) {

    // Step 1: Parse Data/Cast as numbers
    // ==============================
    hairData.forEach(function(data) {
      data.abbr = data.abbr;
     
      console.log(data.state)
      data.income = +data.income;
      data.smokes = +data.smokes;
      console.log(data)
    });

    // Step 2: Create scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear()
      .domain([35000, d3.max(hairData, d => d.income)+5000])
      .range([2, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([8, d3.max(hairData, d => d.smokes)+3])
      .range([height, 0]);

    // Step 3: Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Step 4: Append Axes to the chart
    // ==============================
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);


    // Step 5: Create Circles
   
    var textGroup = chartGroup.selectAll("text")
    .data(hairData)
    .enter()
    .append("text")
    .attr("x", d => xLinearScale(d.income))
    .attr("y", d => yLinearScale(d.smokes))
    .attr("text-anchor", "middle")
    .attr("font-family", "Sans-Serif")
    .text(d => d.abbr)
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle")
    .data(hairData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.income))
    .attr("cy", d => yLinearScale(d.smokes))
    .attr("r", d => d.smokes)
    .attr("fill", "Brown")
    .attr("opacity", d => (d.income / 100000))
    .attr("id", d => d.abbr);
    

 
    
    // Step 6: Initialize tool tip
    // ==============================
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.state}<br>Income: ${d.income}<br>Smokes: ${d.smokes}`);
      });

    // Step 7: Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip);

    // Step 8: Create event listeners to display and hide the tooltip
    // ==============================
    circlesGroup.on("click", function(data) {
      toolTip.show(data, this);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });

    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("% Smokers");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("Annual Income");

      hairData.forEach(function(dat){
        console.log(dat.abbr)
        var cirx = document.getElementById( dat.abbr );
       
        //var div = document.createElement('div');
        //div.textContent = "Sup, y'all?";
        //div.setAttribute('class', 'note');
        //document.body.appendChild(div);
        var newText = document.createElement( 'text' ); // create new textarea
        newText.innerHTML = dat.abbr;
        xval = xLinearScale(dat.income)
        yval = yLinearScale(dat.smokes)
        newText.setAttribute("x", xval)
        newText.setAttribute("y", yval)
        newText.setAttribute("text-anchor", "middle")
        
        console.log(newText)
        console.log(cirx.nextElementSibling)
        cirx.parentNode.insertBefore( newText, cirx.nextSibling );
      })
  });
