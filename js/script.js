
var laundromats = [];
var laundsIndex = [];
var laundMap = {};

function loadCsv(){
  var link = 'https://docs.google.com/spreadsheets/d/13r5g12NOF_J-y8qgMJHL3i8-2PJdiU_FuOPcmZDHa4o/pub';
  csvToArray(link, function(data){

    $.each(data, function(key, laund){

      laundromats.push(laund);

      var key = laund.prefecture + ' - ' + laund.city;
      if(!(key in laundMap)){
        laundMap[key] = [];
        laundsIndex.push(key);
      }
      laundMap[key].push(laund);

    });

    laundsIndex.sort();

    // create select
    createSelect();


  });

}

function csvToArray(link, callback) {
  $.ajax({
    type: 'GET',
    url: 'https://spreadsheets.google.com/feeds/cells/13r5g12NOF_J-y8qgMJHL3i8-2PJdiU_FuOPcmZDHa4o/od6/public/values?alt=json',
    dataType: 'jsonp',
    cache: false,
    success: function(data){ // 通信が成功した時
      var sheetsEntry = data.feed.entry; // 実データ部分を取得
      var data = parseData(sheetsEntry);
      callback(data); // レンダリング用の関数を呼ぶ
    },
    error: function(){ // 通信が失敗した時
      console.log('error');
    }
  });
}

function parseData(sheetsEntry){ // データを整形して配列で返す
   var data = {};
   for(var i = 0; i < sheetsEntry.length; i++) {
     var dataCol = sheetsEntry[i].gs$cell.col;
     var dataRow = sheetsEntry[i].gs$cell.row;
     var value = sheetsEntry[i].gs$cell.$t;

     if(dataRow === "1"){
       continue;
     }

     if(!(dataRow in data)){
       data[dataRow] = {};
     }

     if(dataCol === "1"){
       data[dataRow]['no'] = value;
     }else if(dataCol === "2"){
       data[dataRow]['name'] = value;
     }else if(dataCol === "3"){
       data[dataRow]['prefecture'] = value;
     }else if(dataCol === "4"){
       data[dataRow]['city'] = value;
     }else if(dataCol === "5"){
       data[dataRow]['address'] = value;
     }else if(dataCol === "6"){
       data[dataRow]['lat'] = value;
     }else if(dataCol === "7"){
       data[dataRow]['lng'] = value;
     }else if(dataCol === "8"){
       data[dataRow]['url'] = value;
     }else if(dataCol === "9"){
       data[dataRow]['memo'] = value;
     }else if(dataCol === "10"){
       data[dataRow]['time'] = value;
     }

   }
   console.log(data);



   return data;
 }

function createSelect(){

  var area_select_form = $("#select_area");
  var select_html = "";
  select_html += '<option value="notselect">地域を選択してください</option>';
  for (var i in laundsIndex) {
    var place = laundsIndex[i];
    select_html += '<option value="' + place + '"' + '>' + place + "</option>";
  }

  area_select_form.html(select_html);
  area_select_form.change();
}

function showList(key){

  $('#laundromat-list').empty();

  var launds = laundMap[key];

  $.each(launds, function(i, laund){
    // <li class="list-group-item">リスト1</li>
    // <li class="list-group-item">リスト2</li>
    // <li class="list-group-item">リスト3</li>
    var li = $('<li class="list-group-item">');
    li.append(laund.name).append('<br>');
    li.append(laund.address).append('<br>');
    if(laund.url && laund.url.length > 0){
      li.append('<a target="_blank" href="' + laund.url + '">' + laund.url +'</a>').append('<br>');
    }
    if(laund.time && laund.time.length > 0){
      li.append(laund.time).append('<br>');
    }
    if(laund.memo && laund.memo.length > 0){
      li.append(laund.memo);
    }

    if(laund.address && laund.address.length > 0){
      // li.append(laund.lat + ',' + laund.lng);
      // li.append('<iframe width="600" height="450" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="http://maps.google.co.jp/maps?ll=' + laund.lat + ',' + laund.lng + '&q=' + laund.name + '&output=embed&t=m&z=16"></iframe>');

      // var $mapdiv = $('<div class="ggmap">');
      // var $ggmap = $('<iframe width="600" height="450" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="http://maps.google.co.jp/maps?q=' + laund.address + '&output=embed&t=m&z=14"></iframe>');

      // $mapdiv.append($ggmap);

      // li.append($mapdiv);
      li.append('<br>');
      li.append('<a target="_blank" href="http://maps.google.co.jp/maps?q=' + laund.address + '&output=embed&t=m&z=14">' + '[Google Mapでみる]' + '</a>');

    }



    $('#laundromat-list').append(li);

  });

}

function main(){

  loadCsv();

  $('#select_area').on('change', function(){
    var value = $('#select_area').val();
    if(value === 'notselect'){
      return;
    }

    // show list

    showList(value);
  });


};

main();
