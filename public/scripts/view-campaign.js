$('.closeAll').click(function(){
  $('.panel-collapse.show')
    .collapse('hide');
});
$('.openAll').click(function(){
  $('.panel-collapse:not(".show")')
    .collapse('show');
});