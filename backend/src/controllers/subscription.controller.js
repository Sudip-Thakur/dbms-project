import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import sql from "../db/db.js";

const toggleSubscription = asyncHandler(async (req, res)=>{
  console.log("called subs")
  const {channelId} = req.params;
  console.log(channelId);
  console.log(req.user[0].id)
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

const getSubscribedChannel = asyncHandler(async (req, res) => {
  console.log("called")
  const currentUser = req.user[0].id;
  
  let subscribedChannel = await sql`
    SELECT 
      u.id AS channelId,
      u.fullname,
      u.avatar,
      u.bio,
      COUNT(DISTINCT s2.subscriber) AS subscriberCount,
      COUNT(DISTINCT v.id) AS videoCount
    FROM subscriptions s1
    JOIN users u ON s1.subscribedTo = u.id
    LEFT JOIN subscriptions s2 ON u.id = s2.subscribedTo
    LEFT JOIN videos v ON u.id = v.owner AND v.isPublished = TRUE
    WHERE s1.subscriber = ${currentUser}
    GROUP BY u.id, u.fullname, u.avatar, u.bio;
  `;
  //add issubscribed = true in each
  subscribedChannel = subscribedChannel.map((channel) => {
    channel.issubscribed = true;
    return channel;
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        subscribedChannel,
        "Subscribed Channel"
      )
    );
});



export{
  toggleSubscription,
  getSubscribedChannel
}