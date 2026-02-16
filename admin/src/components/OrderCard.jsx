function OrderCard({ order }) {
  return (
    <div className="border border-black bg-white p-6 space-y-4 shadow-sm">

      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-black font-semibold">
            Order ID:
            <span className="font-normal ml-1">{order._id}</span>
          </p>
          <p className="text-xs text-black">
            Placed on: {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>

        <span className="px-3 py-1 text-sm font-semibold border border-black bg-pink-100">
          {order.status}
        </span>
      </div>

      <div className="text-sm text-black">
        <p>
          <span className="font-semibold">Customer:</span>{" "}
          {order.user?.name || order.shippingAddress.fullName + " (by Shipping Address)"}
        </p>
        <p>
          <span className="font-semibold">Phone:</span>{" "}
          {order.shippingAddress.phone}
        </p>
      </div>

      <div className="space-y-3">
        {order.orderItems.map((item, index) => (
          <div
            key={index}
            className="flex justify-between items-center border border-black p-3"
          >
            <div className="space-y-1">
              <p className="text-sm font-semibold text-black">
                {item.product?.productName}
              </p>
              <p className="text-xs text-black">
                Size: {item.selectedSize} | Qty: {item.quantity}
              </p>
            </div>

            <p className="text-sm font-bold text-black">
              ₹{item.price * item.quantity}
            </p>
          </div>
        ))}
      </div>

      <div className="text-sm text-black">
        <p className="font-semibold">Shipping Address</p>
        <p>
          {order.shippingAddress.fullName},{" "}
          {order.shippingAddress.address},{" "}
          {order.shippingAddress.city},{" "}
          {order.shippingAddress.postalCode},{" "}
          {order.shippingAddress.country}
        </p>
      </div>

      <div className="flex justify-between items-center text-sm text-black">
        <p>
          <span className="font-semibold">Payment:</span>{" "}
          {order.paymentMethod}
        </p>
        <p
          className={`font-semibold ${
            order.isPaid ? "text-green-600" : "text-red-600"
          }`}
        >
          {order.isPaid ? "Paid" : "Not Paid"}
        </p>
      </div>

      <div className="border-t border-black pt-3 text-sm text-black space-y-1">
        <div className="flex justify-between">
          <span>Items</span>
          <span>₹{order.itemsPrice}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <span>₹{order.shippingPrice}</span>
        </div>
        <div className="flex justify-between">
          <span>Tax</span>
          <span>₹{order.taxPrice}</span>
        </div>
        <div className="flex justify-between font-bold text-base">
          <span>Total</span>
          <span>₹{order.totalPrice}</span>
        </div>
      </div>
    </div>
  );
}

export default OrderCard;
