window.onload = function () {

    var map = new AMap.Map("container", {
        resizeEnable: true,
        zoomEnable: true,
        center: [116.397428, 39.90923],
        zoom: 11
    });

    var scale = new AMap.Scale();
    map.addControl(scale);

    var arrivalRange = new AMap.ArrivalRange();
    var x, y, t, vehicle = "SUBWAY,BUS";
    var workAddress, workMarker;
    var rentMarkerArray = [];
    var polygonArray = [];
    var amapTransfer;

    var infoWindow = new AMap.InfoWindow({
        offset: new AMap.Pixel(0, -30)
    });

    var auto = new AMap.Autocomplete({
        input: "work-location"
    });
    AMap.event.addListener(auto, "select", workLocationSelected);


    function takeBus(radio) {
        vehicle = radio.value;
        loadWorkLocation()
    }

    function takeSubway(radio) {
        vehicle = radio.value;
        loadWorkLocation()
    }

    function importRentInfo(fileInfo) {
        var file = fileInfo.files[0].name;
        loadRentLocationByFile(file);
    }

    function workLocationSelected(e) {
        workAddress = e.poi.name;
        loadWorkLocation();
    }

    function loadWorkMarker(x, y, locationName) {
        workMarker = new AMap.Marker({
            map: map,
            title: locationName,
            icon: 'images/red.png',
            position: [x, y]

        });
    }

    function loadWorkRange(x, y, t, color, v) {
        arrivalRange.search([x, y], t, function (status, result) {
            if (result.bounds) {
                for (var i = 0; i < result.bounds.length; i++) {
                    var polygon = new AMap.Polygon({
                        map: map,
                        fillColor: color,
                        fillOpacity: "0.4",
                        strokeColor: color,
                        strokeOpacity: "0.8",
                        strokeWeight: 1
                    });
                    polygon.setPath(result.bounds[i]);
                    polygonArray.push(polygon);
                }
            }
        }, {
                policy: v
            });
    }

    function addMarkerByAddress(address) {
        var geocoder = new AMap.Geocoder({
            city: "北京",
            radius: 1000
        });
        geocoder.getLocation(address, function (status, result) {
            if (status === "complete" && result.info === 'OK') {
                if (address[2] <= 1000) {
                    rentMarker = new AMap.Marker({
                        map: map,
                        icon: 'images/blue.png',
                        position: [parseFloat(address[3].substr(1, 10)), parseFloat(address[4].substr(1, 9))]
                    });
                }
                else if (address[2] >= 1000 && address[2] <= 2000) {
                    rentMarker = new AMap.Marker({
                        map: map,
                        icon: 'images/green.png',
                        position: [parseFloat(address[3].substr(1, 10)), parseFloat(address[4].substr(1, 9))]
                    });
                }
                else if (address[2] >= 2000 && address[2] <= 3000) {
                    rentMarker = new AMap.Marker({
                        map: map,
                        icon: 'images/yellow.png',
                        position: [parseFloat(address[3].substr(1, 10)), parseFloat(address[4].substr(1, 9))]
                    });
                }
                else {
                    rentMarker = new AMap.Marker({
                        map: map,
                        icon: 'images/yellow.png',
                        position: [parseFloat(address[3].substr(1, 10)), parseFloat(address[4].substr(1, 9))]
                    });
                }

                rentMarkerArray.push(rentMarker);

                rentMarker.content = "<div>房源：<a target = '_blank' href='" + address[1] + "'>" + address[0] + " " + "价格" + address[2] + "</a><div>"
                rentMarker.on('click', function (e) {
                    infoWindow.setContent(e.target.content);
                    infoWindow.open(map, e.target.getPosition());
                    if (amapTransfer) amapTransfer.clear();
                    amapTransfer = new AMap.Transfer({
                        map: map,
                        policy: AMap.TransferPolicy.LEAST_TIME,
                        city: "北京市",
                        panel: 'transfer-panel'
                    });
                    amapTransfer.search([
                        {keyword: workAddress},
                        {keyword: address[0]}],
                        function (status, result) {})
                });
            }
        })
    }

    function delWorkLocation() {
        if (polygonArray) map.remove(polygonArray);
        if (workMarker) map.remove(workMarker);
        polygonArray = [];
    }

    function delRentLocation() {
        if (rentMarkerArray) map.remove(rentMarkerArray);
        rentMarkerArray = [];
    }

    function loadWorkLocation() {
        delWorkLocation();
        var geocoder = new AMap.Geocoder({
            city: "北京",
            radius: 1000
        });

        geocoder.getLocation(workAddress, function (status, result) {
            if (status === "complete" && result.info === 'OK') {
                var geocode = result.geocodes[0];
                x = geocode.location.getLng();
                y = geocode.location.getLat();
                loadWorkMarker(x, y);
                loadWorkRange(x, y, 60, "#3f67a5", vehicle);
                map.setZoomAndCenter(12, [x, y]);
            }
        })
    }

    function loadRentLocationByFile(fileName) {
        delRentLocation();
        var rent_locations = new Set();
        $.get(fileName, function (data) {
            data = data.split("\n");
            data.forEach(function (item, index) {
                item = item.split(",");
                rent_locations.add([item[0], item[1], item[2], item[3], item[4]]);
            });
            rent_locations.forEach(function (element, index) {
                addMarkerByAddress(element);
            });
        });
    }

    function loadrentlocationfile (filename) {
        delRentLocation();
        var rent_location = new Set();
        
    }
}