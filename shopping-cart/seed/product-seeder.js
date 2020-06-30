var Product = require('../models/product');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/shopping', {useNewUrlParser: true, useUnifiedTopology: true});

var products = [
    new Product({
    imagePath:"https://cf.shopee.vn/file/e2e6e7685b4d20e233f502585711bb35",
    title:'Pizza',
    description:"Pizza là một loại thức ăn nhanh có lượng dinh dưỡng dồi dào",
    price: 150000,
   }),
   new Product({
    imagePath:"https://bizweb.dktcdn.net/100/004/714/articles/banh-mi-sandwich-an-voi-gi.jpg?v=1568966036117",
    title:'Sand witch',
    description:"Sand witch là một loại thức ăn nhanh có lượng dinh dưỡng dồi dào",
    price: 30000,
    }),
    new Product({
        imagePath:"https://images.foody.vn/res/g3/24693/s800/foody-kfc-hoang-hoa-tham-211-636737557718728711.jpg",
        title:'KFC',
        description:"KFC là một loại thức ăn nhanh có lượng dinh dưỡng dồi dào",
        price: 35000,
    }),
    new Product({
        imagePath:"https://cdn.baogiaothong.vn/files/trang.nguyen/2017/10/10/095152-pho-2-loai-thit.jpg",
        title:'Phở',
        description:"Phở là một loại thức ăn truyền thống của Việt Nam",
        price: 40000,
    }),
    new Product({
        imagePath:"https://images.foody.vn/res/g70/696765/s800/foody-banh-canh-he-phu-yen-952-636772961037707965.jpg",
        title:'Bánh canh hẹ',
        description:"Bánh canh hẹ ở Phú Yên :)) ám ảnh cho bạn nào ghét hẹ",
        price: 30000,
    }),
    new Product({
        imagePath:"https://images.foody.vn/res/g14/134106/s800/foody-banh-xeo-ba-nho-401-636804135186429901.jpg",
        title:'Bánh xèo',
        description:"Bánh xèo ngon bổ :))",
        price: 50000,
    }),
];

var done =0;
for(var i=0;i<products.length;i++){
    products[i].save(function(err, result){
        done++;
        if(done=== products.length){
            exit();
        }
    });
}

function exit(){
    mongoose.disconnect();
}
