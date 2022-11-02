export const numberWithCommas = (x) => {
  return x.toLocaleString();
};

export const getTotalRevenue = (users) => {
  return users?.reduce((a, b) => {
    return a + b.revenue;
  }, 0);
};

export const groupByCategory = (arrayData) => {
  return arrayData?.reduce((group, product) => {
    const { sellerName } = product;
    group[sellerName] = group[sellerName] ?? [];
    if (product.status == "Confirmed") {
      group[sellerName].push(product);
    }
    return group;
  }, {});
};

export const sortUsers = (users) => {
  return users?.sort((a, b) => b.revenue - a.revenue);
};
