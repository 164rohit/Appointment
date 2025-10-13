"use server";

import { db } from "@/lib/prisma";
import {auth}from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { th } from "zod/v4/locales";

export async function setAvailabilitySlots(formData){
  const {userId} = auth();

  if(!userId){
    throw new Error("Unauthorized");
  }

  try{
    const doctor = await db.user.findUnique({
        where:{
            clerkUserId:userId,
            role:"DOCTOR",
        },
    });
    if(!doctor){
        throw new Error("Doctor not found");
    }

    //get form data
    const startTime = formData.get("startTime");
    const endTime = formData.get("endTime");

    //validate input
    if(!startTime || !endTime){
        throw new Error("Start time and end time are required");
    }
    if(startTime >= endTime){
        throw new Error("End time must be after start time");
    }

    const existingSlots = await db.availability.findMany({
        where:
        {doctorId:doctor.id,

        },
    });

    if (existingSlots.length > 0){
        const slotWithNoAppontments = existingSlots.filter(
            (slot) => !slot.appointments
        );
        if (slotWithNoAppontments.length > 0){
            await db.availability.deleteMany({
                where:{
                    id:{
                        in:slotWithNoAppontments.map((slot) => slot.id),
                    },
                },
            });
        }
    }

    //create new availabilty slot

    const newSlot = await db.availability.create({
        data:{
            doctorId:doctor.id,
            startTime:new Date(startTime),
            endTime:new Date(endTime),
            status:"AVAILABLE",
        },
    });

    revalidatePath("/doctor");
    return {success:true, slot:newSlot};
       

  } catch(error){
    throw new Error(`Failed to set availability slots: ${error.message}`);
  }
}

export async function getDoctorAvailability() {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("Unauthorized");
    }

    try {
        const doctor = await db.user.findFirst({
            where: {
                clerkUserId: userId,
                role: "DOCTOR",
            },
        });

        if (!doctor) {
            throw new Error("Doctor not found");
        }

        const availabilitySlots = await db.availability.findMany({
            where: {
                doctorId: doctor.id,
            },
            orderBy: {
                startTime: "asc",
            },
        });

        return { slots: availabilitySlots };
    } catch (error) {
        throw new Error(`Failed to get availability slots: ${error.message}`);
    }
}


export async function getDoctorAppointments(){
    return [];
}
