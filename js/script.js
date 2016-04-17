
function createSelect(){

  var area_select_form = $("#select_area");
  var select_html = "";
  select_html += '<option value="-1">地域を選択してください</option>';
  // for (var row_index in areaModels) {
  //   var area_name = areaModels[row_index].label;
  //   var selected = (selected_name == area_name) ? 'selected="selected"' : "";
  //
  //   select_html += '<option value="' + row_index + '" ' + selected + " >" + area_name + "</option>";
  // }


  area_select_form.html(select_html);
  area_select_form.change();
}


function main(){

  // create select
  createSelect();

};

main();
