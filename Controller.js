async function changePriceIcon() {
    var priceFilter = document.getElementById("1");

    var origin = document.getElementById("origin").value;
    var destination = document.getElementById("destination").value;
    var day = document.getElementById("day").value;

    const url = 'https://www.ryanair.com/api/farfnd/v4/oneWayFares/' + origin + '/'+ destination +'/cheapestPerDay?outboundMonthOfDate=' + day + '&currency=EUR';

    flightsData = await ryanAirfetchFlightData(url);
    var parentElement = document.getElementById("flightData");
    parentElement.innerHTML = "";

    if (priceFilter.src.includes("arrowDOWN.svg")) {
        priceFilter.src = "images/arrowUP.svg";
        flightsData.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        console.log(flightsData);
        flightsData.forEach(element => {
            createFlightElement("flightData", element.logo, element.departureTime, element.arrivalTime, origin, destination, element.price, element.date)
        });
    } else {
        priceFilter.src = "images/arrowDOWN.svg";
        flightsData.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        flightsData.forEach(element => {
            createFlightElement("flightData", element.logo, element.departureTime, element.arrivalTime, origin, destination, element.price, element.date)
        });
    }
}

function changeTimeIcon() {
    var priceFilter = document.getElementById("3");
    if (priceFilter.src.includes("arrowDOWN.svg")) {
        priceFilter.src = "images/arrowUP.svg";
    } else {
        priceFilter.src = "images/arrowDOWN.svg";
    }
}

function changeOptions() {
    var option = document.getElementById("2");
    var text = document.getElementById("options");
    var selected = option.getAttribute("src");  // Get the current src attribute
    var origin = document.getElementById("origin").value;
    var destination = document.getElementById("destination").value;

    var parentElement = document.getElementById("flightData");
    parentElement.innerHTML = "";
    
    switch (selected) {
        case "logos/ryanairLogo.png":
            option.setAttribute("src", "logos/easyjetLogo.png");
            text.innerHTML = "Easyjet";
            flightsData.forEach(element => {
                if (element.logo == "logos/easyjetLogo.png"){
                    createFlightElement("flightData", element.logo, element.departureTime, element.arrivalTime, origin, destination, element.price, element.date)
                }
            });
            break;
        case "logos/easyjetLogo.png":
            option.setAttribute("src", "logos/wizzairLogo.webp");
            text.innerHTML = "Wizz Air";
            flightsData.forEach(element => {
                if (element.logo == "logos/wizzairLogo.webp"){
                    createFlightElement("flightData", element.logo, element.departureTime, element.arrivalTime, origin, destination, element.price, element.date)
                }
            });
            break;
        case "logos/wizzairLogo.webp":
            option.setAttribute("src", "logos/allLogo.jpg");
            text.innerHTML = "ALL";
            flightsData.forEach(element => {
                createFlightElement("flightData", element.logo, element.departureTime, element.arrivalTime, origin, destination, element.price, element.date);
            });
            break;
        case "logos/allLogo.jpg":
            option.setAttribute("src", "logos/ryanairLogo.png");
            text.innerHTML = "Ryan Air";
            flightsData.forEach(element => {
                if (element.logo == "logos/ryanairLogo.png"){
                    createFlightElement("flightData", element.logo, element.departureTime, element.arrivalTime, origin, destination, element.price, element.date)
                }
            });
            break;
        default:
            console.log("Problem occurred!");
    }
}

