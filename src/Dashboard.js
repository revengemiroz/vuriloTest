import styles from "./Dashboard.module.css";
import { LoadingIcon } from "./Icons";
import { getOrders } from "./dataService";

import React, { useState } from "react";
import {
  getTotalRevenue,
  groupByCategory,
  numberWithCommas,
  sortUsers,
} from "./utils";

// Overview:
// You are provided with an incomplete <Dashboard /> component.
// Demo video - Demo video will be attached in the chat.
// This demo video uses the same dataset, so your total and ranking calculations should match it
// You are not allowed to add any additional HTML elements.
// You are not allowed to use refs.

// Requirements:
// Once the <Dashboard /> component is mounted, load the order data using the getOrders function imported above
// Once all the data is successfully loaded, hide the loading icon
// Calculate and display the total revenue
// Display a ranking showing the sellers ordered by their total revenue using the <SellerRanking /> component.
// The seller with the highest revenue should be shown at the top with position 1.
// All the revenue values should only consider Confirmed orders. Canceled orders should be ignored.
// All dollar amounts should be displayed to 2 decimal places
// The getOrders function times out frequently. Display any errors returned while loading the data in the provided div.
// The retry button should clear the error and reattempt the request

const SellerRanking = ({ position, sellerName, sellerRevenue }) => {
  return (
    <tr>
      <td>{position}</td>
      <td>{sellerName}</td>
      <td>${numberWithCommas(sellerRevenue)}</td>
    </tr>
  );
};

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState();

  const group = groupByCategory(data);
  const keys = group && Object.keys(group);

  const users = keys?.map((name, i) => {
    return {
      name: name,
      revenue: parseFloat(
        group[name]
          .reduce((a, b) => {
            return a + b.revenue;
          }, 0)
          .toFixed(2)
      ),
    };
  });

  const sortedUsersAccordingToRevenue = sortUsers(users);

  const totalRevenue = getTotalRevenue(users);

  return (
    <div>
      <header className={styles.header}>
        <h1>Top Sellers</h1>
      </header>
      <main>
        {/* Show the <LoadingIcon /> when the data is being fetched. */}
        {loading && !data ? (
          <>
            <LoadingIcon />
          </>
        ) : loading && data ? (
          <div>
            <p className={styles.summary}>
              <strong>Total revenue: </strong>
              <span id="totalRevenue">
                ${totalRevenue ? numberWithCommas(totalRevenue) : 0}
              </span>
            </p>
          </div>
        ) : (
          <div className={styles.errorContainer}>
            <div className={styles.errorMessage}>
              The request has timed out, please try again
            </div>
            <button
              onClick={async () => {
                try {
                  setLoading(true);
                  const res = await getOrders();
                  setData(res);
                } catch (error) {
                  setLoading(false);
                }
              }}
            >
              Retry
            </button>
          </div>
        )}

        {/* Place any data fetching errors inside this div, only render the div if there are errors */}

        <h2>Seller Rankings</h2>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Position</th>
              <th>Seller Name</th>
              <th>Seller Revenue</th>
            </tr>
          </thead>
          <tbody>
            {sortedUsersAccordingToRevenue?.map((users, i) => {
              return (
                <SellerRanking
                  position={i + 1}
                  sellerName={users.name}
                  sellerRevenue={users.revenue}
                />
              );
            })}
          </tbody>
        </table>
      </main>
    </div>
  );
};

export default Dashboard;
