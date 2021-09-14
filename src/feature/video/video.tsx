import React, { useContext, useRef, useState } from 'react';
import classnames from 'classnames';
import {
  FloatingMenu,
  MainButton,
  ChildButton,
  Directions,
} from 'react-floating-button-menu';
import { RouteComponentProps } from 'react-router-dom';
import ZoomContext from '../../context/zoom-context';
import ZoomMediaContext from '../../context/media-context';
import Avatar from './components/avatar';
import VideoFooter from './components/video-footer';
import Pagination from './components/pagination';

import { useVisitorsCanvasDimension } from './hooks/useVisitorsCanvasDimension';
import { useHostsCanvasDimension } from './hooks/useHostsCanvasDimension';
import { useVisitorsGalleryLayout } from './hooks/useVisitorsGalleryLayout';
import { useHostsGalleryLayout } from './hooks/useHostsGalleryLayout';

import { usePagination } from './hooks/usePagination';
import { useActiveVideo } from './hooks/useAvtiveVideo';
import { useShare } from './hooks/useShare';
import './video.scss';
import { isSupportWebCodecs } from '../../utils/platform';
import CloseMenuIcon from './plus_btn.png'
import OpenMenuIcon from './x_btn.png'
import AskGuideIcon from './AskGuide_btn.png'
import ChatIcon from './Chat_btn.png'
import DictionaryIcon from './Dictionary.png'
import ReactionIcon from './Reaction.png'
import TimelineIcon from './Timeline.png'

