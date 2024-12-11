import { useState, useEffect } from 'react';

export default function Home() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetch('/api/items')
      .then(res => res.json())
      .then(data => setItems(data.data));
  }, []);

  const handleAddOrUpdate = async () => {
    const method = editId ? 'PUT' : 'POST';
    const body = editId ? { id: editId, name } : { name };

    const res = await fetch('/api/items', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    if (data.success) {
      setEditId(null);
      setName('');
      fetchItems();
    }
  };

  const handleDelete = async (id) => {
    await fetch('/api/items', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ deleteId: id }),
    });
    fetchItems();
  };

  const fetchItems = async () => {
    const res = await fetch('/api/items');
    const data = await res.json();
    setItems(data.data);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-4">CRUD App</h1>
        <div className="mb-6 flex space-x-2">
          <input
            type="text"
            placeholder="Enter item name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          />
          <button
            onClick={handleAddOrUpdate}
            className={`px-4 py-2 rounded-lg text-white ${
              editId ? 'bg-blue-500 hover:bg-blue-600' : 'bg-green-500 hover:bg-green-600'
            }`}
          >
            {editId ? 'Update' : 'Add'}
          </button>
        </div>
        <ul className="divide-y">
          {items.map((item) => (
            <li key={item.id} className="py-2 flex justify-between items-center">
              <span className="text-lg">{item.name}</span>
              <div className="space-x-2">
                <button
                  onClick={() => {
                    setEditId(item.id);
                    setName(item.name);
                  }}
                  className="text-sm px-2 py-1 bg-blue-500 text-white rounded-lg"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-sm px-2 py-1 bg-red-500 text-white rounded-lg"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
