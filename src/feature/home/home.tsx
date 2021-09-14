/* eslint-disable no-restricted-globals */
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Card,Button } from 'antd';
import { IconFont } from '../../component/icon-font';
import './home.scss';

const { Meta } = Card;
interface HomeProps extends RouteComponentProps {
  status: string;
  onLeaveOrJoinSession: () => void;
}
const Home: React.FunctionComponent<HomeProps> = (props) => {
  const { history, status, onLeaveOrJoinSession} = props;
  const onCardClick = (type: string) => {
    history.push(`/${type}${location.search}`);
  };
  const featureList = [
    {
      key: 'video',
      icon: 'icon-meeting',
      title: 'Join Session',
      description:
        'Press to join',
    },
    // {
    //   key: 'chat',
    //   icon: 'icon-chat',
    //   title: 'Session chat',
    //   description: 'Session Chat, Chat Priviledge',
    // },
    // {
    //   key: 'preview',
    //   icon: 'icon-meeting',
    //   title: 'Local Preview',
    //   description: 'Audio and Video preview',
    // },
  ];
  let actionText;
  if (status === "connected") {
    actionText = "Leave";
  } else if (status === "closed") {
    actionText = "Join";
  }
  return (
    <div>
      <div className="nav">
          <span style={{ marginLeft: 20}} >
            VideoSDK Demo
          </span>
        {/* <a href="/" className="navhome">
          <img src="./logo.svg" alt="Home"  />
        </a> */}
        {/* <div className="navdoc">
        <a
          href="https://marketplace.zoom.us/docs/sdk/video/web/reference"
          target="_blank"
        >
          <span >
            API Reference
          </span>
        </a>

        <a
          href="https://marketplace.zoom.us/docs/sdk/video/web/build/sample-app"
          target="_blank"
        >
          <span >
            Doc
          </span>
        </a>
        </div> */}
        {actionText && (
          <Button
            type="link"
            className="navleave"
            onClick={onLeaveOrJoinSession}
          >
            {actionText}
          </Button>
        )}
      </div>

      <div className="home">
        <h1>DISKIN Zoom Video SDK Features "STAGE A"</h1>
        <h2>V 1.0</h2>
        <div className="feature-entry">
          {featureList.map((feature) => {
            const { key, icon, title, description } = feature;
            return (
              <Card
                cover={<IconFont style={{ fontSize: '72px' }} type={icon} />}
                hoverable
                style={{ width: 300 }}
                className="entry-item"
                key={key}
                onClick={() => onCardClick(key)}
              >
                <Meta title={title} description={description} />
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default Home;
