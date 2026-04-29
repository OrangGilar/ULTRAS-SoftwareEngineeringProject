export interface User {
  name: string;
  points: number;
  avatarUrl?: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  category: 'Jerseys' | 'Accessories' | 'All';
  description?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  productName: string;
  status: 'Processing' | 'Shipped' | 'Delivered';
  imageUrl: string;
}

export interface MatchInfo {
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  status: 'Live' | 'Upcoming' | 'Finished';
}