import Container from "react-bootstrap/Container"
import  Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Table from "react-bootstrap/Table"
import FormControl from "react-bootstrap/FormControl"
import Button from 'react-bootstrap/Button';
import { useState, useEffect, useMemo } from "react";
import { API_URL, CARD_POINTS, TRANSACTION_POINTS } from "../utils/constants";
import { Auth } from 'aws-amplify';
var debounce = require('lodash/debounce');
var throttle = require('lodash/throttle');

export default function RewardsTransactions() {
  const [transactions, setTransactions] = useState([])
  let filteredTransactions = transactions
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(0)
  let tempPage = page
  const rowPerPage = 3
  useEffect(() => {
    const cardPoints = localStorage.getItem(CARD_POINTS)
    const transactionsPoints = localStorage.getItem(TRANSACTION_POINTS)
    if (!(cardPoints && transactionsPoints && cardPoints === transactionsPoints)) {
      Auth.currentAuthenticatedUser().then((user) => {
        fetch(API_URL + 'transactions/',
          {
            headers: {
              Authorization: `Bearer ${user.signInUserSession.accessToken.jwtToken}`,
            }
          })
          .then(res => {
            return caches.open(API_URL + "transactions/").then((cache) => {
              return cache.put(API_URL + "transactions/", res.clone())
            }).then(() => res)
          }).then(resClone => resClone.json())
          .then(data => {
            setTransactionData(data)
          })
          .catch(err => { console.error(err) })

      })
    } else {
      readDataFromCache()
    }

  }, [])

  const readDataFromCache = () => {
    caches.match(API_URL + "transactions/")
      .then(res => res.json())
      .then(data => {
        setTransactionData(data)
      })
      .catch(err => { console.error(err) })
  }

  const setTransactionData = (data) => {
    let transactionsPoints = 0
    setTransactions(data.map(d => {
      transactionsPoints += d.finalPoints
      const date = new Date(d.transaction_date)
      const options = { year: 'numeric', month: 'short', day: 'numeric' }
      return {
        date: date.toLocaleString("en-US", options),
        card: d.card_type.toUpperCase().replace('_', ' '),
        merchant_name: d.MerchantName,
        amount: d.amount,
        points: d.finalPoints
      }
    }))
    localStorage.setItem(TRANSACTION_POINTS, Math.floor(transactionsPoints * 100) / 100)
  }

  // stop invocating debounce & throttle after unmount
  useEffect(() => {
    return () => {
      debouncedSearchHandler.cancel();
      throttledPaginationHandler.cancel();
    }
  }, [])
  //#region debounce

  const searchHandler = (e) => {
    setSearchTerm(e.target.value.toLowerCase())
  }
  const debouncedSearchHandler = useMemo(
    () => debounce(searchHandler, 300)
    , []);
  if (searchTerm !== '') {
    filteredTransactions = transactions.filter((t) => {
      return t.merchant_name.toLowerCase().includes(searchTerm) || t.card.toLowerCase().includes(searchTerm);
    });
  } else {
    filteredTransactions = transactions
  }
  //#endregion

  //#region throttle
  const paginationHandler = (count) => {
    tempPage = count
    setPage(tempPage)
  }
  const throttledPaginationHandler = useMemo(
    () => throttle((count) => paginationHandler((tempPage + count)), 300)
    , [])
  //#endregion

  return (
    <Container className="rewards-transactions">
      <div className="d-flex mb-3">

        <FormControl placeholder="Search" onChange={debouncedSearchHandler} />

        <div className="d-flex ms-5 align-items-center">
          <Button
            className="btn btn-pagination float-right"
            disabled={page === 0}
            onClick={e => throttledPaginationHandler(-1)}
          >
            {"<"}
          </Button>
          <span className="mx-2" >{page + 1}</span>
          <Button
            className="btn btn-pagination"
            disabled={(page + 1) * rowPerPage >= filteredTransactions.length}
            onClick={e => throttledPaginationHandler(1)}
          >
            {">"}
          </Button>
        </div>
      </div>
      <Row className="justify-content-center">
        <Col>
          <Table className="rewards-transactions-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Card</th>
                <th>Merchant Name</th>
                <th>Transaction Amount</th>
                <th>Points</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((t, i) => {
                if (i >= page * rowPerPage && i < (page + 1) * rowPerPage)
                  return (
                    <tr key={i}>
                      <td>{t.date}</td>
                      <td>{t.card}</td>
                      <td>{t.merchant_name}</td>
                      <td>{t.amount}</td>
                      <td>{t.points}</td>
                    </tr>
                  )
                else return null
              })}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container >
  )
}
