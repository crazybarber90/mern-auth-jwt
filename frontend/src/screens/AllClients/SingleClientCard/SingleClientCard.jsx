import './singleClientCard.css'

const SingleClientCard = ({ client }) => {
  console.log('CLIENT', client)
  return (
    <div className="singleClientCardWrapper">
      <h1>{client.name}</h1>
      <p>{client.email}</p>
      <p>{client._id}</p>
    </div>
  )
}

export default SingleClientCard
