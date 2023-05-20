console.log("Hellow World")

function getUserLocation() {
    if (Navigator.geolocation) {
        Navigator.geolocation.getCurrentPosition(
            function (position) {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                console.log("Latitude: " + latitude);
                console.log("Longitude: " + longitude);
            },
            function (error) {
                console.error("Error getting user location:", error);
            }
        );
    } else {
        console.error("Geolocation is not supported by this browser.");
    }
}

// Example usage
getUserLocation();