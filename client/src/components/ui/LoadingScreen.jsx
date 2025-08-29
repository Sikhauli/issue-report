import React from 'react';
import { Circles } from "react-loading-icons";

export const LoadingScreen = () => {
  return (
    <div
      className={`fixed top-0 left-0 right-0 bottom-0 z-[10000] flex items-center justify-center backdrop-blur-sm bg-black/10`}
    >
      <Circles fill="#006FEE" height="3rem" speed={2} />
    </div>
  );
};