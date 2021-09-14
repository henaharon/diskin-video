import React from 'react';
import { AudioMutedOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import './avatar.scss';
import { Participant } from '../../../index-types';
import MicOff from './mic_OFF.png'
import MicOn from './mic_Talking.png'
import PlaceHolder from './silhouett.png'

interface AvatarProps {
  height: number,
  width: number,
  participant: Participant;
  style?: { [key: string]: string };
  isActive: boolean;
  className?: string;
}
const Avatar = (props: AvatarProps) => {
  const { height, width, participant, style, isActive, className } = props;
  const { displayName, audio, muted, bVideoOn } = participant;
  return (
    <div
      className={classNames('avatar', { 'avatar-active': isActive }, className)}
      style={{ ...style, background: bVideoOn ? 'transparent' : '#232323' }}
    >
      {!bVideoOn && <img width={height * 0.5} height={height * 0.6} src={PlaceHolder} alt="Logo" />}
      {muted && <img className="mic" width={25} height={25} src={MicOff} alt="Logo" />}
      {audio === 'computer' && !muted && <img className="mic"  width={25} height={25} src={MicOn} alt="Logo" />}
      <p style={{ bottom: -25}} className="center-name">{displayName}</p>
    </div>
  );
};

export default Avatar;
