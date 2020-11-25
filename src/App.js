import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const App = () => {
  const [transactions, setTransactions] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(null);
  const api = "http://www.mocky.io/v2/5c62e7c33000004a00019b05";

  const fetchAPI = async (api) => {
    try {
      const data = await axios.get(api);
      setLoaded(true);
      setTransactions(data.data.transactions);
    } catch (error) {
      setError(error);
      setLoaded(true);
      setTransactions([]);
    }
  };

  useEffect(() => {
    fetchAPI(api);
  }, [api]);

  const getTransactions = () => {
    const amounts = [];
    const expenses = [];
    const sortedTransactions = [];

    for (const transaction of transactions) {
      amounts.push(transaction);
    }
    amounts.forEach((amount) => {
      const expense = amount.amount.value;
      expenses.push(expense);
    });

    const sortedExpenses = expenses.sort((a, b) => {
      if (a > b) {
        return 1;
      } else if (a === b) {
        return 0;
      } else {
        return -1;
      }
    });

    sortedExpenses.forEach((expense, index) => {
      let found = false;
      amounts.filter((amount) => {
        if (!found && amount.amount.value === expense && index < 10) {
          sortedTransactions.push(amount);
          found = true;
          return false;
        } else {
          return true;
        }
      });
    });
    return sortedTransactions;
  };

  const renderContent = getTransactions().map((amount, index) => (
    <div className='transaction' key={index}>
      <div>
        Amount: {amount.amount.value} {amount.amount.currency_iso}
      </div>
      <div>Category Title : {amount.category_title}</div>
      <div>Date : {amount.date}</div>
      <div>Description : {amount.description}</div>
    </div>
  ));

  if (!loaded) {
    return <div className='loading'>Loading...</div>;
  }

  if (error) {
    return <div>Sorry an error occured</div>;
  }

  return <div>{renderContent}</div>;
};

export default App;
