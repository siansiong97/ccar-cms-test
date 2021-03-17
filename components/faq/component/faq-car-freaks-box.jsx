import { Divider } from 'antd';
import React from 'react';
import { connect } from 'react-redux';

const FAQCarFreaksBox = (props) => {


    return (
        <React.Fragment>
            <div className="thin-border round-border padding-md" id="carFreaks-topic-1">
                <div className="subtitle1 font-weight-bold">
                    What is CarFreaks?
                </div>
                <Divider style={{ margin: '5px 0' }} />
                <div className="subtitle1 text-overflow-break " style={{ lineHeight: 1.75 }}>
                    <span className="font-weight-bold">
                        Welcome to our CarFreak’s world! CarFreaks is a social platform with 3 major functions:
                    </span>
                    <br></br>
                    1. CarFreaks : A place where everyone could share his/her posts with images to his/her followers and public.
                    <br></br>
                    2. Social Board : A mini forum where anyone could create their own topics and gain insights from others.
                    <br></br>
                    3. CarFreaks Club: A platform to connect like-minded communities. Anyone could create their own car community groups and invite others to join your own club.
                    <br></br>

                    See you in CarFreaks soon! :D
                </div>
            </div>
            <div className="thin-border round-border padding-md margin-top-md" id="carFreaks-topic-2">
                <div className="subtitle1 font-weight-bold">
                    What Can I Do In CarFreaks?
                </div>
                <Divider style={{ margin: '5px 0' }} />
                <div className="subtitle1 text-overflow-break " style={{ lineHeight: 1.75 }}>
                    <span className="font-weight-bold">
                        Here are the list of the things you can do in CarFreaks:
                    </span>
                    <br></br>
                    <span className="font-weight-bold">
                        1. CarFreaks
                    </span>
                    <br></br>
                    <ul>
                        <li>
                            Write your own post and share it with others.
                        </li>
                        <li>
                            Comment your thoughts and feelings on others' posts.
                        </li>
                        <li>
                            Reply on others’ comments in the post.
                        </li>
                        <li>
                            View your following account's latest posts.
                        </li>
                        <li>
                            View the latest posts in the public tab.
                        </li>
                    </ul>
                    <span className="font-weight-bold">
                        2. Social Board
                    </span>
                    <br></br>
                    <ul>
                        <li>
                            Create your own topics and gain insights from others.
                        </li>
                        <li>
                            Advise others by commenting your thoughts on their topics.
                        </li>
                        <li>
                            Reply on others’ comments in the post.
                        </li>
                        <li>
                            View the trending topics of the day.
                        </li>
                    </ul>
                    <span className="font-weight-bold">
                        3. CarFreaks Club
                    </span>
                    <br></br>
                    <ul>
                        <li>
                            Create your own club and invite others to join.
                        </li>
                        <li>
                            Have discussion in your own communities.
                        </li>
                        <li>
                            View the available events in your own communities.
                        </li>
                        <li>
                            (Admin) Create both internal or external events.
                        </li>
                        <li>
                            (Admin) Add and remove members.
                        </li>
                    </ul>
                    <span className="font-weight-bold">
                        Note:
                    </span>
                    <br></br>
                        For a better user experience, you could create your own hashtag in any of your posts and you are allowed to tag/mention anyone who is available in CCAR.my.
                    <br></br>
                    <br></br>
                        Interested to experience all of the features? Let’s start your CarFreaks journey now!
                    <br></br>
                </div>
            </div>
        </React.Fragment>
    );
}

const mapStateToProps = state => ({
    productsList: state.productsList,
});

const mapDispatchToProps = {
}

export default connect(mapStateToProps, mapDispatchToProps)(FAQCarFreaksBox);