const VideoContainer: React.FunctionComponent<RouteComponentProps> = (props) => {
  const zmClient = useContext(ZoomContext);
  const {
    mediaStream,
    video: { decode: isVideoDecodeReady },
  } = useContext(ZoomMediaContext);
  const [isMenuOpen, setMenu] = useState(false)

  const videoVisitorsRef = useRef<HTMLCanvasElement | null>(null);
  const videoHostsRef = useRef<HTMLCanvasElement | null>(null);

  const shareRef = useRef<HTMLCanvasElement  | null>(null);
  const selfShareRef = useRef<HTMLCanvasElement & HTMLVideoElement| null>(null);
  const shareContainerRef = useRef<HTMLDivElement | null>(null);

  const canvasVisitorsDimension = useVisitorsCanvasDimension(mediaStream, videoVisitorsRef);
  const canvasHostsDimension = useHostsCanvasDimension(mediaStream, videoHostsRef);

  const activeVideo = useActiveVideo(zmClient);
  const { page: pageV, pageSize: pageSizeV, totalPage: totalPageV, totalSize: totalSizeV, setPage: setPageV } = usePagination(
    zmClient,
    canvasVisitorsDimension,
  );

  const { page: pageH, pageSize: pageSizeH, totalPage: totalPageH, totalSize: totalSizeH, setPage: setPageH } = usePagination(
    zmClient,
    canvasHostsDimension,
  );

  const { visibleParticipants: visibleVisitorsParticipants, layout: videoVisitorsLayout } = useVisitorsGalleryLayout(
    zmClient,
    mediaStream,
    isVideoDecodeReady,
    videoVisitorsRef,
    canvasVisitorsDimension,
    {
      page: pageV,
      pageSize: pageSizeV,
      totalPage: totalPageV,
      totalSize: totalSizeV,
    },
  );

  const { visibleParticipants: visibleHostsParticipants, layout: videoHostsLayout } = useHostsGalleryLayout(
    zmClient,
    mediaStream,
    isVideoDecodeReady,
    videoHostsRef,
    canvasHostsDimension,
    {
      page: pageH,
      pageSize: pageSizeH,
      totalPage: totalPageH,
      totalSize: totalSizeH,
    },
  );

  const { isRecieveSharing, isStartedShare, sharedContentDimension } = useShare(
    zmClient,
    mediaStream,
    shareRef,
  );
  const isSharing = isRecieveSharing || isStartedShare;
  const contentDimension = sharedContentDimension;
  if (isSharing && shareContainerRef.current) {
    const { width, height } = sharedContentDimension;
    const {
      width: containerWidth,
      height: containerHeight,
    } = shareContainerRef.current.getBoundingClientRect();
    const ratio = Math.min(containerWidth / width, containerHeight / height, 1);
    contentDimension.width = Math.floor(width * ratio);
    contentDimension.height = Math.floor(height * ratio);
  }
  console.log('visibleVisitorsParticipants,', visibleVisitorsParticipants);
  console.log('visibleHostsParticipants,', visibleHostsParticipants);
  
  return (
    <div className="viewport">
            <div className="textsContainer">
        <div><h2>{"Discussion Mode"}</h2></div>
        <div><h4>{"Location: OLD OSWIECIM TRAIN STATION"}</h4></div>
      </div>
      <div className="menuContainer">
      <FloatingMenu
      direction={Directions.Up}
    slideSpeed={500}
    spacing={20}
    isOpen={isMenuOpen}
  >
    <MainButton
      iconResting={<img width="65" height="65" src={CloseMenuIcon} alt="plus" />}
      iconActive={<img width="65" height="65" src={OpenMenuIcon} alt="close" />}
      background="black"
      onClick={() => setMenu(!isMenuOpen)}
      size={56}
    />
     <ChildButton
      icon={<img width="65" height="65" src={TimelineIcon} alt="Logo" />}
      background="black"
      size={56}
      onClick={() => console.log('First button clicked')}
    />
    <ChildButton
      icon={<img width="65" height="65" src={DictionaryIcon} alt="Logo" />}
      background="black"
      size={56}
    />
    <ChildButton
      icon={<img width="65" height="65" src={ReactionIcon} alt="Logo" />}
      background="black"
      size={56}
    />
        <ChildButton
      icon={<img width="65" height="65" src={ChatIcon} alt="Logo" />}
      background="black"
      size={56}
    />
        <ChildButton
      icon={<img width="65" height="65" src={AskGuideIcon} alt="Logo" />}
      background="black"
      size={56}
    />
  </FloatingMenu>
      </div>
      <div
        className={classnames('share-container', {
          'in-sharing': isSharing,
        })}
        ref={shareContainerRef}
      >
        <div
          className="share-container-viewport"
          style={{
            width: `${contentDimension.width}px`,
            height: `${contentDimension.height}px`,
          }}
        >
          <canvas
            className={classnames('share-canvas', { hidden: isStartedShare })}
            ref={shareRef}
          />
          {isSupportWebCodecs()?<video
            className={classnames('share-canvas', { hidden: isRecieveSharing })}
            ref={selfShareRef}
          />:<canvas
            className={classnames('share-canvas', { hidden: isRecieveSharing })}
            ref={selfShareRef}
          />}
        </div>
      </div>
      {!isSharing && <div
        className={classnames('video-container', {
          'in-sharing': isSharing,
        })}
      >
        <div
        className={classnames('video-container-visitors')}
      >
        <canvas
          className="video-canvas"
          id="video-canvas-visitors"
          width="800"
          height="600"
          ref={videoVisitorsRef}
        />
        <ul className="avatar-list">
          {visibleVisitorsParticipants.map((user, index) => {
            if (index > videoVisitorsLayout.length - 1) {
              return null;
            }
            const dimension = videoVisitorsLayout[index];
            const { width, height, x, y } = dimension;
            const { height: canvasHeight } = canvasVisitorsDimension;
            return (
              <Avatar
                height={height}
                width={width}
                participant={user}
                key={user.userId}
                isActive={activeVideo === user.userId}
                style={{
                  width: `${height}px`,
                  height: `${height}px`,
                  top: `${canvasHeight - y - height}px`,
                  left: `${x}px`,
                }}
              />
            );
          })}
        </ul>
        </div>
        <div
        className={classnames('video-container-hosts')}
      >
        <canvas
          className="video-canvas"
          id="video-canvas-hosts"
          width="600"
          height="800"
          ref={videoHostsRef}
        /> 
         <ul className="avatar-list">
          {visibleHostsParticipants.map((user, index) => {
            if (index > videoHostsLayout.length - 1) {
              return null;
            }
            const dimension = videoHostsLayout[index];
            const { width, height, x, y } = dimension;
            const { height: canvasHeight } = canvasHostsDimension;
            return (
              <Avatar
              height={height}
              width={width}
                participant={user}
                key={user.userId}
                isActive={activeVideo === user.userId}
                style={{
                  width: `${width}px`,
                  height: `${height}px`,
                  top: `${canvasHeight - y - height}px`,
                  left: `${x}px`,
                }}
              />
            );
          })}
        </ul>
        </div>
      </div>}
      <VideoFooter className="video-operations" sharing shareRef={selfShareRef} />
      {!isSharing && totalPageV > 1 && (
        <Pagination
          page={pageV}
          totalPage={totalPageV}
          setPage={setPageV}
          inSharing={isSharing}
        />
      )}
    </div>
  );
};

export default VideoContainer;
