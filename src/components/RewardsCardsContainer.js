import RewardsCard from "./RewardsCard"
import { useState, useEffect } from "react";
import { API_URL, CARD_POINTS } from '../utils/constants';
import { Auth } from 'aws-amplify';
import { useHistory } from 'react-router-dom'

export default function RewardsCardsContainer({ setAuthed }) {
  const [cards, setCards] = useState([])
  const history = useHistory()
  useEffect(() => {
    Auth.currentAuthenticatedUser().then((user) => {
      fetch(API_URL + 'cards/?id=' + user.attributes.sub,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.signInUserSession.accessToken.jwtToken}`,
          }
        })
        .then(res => res.json())
        .then(data => {
          let totalPoints = 0;
          setCards(data.map((d) => {
            totalPoints += d.points
            return {
              name: d.card_type.toUpperCase().replace('_', ' '),
              points: Math.floor(d.points * 100) / 100,
            }
          }))
          localStorage.setItem(CARD_POINTS, Math.floor(totalPoints * 100) / 100)
        })
      })
      .catch(err => {
        setAuthed(false);
        history.push('/login')
        console.error(err)
      })
  }, [])

  const cardColor = ["orange", "blue", "purple", "green", "black"]
  return (
    <div className="rewards-card-container mb-5">
      {cards.map((c, i) =>
        <RewardsCard key={i} bg={cardColor[i % 5]} name={c.name} points={c.points} />
      )}
    </div>

  )
}
