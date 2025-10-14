import { redirect } from 'next/dist/server/api-utils';
import React from 'react'
import { Doc } from 'zod/v4/core';
import { getAvailableTimeSlots, getDoctorById } from '@/actions/appointments';
import DoctorProfile from './_components/doctor-profile';

const DoctorProfilePage = async({params}) => {
  const {id} = await params ;

  try{
    const [doctorData,slotsData]= await Promise.all([
        getDoctorById(id),
        getAvailableTimeSlots(id),
    ]);
   
    return <DoctorProfile
      doctor={doctorData.doctor}
      availableDays={slotsData.days || []}
    />

        
  }catch(error){
    console.error("Error loading doctor profile:", error);
    redirect("/doctors");

  }
};

export default DoctorProfilePage;
