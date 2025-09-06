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

export const deleteOrderById=(req,res)=>{
    const {id}=req.params;
    const orders=readOrder();
    const orderIndex=orders.findIndex((o)=> o.orderId===id);

    if(orderIndex===-1){
        return res.status(404).json({ error: "Order not found" });
    }

    const [deletedOrder] = orders.splice(orderIndex, 1);
    writeOrder(orders);

    res.status(200).json({message:"Order Deleted",deletedOrder});

}
export const updateOrderById = (req, res) => {
  const { id } = req.params;
  const orders = readOrder();
  const order = orders.find((o) => o.orderId === id);

  if (!order) {
    return res.status(404).json({ error: "Order not found" });
  }

  Object.assign(order, req.body, { last_updated: new Date() });
  writeOrder(orders);

  res.status(200).json({ message: "Order updated successfully", order });
};
