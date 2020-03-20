const alarm = require('alarm');
const Products = require('../models').productlist;
const Biddings = require('../models').biddings;



exports.addAlarm=(product)=>{
    alarm(product.endtime,function closer(){
        Products.findOne({where:{pid:product.pid,endtime:product.endtime}}).then(function(prod){
            if(prod){
                Biddings.max('price',{where:{pid:product.pid}}).then(function(bprice){
                    if(bprice){
                        Biddings.findOne({where:{price:bprice}}).then(function(Bid){
                            if(Bid){
                                Bid.update({
                                    isclosed:1
                                }).then(function(){
                                    product.update({
                                        sold:1
                                    }).then(function(){
                                        console.log("SOLD");
                                    })
                                })
                            }
                        })
                    }
                })
            }
        });
    });
}