function createFlightElement(parentId, logo, departureTime, arrivalTime, departureAirport, arrivalAirport, price, date) {
    // Create the main flight container div
    var flightDiv = document.createElement('div');
    flightDiv.className = 'flight';

    // Create and append the logo image
    var logoImg = document.createElement('img');
    logoImg.className = 'logo';
    logoImg.src = logo;
    flightDiv.appendChild(logoImg);

    // Create and append the dateContainer div with dateDepart h4
    var dateContainerDiv = document.createElement('div');
    dateContainerDiv.className = 'dateContainer';
    var dateDepart = document.createElement('h4');
    dateDepart.id = 'dateDepart';
    dateDepart.innerText = date;
    dateContainerDiv.appendChild(dateDepart);
    flightDiv.appendChild(dateContainerDiv);

    // Create and append the arrival div
    var arrivalDiv = document.createElement('div');
    arrivalDiv.className = 'arrival';
    flightDiv.appendChild(arrivalDiv);

    // Create and append the first times div
    var timesDiv1 = document.createElement('div');
    timesDiv1.className = 'times';
    arrivalDiv.appendChild(timesDiv1);

    // Create and append the first arrival time and airport code
    var arrivalTime1 = document.createElement('h2');
    arrivalTime1.className = 'arrivalTimes';
    arrivalTime1.innerText = departureTime;
    timesDiv1.appendChild(arrivalTime1);

    var airport1 = document.createElement('h4');
    airport1.className = 'airports';
    airport1.innerText = departureAirport;
    timesDiv1.appendChild(airport1);

    // Create and append the travel image
    var travelImg = document.createElement('img');
    travelImg.src = 'images/travel.svg';
    arrivalDiv.appendChild(travelImg);

    // Create and append the second times div
    var timesDiv2 = document.createElement('div');
    timesDiv2.className = 'times';
    arrivalDiv.appendChild(timesDiv2);

    // Create and append the second arrival time and airport code
    var arrivalTime2 = document.createElement('h2');
    arrivalTime2.className = 'arrivalTimes';
    arrivalTime2.innerText = arrivalTime;
    timesDiv2.appendChild(arrivalTime2);

    var airport2 = document.createElement('h4');
    airport2.className = 'airports';
    airport2.innerText = arrivalAirport;
    timesDiv2.appendChild(airport2);

    // Create and append the price
    var price1 = document.createElement('h4');
    price1.className = 'price';
    price1.innerText = price;
    flightDiv.appendChild(price1);

    // Append the entire flight div to the parent element
    var parentElement = document.getElementById(parentId);
    if (parentElement) {
        parentElement.appendChild(flightDiv);
    } else {
        console.log("Parent element not found!");
    }
}


function getTimeFromDateTime(dateTimeString) {
    if (!dateTimeString) return null;
    const time = dateTimeString.split('T')[1];
    return time.slice(0, 5); // Extract HH:MM from HH:MM:SS
}

// Function to fetch and process the JSON data
async function ryanAirfetchFlightData(url) {
    try {
        // Fetch the JSON data from the URL
        const response = await fetch(url);
        // Parse the JSON data
        const data = await response.json();
        
        // Initialize an empty list to store the extracted information
        const flightsList = [];

        // Access the 'fares' array from the 'outbound' object
        const fares = data.outbound.fares;

        // Loop through the fares array and extract the relevant information
        fares.forEach(fare => {
            // Only include fares that are not unavailable
            if (!fare.unavailable && fare.price) {
                // Extract information for each flight
                const flightInfo = {
                    logo: 'logos/ryanairLogo.png',
                    date: fare.day,
                    price: fare.price.value + " €",
                    departureTime: getTimeFromDateTime(fare.departureDate),
                    arrivalTime: getTimeFromDateTime(fare.arrivalDate)
                
                };
                // Add the flight information to the list
                flightsList.push(flightInfo);
            }
        });
        
        // Log the flights list to the console

        return flightsList
    } catch (error) {
        console.error('Error fetching the flight data:', error);
    }
}

async function search(){
    var origin = document.getElementById("origin").value;
    var destination = document.getElementById("destination").value;
    var day = document.getElementById("day").value;

    var mainDate = document.getElementById("Maindate");
    var mainAirports = document.getElementById("Mainairports");

    mainDate.innerHTML = day;
    mainAirports.innerHTML = origin + " - " + destination;


    const url = 'https://www.ryanair.com/api/farfnd/v4/oneWayFares/' + origin + '/'+ destination +'/cheapestPerDay?outboundMonthOfDate=' + day + '&currency=EUR';

    flightsData = await ryanAirfetchFlightData(url);
    var parentElement = document.getElementById("flightData");
    parentElement.innerHTML = "";
    flightsData.forEach(element => {
        createFlightElement("flightData", element.logo, element.departureTime, element.arrivalTime, origin, destination, element.price, element.date)
    });
    var option = document.getElementById("2");
    var text = document.getElementById("options");

    option.setAttribute("src", "logos/allLogo.jpg");
    text.innerHTML = "ALL";
}

//autoselect
function selectText() {
    var inputs = document.getElementsByClassName("info");
    for (var i = 0; i < inputs.length; i++) {
        inputs[i].addEventListener('focus', function() {
            this.select();
        });
    }
}