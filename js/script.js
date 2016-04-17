
var laundromats = [];
var laundsIndex = [];
var laundMap = {};

function loadCsv(){
  var link = 'https://docs.google.com/spreadsheets/d/13r5g12NOF_J-y8qgMJHL3i8-2PJdiU_FuOPcmZDHa4o/pub?output=csv';
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

function csvToArray(filename, callback) {
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

function createSelect(){

  var area_select_form = $("#select_area");
  var select_html = "";
  select_html += '<option value="-1">地域を選択してください</option>';
  for (var i in laundsIndex) {
    var place = laundsIndex[i];
    select_html += '<option value="' + place + '"' + '>' + place + "</option>";
  }

  area_select_form.html(select_html);
  area_select_form.change();
}


function main(){

  loadCsv();

};

main();
