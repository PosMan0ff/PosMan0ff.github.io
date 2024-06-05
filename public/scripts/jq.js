$(document).ready(function() {
    // Показать затемнение с вращающимся спиннером
    $('#loading-overlay').show();
  
    // Скрыть затемнение через 3 секунды
    setTimeout(function() {
      $('#loading-overlay').fadeOut(2000);
    }, 1000);
  });