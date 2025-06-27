import React from 'react';
import Navbar from './components/navbar';
import Sidebar from './components/sidebar';
import Problemset from './components/problemset';

function Homepage() {
  return (
    <div className="container-fluid">
      <div className="grid grid-cols-12">
        <div className="col-span-3">
          <Sidebar />
        </div>
        <div className="col-span-9">
          <Navbar />
          <Problemset />
        </div>
      </div>
    </div>
  );
}

export default Homepage;
