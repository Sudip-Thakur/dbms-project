import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import sql from "../db/db.js";

const toggleSubscription = asyncHandler(async (req, res)=>{
  const {channelId} = req.params;
  console.log(channelId);
  const currentUser = req.user[0]
  const existingSubscription = await sql `select * from subscriptions where subscriber=${currentUser.id} and subscribedTo=${channelId}`
  
  if(existingSubscription.length === 0){
    await sql `insert into subscriptions(subscriber,subscribedTo) values (${currentUser.id},${channelId})`
    return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {
          subscribed: true
        },
        "Subscribed to channel Successfully"
      )
    )
  }
  else{
    await sql `delete from subscriptions where subscriber=${currentUser.id} and subscribedTo=${channelId}`
    return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {
          subscribed: false
        },
        "Unsubscribed from channel "
      )
    )
  }


})

const getSubscribedChannel = asyncHandler(async(req, res)=>{
  const currentUser = req.user[0]
  const subscribedChannel = await sql `
    select u.fullName from users u
    JOIN subscriptions s
    ON u.id =s.subscribedTo
    where s.subscriber=${currentUser.id}
    `
  return res
  .status(200)
  .json(
    new ApiResponse(
      200,
      subscribedChannel,
      "Subscribed Channel"
    )
  )
})

export{
  toggleSubscription,
  getSubscribedChannel
}