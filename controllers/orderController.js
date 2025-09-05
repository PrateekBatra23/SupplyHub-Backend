import { readOrder,writeOrder } from "../utils/fileHelper.js";


export const fetchOrder=(req,res)=>{
    const data=readOrder();
    res.json(data);
};

export const createOrder =(req,res)=>{
    const data=readOrder();
    const newOrder={
        orderId: `ORD-${Date.now()}`,
        ...req.body};
    data.push(newOrder);
    writeOrder(data);
    res.status(201).json(newOrder);
}

export const fetchOrderById=(req,res)=>{
    const {id}=req.params;
    const orders=readOrder();

    const order=orders.find(o=> o.orderId===id);

    if(!order){
        return res.status(404).json({ error: "Order not found" });
    }

    res.json(order);

};