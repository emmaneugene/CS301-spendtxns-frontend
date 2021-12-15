export default function RewardsCard(props) {
  const { bg, name, points } = props
  return (
    <div className={`rewards-card d-inline-block bg-${bg}`}>
      <div className="name">{name}</div>
      <div className="points">{points} points</div>
    </div>
  )
}