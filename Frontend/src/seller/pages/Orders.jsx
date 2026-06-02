export default function Orders() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-5">
        Orders
      </h1>

      <table className="w-full bg-white shadow">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Total</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>#001</td>
            <td>Customer Name</td>
            <td>Rs. 5000</td>
            <td>Processing</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}