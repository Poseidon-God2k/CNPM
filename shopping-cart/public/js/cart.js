$("#increase").on('click', function(event){
    var increaseValue = parseInt($('#input-quantity').val())+1;
    $('#input-quantity').val(increaseValue);
});

$("#decrease").on('click', function(event){
    var decreaseValue = parseInt($('#input-quantity').val())-1;
    $('#input-quantity').val(decreaseValue);
});

// $("#input-quantity").on("input", function() {
//     alert($(this).val(); 
//  });