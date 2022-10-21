import React from 'react';
import { useSelector } from 'react-redux';

const Error = () => {
  const error = useSelector((state) => state.error);

  if (!error.message) {
    return null;
  }

  return <div className="error">{error.message}</div>;
};

export default Error;
