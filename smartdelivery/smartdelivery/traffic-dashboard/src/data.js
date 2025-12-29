// Sample data for all tables

export const usersData = [
  { id: 'U001', name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active' },
  { id: 'U002', name: 'Jane Smith', email: 'jane@example.com', role: 'Delivery Man', status: 'Active' },
  { id: 'U003', name: 'Mike Johnson', email: 'mike@example.com', role: 'Delivery Man', status: 'Inactive' },
  { id: 'U004', name: 'Sarah Williams', email: 'sarah@example.com', role: 'Admin', status: 'Active' },
  { id: 'U005', name: 'David Brown', email: 'david@example.com', role: 'Delivery Man', status: 'Active' },
];

export const ordersData = [
  { id: 'ORD001', customer: 'Alice Green', location: 'Downtown', status: 'Delivered', driver: 'Jane Smith', eta: '14:30' },
  { id: 'ORD002', customer: 'Bob White', location: 'Uptown', status: 'In-progress', driver: 'David Brown', eta: '15:45' },
  { id: 'ORD003', customer: 'Charlie Davis', location: 'Suburb', status: 'Pending', driver: 'Unassigned', eta: '16:00' },
  { id: 'ORD004', customer: 'Diana Martinez', location: 'Airport', status: 'In-progress', driver: 'Jane Smith', eta: '14:15' },
  { id: 'ORD005', customer: 'Eve Brown', location: 'Mall', status: 'Delivered', driver: 'David Brown', eta: 'Completed' },
  { id: 'ORD006', customer: 'Frank Miller', location: 'Harbor', status: 'Pending', driver: 'Unassigned', eta: '17:30' },
];

export const driversData = [
  { id: 'DRV001', name: 'Jane Smith', phone: '9876543210', vehicle: 'Bike - RX100', status: 'Active', lastActive: '14:35' },
  { id: 'DRV002', name: 'David Brown', phone: '9123456789', vehicle: 'Car - Swift', status: 'Active', lastActive: '14:20' },
  { id: 'DRV003', name: 'Mike Johnson', phone: '8765432109', vehicle: 'Van - Tempo', status: 'Offline', lastActive: '12:45' },
  { id: 'DRV004', name: 'Lisa Anderson', phone: '7654321098', vehicle: 'Bike - Hero', status: 'Active', lastActive: '14:50' },
  { id: 'DRV005', name: 'Tom Harris', phone: '6543210987', vehicle: 'Car - Maruti', status: 'Offline', lastActive: '10:15' },
];

export const trafficAlertsData = [
  { id: 'ALR001', location: 'Main Street', type: 'Traffic Jam', time: '14:22', severity: 'High' },
  { id: 'ALR002', location: 'Highway 101', type: 'Accident', time: '13:45', severity: 'Critical' },
  { id: 'ALR003', location: 'Downtown Road', type: 'Road Closed', time: '14:10', severity: 'High' },
  { id: 'ALR004', location: 'Airport Road', type: 'Traffic Jam', time: '14:15', severity: 'Medium' },
  { id: 'ALR005', location: 'Bridge Street', type: 'Construction', time: '11:30', severity: 'Low' },
];

export const routeHistoryData = [
  { id: 'RT001', start: 'Downtown', end: 'Airport', distance: '25 km', time: '45 min', date: '2025-12-10' },
  { id: 'RT002', start: 'Suburb', end: 'Mall', distance: '18 km', time: '35 min', date: '2025-12-10' },
  { id: 'RT003', start: 'Harbor', end: 'City Center', distance: '32 km', time: '52 min', date: '2025-12-09' },
  { id: 'RT004', start: 'Station', end: 'Airport', distance: '28 km', time: '48 min', date: '2025-12-09' },
  { id: 'RT005', start: 'Mall', end: 'Downtown', distance: '15 km', time: '30 min', date: '2025-12-08' },
];

export const loginActivityData = [
  { user: 'john@example.com', role: 'Admin', loginTime: '2025-12-10 08:15:00', ip: '192.168.1.100', status: 'Success' },
  { user: 'jane@example.com', role: 'Delivery Man', loginTime: '2025-12-10 07:45:00', ip: '192.168.1.101', status: 'Success' },
  { user: 'mike@example.com', role: 'Delivery Man', loginTime: '2025-12-10 06:30:00', ip: '192.168.1.102', status: 'Failed' },
  { user: 'sarah@example.com', role: 'Admin', loginTime: '2025-12-10 09:00:00', ip: '192.168.1.103', status: 'Success' },
  { user: 'david@example.com', role: 'Delivery Man', loginTime: '2025-12-10 07:20:00', ip: '192.168.1.104', status: 'Success' },
];

export const inventoryData = [
  { id: 'PRD001', name: 'Helmet', stock: 45, category: 'Safety', price: '₹899', status: 'In Stock' },
  { id: 'PRD002', name: 'Phone Mount', stock: 12, category: 'Accessories', price: '₹299', status: 'Low Stock' },
  { id: 'PRD003', name: 'Reflective Vest', stock: 0, category: 'Safety', price: '₹599', status: 'Out of Stock' },
  { id: 'PRD004', name: 'GPS Device', stock: 8, category: 'Electronics', price: '₹4999', status: 'Low Stock' },
  { id: 'PRD005', name: 'Delivery Bag', stock: 120, category: 'Equipment', price: '₹1499', status: 'In Stock' },
];

export const notificationsData = [
  { id: 'NTF001', title: 'New Order Assigned', description: 'Order ORD002 assigned to David Brown', time: '14:30', read: false },
  { id: 'NTF002', title: 'Delivery Completed', description: 'Order ORD001 delivered successfully', time: '14:20', read: true },
  { id: 'NTF003', title: 'Traffic Alert', description: 'Heavy traffic on Main Street', time: '14:15', read: true },
  { id: 'NTF004', title: 'Low Stock Alert', description: 'Phone Mount stock below threshold', time: '14:10', read: false },
  { id: 'NTF005', title: 'Driver Status', description: 'Mike Johnson is now online', time: '14:00', read: true },
];

export const paymentsData = [
  { id: 'TXN001', user: 'Alice Green', amount: '₹599', method: 'Credit Card', date: '2025-12-10', status: 'Success' },
  { id: 'TXN002', user: 'Bob White', amount: '₹1299', method: 'Debit Card', date: '2025-12-10', status: 'Success' },
  { id: 'TXN003', user: 'Charlie Davis', amount: '₹899', method: 'UPI', date: '2025-12-10', status: 'Pending' },
  { id: 'TXN004', user: 'Diana Martinez', amount: '₹2499', method: 'Net Banking', date: '2025-12-09', status: 'Success' },
  { id: 'TXN005', user: 'Eve Brown', amount: '₹699', method: 'Wallet', date: '2025-12-09', status: 'Failed' },
];

export const supportTicketsData = [
  { id: 'TKT001', user: 'Jane Smith', issue: 'App crash on login', priority: 'High', status: 'Open', lastUpdated: '14:45' },
  { id: 'TKT002', user: 'Mike Johnson', issue: 'GPS not working', priority: 'Critical', status: 'In Progress', lastUpdated: '14:30' },
  { id: 'TKT003', user: 'Sarah Williams', issue: 'Route optimization', priority: 'Low', status: 'Closed', lastUpdated: '13:20' },
  { id: 'TKT004', user: 'David Brown', issue: 'Payment integration issue', priority: 'High', status: 'Open', lastUpdated: '14:10' },
  { id: 'TKT005', user: 'Lisa Anderson', issue: 'Notification not received', priority: 'Medium', status: 'In Progress', lastUpdated: '14:55' },
];
