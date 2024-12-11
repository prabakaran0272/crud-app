let items = []; // Temporary in-memory database

export default function handler(req, res) {
  switch (req.method) {
    case 'GET': // Retrieve items
      res.status(200).json({ success: true, data: items });
      break;

    case 'POST': // Create a new item
      const newItem = req.body;
      if (!newItem || !newItem.name) {
        return res.status(400).json({ success: false, message: 'Name is required' });
      }
      items.push({ id: items.length + 1, ...newItem });
      res.status(201).json({ success: true, data: newItem });
      break;

    case 'PUT': // Update an item
      const { id, name } = req.body;
      if (!id || !name) {
        return res.status(400).json({ success: false, message: 'ID and Name are required' });
      }
      const index = items.findIndex(item => item.id === id);
      if (index === -1) {
        return res.status(404).json({ success: false, message: 'Item not found' });
      }
      items[index].name = name;
      res.status(200).json({ success: true, data: items[index] });
      break;

    case 'DELETE': // Delete an item
      const { deleteId } = req.body;
      items = items.filter(item => item.id !== deleteId);
      res.status(200).json({ success: true, message: 'Item deleted' });
      break;

    default:
      res.status(405).json({ success: false, message: 'Method not allowed' });
  }
}
