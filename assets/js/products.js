const PRODUCTS = [
  { id: "samsung-tv", name: "Samsung TV", price: 2500, image: "assets/images/product1.png" },
  { id: "pixel-4a", name: "Pixel 4a", price: 3500, image: "assets/images/product2.png" },
  { id: "ps5", name: "PS 5", price: 6000, image: "assets/images/product3.png" },
  { id: "macbook-air", name: "MacBook Air", price: 9500, image: "assets/images/product4.png" },
  { id: "apple-watch", name: "Apple Watch", price: 2200, image: "assets/images/product5.png" },
  { id: "airpods", name: "AirPods", price: 1200, image: "assets/images/product6.png" },
];

function findProduct(id) {
  return PRODUCTS.find((p) => p.id === id);
}
