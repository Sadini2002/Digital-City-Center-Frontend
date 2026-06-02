export default function ShopSettings() {
  return (
    <div className="p-6 max-w-3xl">
      <h1 className="text-2xl font-bold mb-5">
        Shop Settings
      </h1>

      <input
        type="text"
        placeholder="Shop Name"
        className="w-full border p-3 mb-3"
      />

      <textarea
        placeholder="Shop Description"
        className="w-full border p-3 mb-3"
      />

      <button className="bg-blue-600 text-white px-5 py-2 rounded">
        Save Changes
      </button>
    </div>
  );
}