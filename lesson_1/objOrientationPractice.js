function createProduct (id, name, stock, price) {
  return {
    id,
    name,
    stock,
    price,

    setPrice(newPrice) {
      if (newPrice <= 0) {
        console.log('The price must be above zero!');
      } else {
        this.price = newPrice;
      }
    },

    describeProduct() {
      Object.keys(this).filter(key => {
        return typeof this[key] !== 'object' && typeof this[key] !== 'function';
      }).forEach(key => console.log(`${key}: ${this[key]}`));
    },
  };
}

let scissors = createProduct(0, 'Scissors', 10, 8);
let drill = createProduct(1, 'Cordless Drill', 15, 45);
let saw = createProduct(2, 'Circular Saw', 12, 95);
let hammer = createProduct(3, 'Sledge Hammer', 78, 45);
let boxCutter = createProduct(4, 'Box Cutter', 41, 15);

scissors.describeProduct();
hammer.describeProduct();
hammer.setPrice(70);
hammer.describeProduct();