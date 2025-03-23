import React, { useEffect, useRef, useState } from 'react';
import * as rrweb from 'rrweb';

const RrwebPage = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const replayerRef = useRef<rrweb.Replayer | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 开始回放
  const startReplay = () => {
    if (!containerRef.current) return;

    const events = JSON.parse(localStorage.getItem('rrweb') || '[]');
    if (events.length === 0) {
      alert('没有可回放的记录');
      return;
    }

    if (replayerRef.current) {
      replayerRef.current.destroy();
    }
    console.log('events', events.events);
    replayerRef.current = new rrweb.Replayer(events.events, {
      root: containerRef.current,
      speed: 1,
      showWarning: false,
    });

    replayerRef.current.play();
    setIsPlaying(true);
  };

  // 暂停回放
  const pauseReplay = () => {
    if (replayerRef.current) {
      replayerRef.current.pause();
      setIsPlaying(false);
    }
  };

  // 组件卸载时清理
  useEffect(() => {
    return () => {
      if (replayerRef.current) {
        replayerRef.current.destroy();
      }
    };
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">回放页面</h1>

      <div className="mb-4 space-x-4">
        {!isPlaying ? (
          <button
            onClick={startReplay}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            开始回放
          </button>
        ) : (
          <button
            onClick={pauseReplay}
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
            暂停回放
          </button>
        )}
      </div>

      {/* 回放容器 */}
      <div ref={containerRef} className="w-full h-[600px] border border-gray-300 rounded"></div>
    </div>
  );
};

export default RrwebPage;
