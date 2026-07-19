import React, { useEffect, useState } from 'react'
import HrDashboard from './HrDashboard';
import HrPage from './HrPage';


const HrLoggedIn = ({hrId}) => {

  return (
    <>
      <HrDashboard hrId={hrId}/>
      <HrPage hrId={hrId}/>
    </>
  )
}

export default HrLoggedIn;