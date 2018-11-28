// $(document).ready(function() {
//   $(".toggle-accordion").on("click", function() {
//     var accordionId = $(this).attr("accordion-id"),
//     numPanelOpen = $(accordionId + ' .collapse.show').length;
    
//     console.log("NUMBER:" + $(accordionId + ' .collapse.show').length);
//     console.log(numPanelOpen);
//     $(this).toggleClass("active");
    
//     if (numPanelOpen == 0) {
//       openAllPanels(accordionId);
//     } else {
//       closeAllPanels(accordionId);
//     }
//   })
  
//   openAllPanels = function(aId) {
//     $(aId + ' .panel-collapse:not(".show")').collapse('show');
//   }
//   closeAllPanels = function(aId) {
//     $(aId + ' .panel-collapse.show').collapse('hide');
//   }
  
// });

$('.closeAll').click(function(){
  $('.panel-collapse.show')
    .collapse('hide');
});
$('.openAll').click(function(){
  $('.panel-collapse:not(".show")')
    .collapse('show');
});