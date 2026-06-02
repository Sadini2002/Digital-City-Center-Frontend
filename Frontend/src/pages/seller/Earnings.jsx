export default function Earnings() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-5">
        Earnings
      </h1>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-green-100 p-5 rounded">
          Total Revenue
          <h2>Rs. 150,000</h2>
        </div>

        <div className="bg-blue-100 p-5 rounded">
          Monthly Revenue
          <h2>Rs. 25,000</h2>
        </div>

        <div className="bg-yellow-100 p-5 rounded">
          Pending
          <h2>Rs. 8,000</h2>
        </div>
      </div>
    </div>
  );
}