import React from 'react'
import { AuctionType } from '../models/auction'
import Image from 'next/image'
  
  const AuctionCard = ({ auction }: { auction: AuctionType }) => {
    return (
        <div className="bg-white w-52 h-60 rounded-2xl">
        <h2>{auction.title}</h2>
        <p>{auction.start_price} €</p>
        <Image
          width={100}
          height={100}
          src={`http://localhost:8080/files/${auction.image}`}
          alt={auction.title}
        />
      </div>
    )
  }
  
  export default AuctionCard