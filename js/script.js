
var laundromats = [];
var laundsIndex = [];
var laundMap = {};

function loadCsv(){
  var link = 'https://docs.google.com/spreadsheets/d/13r5g12NOF_J-y8qgMJHL3i8-2PJdiU_FuOPcmZDHa4o/pub';
  csvToArray(link, function(csv){



    $.each(csv, function(i, row){
      // skip header
      if(i===0) return true;

      console.log(row);

      var laund = {};
      laund.id = row[0];
      laund.name = row[1];
      laund.prefecture = row[2];
      laund.city = row[3];
      laund.address = row[4];
      laund.ll = row[5];
      laund.url = row[6];
      laund.memo = row[7];
      laund.time = row[8];

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

function xcsvToArray(filename, callback) {
  $.get(filename, function(csvdata) {
    csvdata = csvdata.replace(/\r/gm, "");
    var line = csvdata.split("\n"),
        ret = [];
    for (var i in line) {
      //空行はスルーする。
      if (line[i].length == 0) continue;

      var row = line[i].split(",");
      ret.push(row);
    }
    callback(ret);
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
      var rows = catedorizeData(sheetsEntry);
      callback(rows); // レンダリング用の関数を呼ぶ
    },
    error: function(){ // 通信が失敗した時
      console.log('error');
    }
  });
}

function catedorizeData(sheetsEntry){ // データを整形して配列で返す
   var categorized = [];
   for(var i = 0; i < sheetsEntry.length; i++) {
     var dataCol = sheetsEntry[i].gs$cell.col;
     var dataRow = sheetsEntry[i].gs$cell.row;

     if(dataCol == 1 && dataRow != sheetsEntry[i+1].gs$cell.row){
       categorized[categorized.length] = [];
     }
     categorized[categorized.length-1].push(sheetsEntry[i]);
   }
   return categorized;
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

  var launds = laundMap[key];

  $.each(launds, function(i, laund){
    // <li class="list-group-item">リスト1</li>
    // <li class="list-group-item">リスト2</li>
    // <li class="list-group-item">リスト3</li>
    var li = $('<li class="list-group-item">');
    li.append(laund.name).append('<br>');
    li.append(laund.address).append('<br>');
    li.append('<a target="_blank" href="' + laund.url + '">' + laund.url +'</a>').append('<br>');
    li.append(laund.time).append('<br>');
    li.append(laund.memo);


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
