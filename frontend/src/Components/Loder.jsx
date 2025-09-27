import React from 'react';
import { BounceLoader } from 'react-spinners';

// This is a style object for the loader, which is an alternative to Tailwind CSS classes
const override = {
  display: 'block',
  margin: '0 auto',
  borderColor: 'red',
};

const AnotherLoader = ({ isLoading }) => {
  return (
    <div className="sweet-loading">
      {/* The 'loading' prop controls the visibility of the loader. */}
      <BounceLoader
        color="#6469ff"
        loading={isLoading}
        cssOverride={override}
        size={150}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  );
};

export default AnotherLoader;