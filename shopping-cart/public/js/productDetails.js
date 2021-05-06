

$("#increase").on('click', function(event){
    var increaseValue = parseInt($('#input-quantity').val())+1;
    $('#input-quantity').val(increaseValue);
});

$("#decrease").on('click', function(event){
    var decreaseValue = parseInt($('#input-quantity').val())-1;
    $('#input-quantity').val(decreaseValue);
});


$(".ele-img").hover(function(){
    var bg = $(this).css('background-image');
    bg = bg.replace('url(','').replace(')','').replace(/\"/gi, "");
    bg = bg.slice(0,-3);
    var url = `url(${bg})`;
    $('#over-img').css("background-image", url);
})

//check click variation
$(".product-variation").on('click', function(event){
    var id = this.id;
    $(".product-variation").removeClass("product-variation--selected");
    $('.product-variation__tick').remove();
    if($('#'+id).hasClass("flag-selected") === false){
        $("#"+id).addClass("product-variation--selected");
        $('#'+id).addClass("flag-selected")
        $("#"+id).append(
            '<div class="product-variation__tick"><svg enable-background="new 0 0 12 12" viewBox="0 0 12 12" x="0" y="0" class="shopee-svg-icon icon-tick-bold"><g><path d="m5.2 10.9c-.2 0-.5-.1-.7-.2l-4.2-3.7c-.4-.4-.5-1-.1-1.4s1-.5 1.4-.1l3.4 3 5.1-7c .3-.4 1-.5 1.4-.2s.5 1 .2 1.4l-5.7 7.9c-.2.2-.4.4-.7.4 0-.1 0-.1-.1-.1z"></path></g></svg></div>'
        )
    }
    else{
        $('#'+id).removeClass("flag-selected")
    }
});


//req ajax add to cart
$('#add-to-cart').click(function(event) {
    event.preventDefault();
    var variation = $(".product-variation--selected").text();
    if(!variation){
        if(!$("#error-msg").text())
            $("#error-msg").append('Vui lòng chọn Phân loại hàng');
    }
    else{
        $("#error-msg").text("");
        var id = window.location.pathname.split('/')[2];
       var quantity = parseInt($('#input-quantity').val());
        $.ajax({
            url:'/add-to-cart',
            method:'get',
            data:{
                id: id,
                variation: variation,
                quantity: quantity
            },
            credentials: 'same-origin',
            dataType: "json",
            xhrFields:{
                withCredentials: true
            }
        }).done(function(res){ 
            if(!$("#completed-msg").text()){
                $("#completed-msg").append(res.msg);
                $("#completed-msg").addClass("completed-msg");
            }
        })
        .fail(function (jqXHR, textStatus, errorThrown) { console.log("error") });
    }
 });