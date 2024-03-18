'use strict';

/**
 * order controller
*/

//documentation bata 
const stripe = require('stripe')(process.env.STRIPE_SECRET)

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::order.order',({strapi})=>({
    //ctx can access user
    async create(ctx){
        //destructre is coming form ui
        // token: client ko creditcard ko details strip le encripit garera send garxa, not jwt wala
        const {amount,shippingAddress,city,state,pin,token,items} = ctx.request.body

        //now we charge user
    await stripe.charges.create({
        amount:amount * 100,
        currency:'USD',
        source:token,
        discription: `order by user${ctx.state.user.email}`
    })
    //after chager we got to save order
    const order =await strapi.db.query('api::order.order').create({
        data:{
            shippingAddress,
            city,
            state,
            pin,
            amount,
            items,
            user:ctx.state.user.email
        }
    })
    return order
    }
}));
