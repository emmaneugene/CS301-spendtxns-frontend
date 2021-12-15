import RewardsCardsContainer from "../components/RewardsCardsContainer"
import RewardsTransactions from "../components/RewardsTransactions"
function Rewards({authed,setAuthed}) {
  return (
    <div className="rewards-page">
      <RewardsCardsContainer setAuthed={setAuthed}/>
      <RewardsTransactions />
    </div>
  )
}
export default Rewards