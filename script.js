var userLat;
var userLon;

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(setPosition, function (error) { console.log("Critical Error"), { timout: 5000 } });
    } else {
        console.log("GeoLocation Not Supported")
    }
}

function setPosition(position) {
    userLat = position.coords.latitude;
    userLon = position.coords.longitude;

    createList();
}

function getDistanceInKilometers(lat1, lon1, lat2, lon2) {
    const earthRadius = 6371; // Radius of the Earth in kilometers

    // Convert degrees to radians
    const toRadians = (degrees) => {
        return degrees * (Math.PI / 180);
    };

    // Calculate the differences between the latitudes and longitudes
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    // Calculate the haversine formula
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    // Calculate the distance in kilometers
    const distance = earthRadius * c;
    return distance;
}

function createList() {
    console.log("Refreshed List")
    fetch('locations.json')
        .then(response => response.json())
        .then(locations => {
            const locationsContainer = document.getElementById('locations-container');
            const totalLocations = document.getElementById('total-locations');
            totalLocations.innerText = "There are " + locations.length + " families, businesses and organizations on our site!";

            locationsContainer.innerHTML = null;

            locations = locations.sort(
                (p1, p2) => (getDistanceInKilometers(userLat, userLon, p1.lat, p1.lon) > getDistanceInKilometers(userLat, userLon, p2.lat, p2.lon)) ? 1 : (getDistanceInKilometers(userLat, userLon, p1.lat, p1.lon) < getDistanceInKilometers(userLat, userLon, p2.lat, p2.lon)) ? -1 : 0);

            for (var i = 0; i < 50; i++) {
                if (locations[i] != null) {
                    var location = locations[i];

                    const section = document.createElement('section');

                    section.id = location.name.replaceAll(" ", "_");

                    const content = document.createElement('div');

                    const name = document.createElement('h2');
                    name.textContent = location.name + " - " + location.rating + "★";
                    content.appendChild(name);

                    const textDiv = document.createElement('div');
                    textDiv.style = "display:flex;margin-bottom:1rem;";

                    const description = document.createElement('p');
                    description.textContent = location.description;
                    description.style = "display:inline;";
                    textDiv.appendChild(description)

                    const image = document.createElement('img');
                    image.src = location.image;
                    textDiv.appendChild(image);

                    content.appendChild(textDiv);

                    const distance = document.createElement('p');
                    var distanceAway = getDistanceInKilometers(userLat, userLon, location.lat, location.lon);
                    distanceAway = Math.round(distanceAway * 10) / 10;
                    if (distanceAway > 0) {
                        distance.textContent = distanceAway + "km away from you. | ";
                    } else {
                        distance.textContent = "Please enable location services. | ";
                    }
                    distance.style = "display:inline;"
                    content.appendChild(distance);

                    const link = document.createElement('a');
                    link.href = location.link;
                    link.textContent = "Google Maps Link";
                    link.style = "display:inline;";
                    link.target = "_blank";
                    content.appendChild(link);

                    section.appendChild(content);
                    locationsContainer.appendChild(section);
                }
            }
        });
}

getLocation();