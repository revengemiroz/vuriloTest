export function getOrders() {
  return getData("/orders.json").then((result) =>
    result.orders.map((order) => ({
      ...order,
      orderDate: new Date(order.orderDate),
    }))
  );
}

function getData(endpoint) {
  const delay = (0.5 + Math.random() * 2) * 1000;
  return new Promise((resolve, reject) => {
    setTimeout(function () {
      fetch(endpoint).then((res) => {
        if (isRequestSuccessful()) {
          resolve(res.json());
        } else {
          reject(new Error("The request has timed out, please try again"));
        }
      });
    }, delay);
  });
}

function isRequestSuccessful() {
  const errorFrequency = 0.5;
  return Math.random() >= errorFrequency;
}
