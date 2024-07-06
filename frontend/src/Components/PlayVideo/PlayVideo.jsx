import React from 'react'
import './PlayVideo.css'
import video1 from '../../assets/video.mp4'
import like from '../../assets/like.png'
import share from '../../assets/share.png'
import save from '../../assets/save.png'
import jack from '../../assets/jack.png'
import user_profile from '../../assets/user_profile.jpg'

const PlayVideo = () => {
  return (
    <div className='play-video'>
        <video src={video1}  controls autoPlay loop muted></video>
        <h3>Video Title</h3>
        <div className='play-video-info'>
            <p> 1K Views &bull; ReleaseDate</p>
            <div>
                <span><img src={like} alt="" /> 1000</span>
                <span><img src={share} alt="" /> share</span>
                <span><img src={save} alt="" /> save</span>
            </div>
        </div>
        <hr />
        <div className="publisher"><
            img src={jack} alt="" />
            <div>
                <p>ChannelName</p>
                <span>1K Subscribers</span>
                </div>
                <button>Subscribe</button> 
            </div>
            <div className="video-description">
                <p>Video Description</p>
                <p>Description</p>
                <hr />
                <h4>100 Comments</h4>
                <div className="comment">
                    <img src={user_profile} alt="" />
                    <div>
                        <h3>Username <span>5 min ago</span></h3>
                        <p>dsfaljdklfjadjjjamdjek ajej adeeeeeeeeeeeeeeeeeeeeeeeeeee js</p>
                        <div className="comment-action">
                            <img src={like} alt="" />
                            <span>1212</span>
                        </div>
                    </div>
                </div>
                <div className="comment">
                    <img src={user_profile} alt="" />
                    <div>
                        <h3>Username <span>5 min ago</span></h3>
                        <p>dsfaljdklfjadjjjamdjek ajej adeeeeeeeeeeeeeeeeeeeeeeeeeee js</p>
                        <div className="comment-action">
                            <img src={like} alt="" />
                            <span>1212</span>
                        </div>
                    </div>
                </div>
                <div className="comment">
                    <img src={user_profile} alt="" />
                    <div>
                        <h3>Username <span>5 min ago</span></h3>
                        <p>dsfaljdklfjadjjjamdjek ajej adeeeeeeeeeeeeeeeeeeeeeeeeeee js</p>
                        <div className="comment-action">
                            <img src={like} alt="" />
                            <span>1212</span>
                        </div>
                    </div>
                </div>
                <div className="comment">
                    <img src={user_profile} alt="" />
                    <div>
                        <h3>Username <span>5 min ago</span></h3>
                        <p>dsfaljdklfjadjjjamdjek ajej adeeeeeeeeeeeeeeeeeeeeeeeeeee js</p>
                        <div className="comment-action">
                            <img src={like} alt="" />
                            <span>1212</span>
                        </div>
                    </div>
                </div>
                <div className="comment">
                    <img src={user_profile} alt="" />
                    <div>
                        <h3>Username <span>5 min ago</span></h3>
                        <p>dsfaljdklfjadjjjamdjek ajej adeeeeeeeeeeeeeeeeeeeeeeeeeee js</p>
                        <div className="comment-action">
                            <img src={like} alt="" />
                            <span>1212</span>
                        </div>
                    </div>
                </div>
            </div>
    </div>
  )
}

export default PlayVideo