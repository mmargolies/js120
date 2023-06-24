/* eslint-disable max-lines-per-function */

function createInvoice(services = {}) {
  let phoneBill = services.phone || 3000;
  let internetBill = services.internet || 5500;

  return {
    phone: phoneBill,
    internet: internetBill,
    payments: [],

    total() {
      return this.phone + this.internet;
    },

    addPayment(paymentObj) {
      this.payments.push(paymentObj);
    },

    addPayments(paymentArr) {
      paymentArr.forEach(this.addPayment, this);
    },

    totalPayments() {
      return this.payments.reduce((acc, curr) => acc + curr.total(), 0);
    },

    amountDue() {
      return this.total() - this.totalPayments();
    }
  };
}

function invoiceTotal(invoices) {
  let total = 0;

  for (let index = 0; index < invoices.length; index += 1) {
    total += invoices[index].total();
  }

  return total;
}

function createPayment(services = {}) {
  return {
    amount: services.amount || 0,
    phone: services.phone || 0,
    internet: services.internet || 0,

    total() {
      return this.amount || this.phone + this.internet;
    },
  };
}

function paymentTotal(payments) {
  return payments.reduce((sum, payment) => sum + payment.total(), 0);
}

let invoices = [];
invoices.push(createInvoice());
invoices.push(createInvoice({ internet: 6500 }));
invoices.push(createInvoice({ phone: 2000 }));
invoices.push(createInvoice({
  phone: 1000,
  internet: 4500,
}));

console.log(invoiceTotal(invoices)); // 31000

let payments = [];
payments.push(createPayment());
payments.push(createPayment({
  internet: 6500,
}));

payments.push(createPayment({
  phone: 2000,
}));

payments.push(createPayment({
  phone: 1000,
  internet: 4500,
}));

payments.push(createPayment({
  amount: 10000,
}));

console.log(paymentTotal(payments));      // => 24000

let invoice = createInvoice({
  phone: 1200,
  internet: 4000,
});

let payment1 = createPayment({ amount: 2000 });
let payment2 = createPayment({
  phone: 1000,
  internet: 1200
});

let payment3 = createPayment({ phone: 1000 });

invoice.addPayment(payment1);
invoice.addPayments([payment2, payment3]);
console.log(invoice.amountDue());       // this should return 0