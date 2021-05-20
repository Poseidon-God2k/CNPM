module.exports = function Cart(oldCart){
    this.items = oldCart.items || {};
    this.totalQty = oldCart.totalQty || 0;
    this.totalPrice = oldCart.totalPrice || 0;
    
    this.add = function(item, id , quantity , variaty){
        var storedItem = this.items[id];
        if(!storedItem){
            var price = quantity*item.price;
            storedItem = this.items[id]=[{item:item,quantity: quantity, variaty:variaty ,price: price}]
        }
        else{
        var flat = true
        for(var i =0 ;i <storedItem.length; i++){
            //id variaty already exits => increase quantity and price
            if (storedItem[i].variaty == variaty){
                storedItem[i].quantity += quantity;
                storedItem[i].price += item.price*quantity;
                var price = storedItem[i].price;
                flat = false;
                break;
            }
        }
        if(flat){
            storedItem.push({item:item,quantity: quantity, variaty:variaty ,price:0});
            storedItem[storedItem.length -1].price = item.price*quantity;
            var price = storedItem[storedItem.length -1].price;
        }
        }
        this.totalQty += quantity;
        this.totalPrice += price;
    };
    this.increaseOne = function(id , variaty){
        for(var i =0 ;i <this.items[id].length; i++){
            //id variaty already exits => increase quantity and price
            if (this.items[id][i].variaty == variaty){
                this.items[id][i].quantity += 1;
                this.items[id][i].price += parseInt(this.items[id][i].item.price);
                var price = parseInt(this.items[id][i].item.price);
                break;
            }
        }
        this.totalQty++;    
        this.totalPrice += price;
    }
    this.reduceByOne = function(id, variaty){
        for(var i =0 ;i <this.items[id].length; i++){
            //id variaty already exits => increase quantity and price
            if (this.items[id][i].variaty == variaty){
                this.items[id][i].quantity --;
                this.items[id][i].price -= parseInt(this.items[id][i].item.price);
                var price = parseInt(this.items[id][i].item.price);
                if(this.items[id][i].quantity <=0){
                    this.items[id].splice(i,1);
                }
                if(this.items[id]==null){
                    delete this.items[id];
                }
                break;
            }
        }
        this.totalQty--;    
        this.totalPrice -= price;
        
    }
    this.removeItem= function(id, variaty){
        for(var i =0 ;i <this.items[id].length; i++){
            //id variaty already exits => increase quantity and price
            if (this.items[id][i].variaty == variaty){
                var quantity = this.items[id][i].quantity;
                var price = quantity*parseInt(this.items[id][i].item.price);
                this.items[id].splice(i,1);
                break;
            }
        }
        this.totalQty -= quantity;
        this.totalPrice -= price;
        if(this.items[id]==null){
            delete this.items[id];
        }
    }
    this.generateArray = function(){
        var arr= [];
        for(var id in this.items){
            arr.push(this.items[id]);
        }
        return arr;
    };
};


