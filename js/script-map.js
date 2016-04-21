var laundromats = [];
var laundsIndex = [];
var laundMap = {};

function loadCsv(callback) {
    var link = 'https://docs.google.com/spreadsheets/d/13r5g12NOF_J-y8qgMJHL3i8-2PJdiU_FuOPcmZDHa4o/pub';
    csvToArray(link, function(data) {

        $.each(data, function(key, laund) {
            if (!laund.prefecture || !laund.city) {
                return true;
            }
            laundromats.push(laund);

            var key = laund.prefecture + ' - ' + laund.city;
            if (!(key in laundMap)) {
                laundMap[key] = [];
                laundsIndex.push(key);
            }
            laundMap[key].push(laund);

        });

        laundsIndex.sort();

        // create select
        callback();


    });

}

function csvToArray(link, callback) {
    $.ajax({
        type: 'GET',
        url: 'https://spreadsheets.google.com/feeds/cells/13r5g12NOF_J-y8qgMJHL3i8-2PJdiU_FuOPcmZDHa4o/od6/public/values?alt=json',
        dataType: 'jsonp',
        cache: false,
        success: function(data) { // 通信が成功した時
            var sheetsEntry = data.feed.entry; // 実データ部分を取得
            var data = parseData(sheetsEntry);
            callback(data); // レンダリング用の関数を呼ぶ
        },
        error: function() { // 通信が失敗した時
            console.log('error');
        }
    });
}

function parseData(sheetsEntry) { // データを整形して配列で返す
    var data = {};
    for (var i = 0; i < sheetsEntry.length; i++) {
        var dataCol = sheetsEntry[i].gs$cell.col;
        var dataRow = sheetsEntry[i].gs$cell.row;
        var value = sheetsEntry[i].gs$cell.$t;

        if (dataRow === "1") {
            continue;
        }

        if (!(dataRow in data)) {
            data[dataRow] = {};
        }

        if (dataCol === "1") {
            data[dataRow]['no'] = value;
        } else if (dataCol === "2") {
            data[dataRow]['name'] = value;
        } else if (dataCol === "3") {
            data[dataRow]['prefecture'] = value;
        } else if (dataCol === "4") {
            data[dataRow]['city'] = value;
        } else if (dataCol === "5") {
            data[dataRow]['address'] = value;
        } else if (dataCol === "6") {
            data[dataRow]['lat'] = value;
        } else if (dataCol === "7") {
            data[dataRow]['lng'] = value;
        } else if (dataCol === "8") {
            data[dataRow]['url'] = value;
        } else if (dataCol === "9") {
            data[dataRow]['memo'] = value;
        } else if (dataCol === "10") {
            data[dataRow]['time'] = value;
        }

    }
    console.log(data);



    return data;
}



// -------------------------------------------


var markers = new Array();
var infoWindows = new Array();
var currentInfoWindow = null;

function createAllMapLink() {

    var center = null;
    if (currentLat && currentLng) {
        center = new google.maps.LatLng(currentLat, currentLng);
    } else {
        center = new google.maps.LatLng(32.782627, 130.688244);
    }

    var mapOptions = {
        zoom: 12,
        center: center,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    // current
    if (currentLat && currentLng) {
        var marker = new google.maps.Marker({
            position: center,
            icon: 'image/blue-dot.png',
            map: map,
        });
    }


    for (var i = 0; i < laundromats.length; i++) {
        var laund = laundromats[i];

        if (!laund.lat || !laund.lng) {
            // console.log(laund);
            continue;
        }

        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(laund.lat, laund.lng),
            map: map,
        });
        markers.push(marker);

        var $div = $('<div>');

        $div.append('<h5>' + laund.name + '<h5>');

        var $p = $('<p>');
        $p.append(laund.address).append('<br>');
        if (laund.url && laund.url.length > 0) {
            $p.append('<a target="_blank" href="' + laund.url + '">' + laund.url + '</a>').append('<br>');
        }
        if (laund.time && laund.time.length > 0) {
            $p.append(laund.time).append('<br>');
        }
        if (laund.memo && laund.memo.length > 0) {
            $p.append(laund.memo);
        }
        $div.append($p);


        infoWindows.push(new google.maps.InfoWindow({
            content: $div[0]
        }));

        //クリックイベントで新規ウィンドウでリンク先を開く処理
        google.maps.event.addListener(marker, 'click', (function(marker, i) {
            return function() {

                if (currentInfoWindow) {
                    currentInfoWindow.close();
                }
                infoWindows[i].open(map, marker);

                currentInfoWindow = infoWindows[i];
            }
        })(marker, i));

    }
};

// 対応している場合
var currentLat = null;
var currentLng = null;

function getLocation() {
    if (navigator.geolocation) {
        // 現在地を取得
        navigator.geolocation.getCurrentPosition(

            // [第1引数] 取得に成功した場合の関数
            function(position) {
                // 取得したデータの整理
                var data = position.coords;

                // データの整理
                var lat = data.latitude;
                var lng = data.longitude;
                // var alt = data.altitude;
                // var accLatlng = data.accuracy;
                // var accAlt = data.altitudeAccuracy;
                // var heading = data.heading; //0=北,90=東,180=南,270=西
                // var speed = data.speed;

                console.log(lat + ', ' + lng);
                currentLat = lat;
                currentLng = lng;
            },

            // [第2引数] 取得に失敗した場合の関数
            function(error) {
                var errorInfo = [
                    "位置情報が取得できませんでした。",
                    "位置情報の取得が許可されませんでした。",
                    "位置情報が取得できませんでした。",
                    "位置情報が取得できませんでした。"
                ];

                // エラー番号
                var errorNo = error.code;

                // エラーメッセージ
                var errorMessage = "[エラー番号: " + errorNo + "]\n" + errorInfo[errorNo];

                // アラート表示
                alert(errorMessage);

            },

            // [第3引数] オプション
            {
                "enableHighAccuracy": false,
                "timeout": 8000,
                "maximumAge": 2000,
            }

        );
    }

    // 対応していない場合
    else {
        // エラーメッセージ
        var errorMessage = "お使いの端末は、GeoLacation APIに対応していません。";

        // アラート表示
        alert(errorMessage);

        // HTMLに書き出し
        document.getElementById('result').innerHTML = errorMessage;
    }
};

function main() {

    getLocation();
    loadCsv(createAllMapLink);



};

main();
