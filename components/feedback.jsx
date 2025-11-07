"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { savePatientFeedback } from "@/actions/appointments";
import useFetch from "@/hooks/use-fetch";
import { toast } from "sonner";
import { BarLoader } from "react-spinners";

export default function PatientFeedbackDialog({ appointmentId, open, onClose, onFeedbackSaved }) {
  const [feedback, setFeedback] = useState("");
  const { loading, data, fn: submitFeedback } = useFetch(savePatientFeedback);

  const handleSubmit = async () => {
    if (!appointmentId) {
      toast.error("Appointment ID is missing");
      return;
    }

    const formData = new FormData();
    formData.append("appointmentId", appointmentId);
    formData.append("feedback", feedback);

    await submitFeedback(formData);

    if (data?.success) {
      toast.success("Feedback submitted successfully");
      setFeedback("");
      onClose(); // closes the popup
      if (onFeedbackSaved) onFeedbackSaved(); // refetch appointments
    } else {
      toast.error(data?.message || "Failed to save feedback");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-white">
            Submit Feedback
          </DialogTitle>
        </DialogHeader>

        <div className="py-3">
          <Textarea
            placeholder="Write your feedback here..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="min-h-[120px]"
          />
        </div>

        {loading && <BarLoader width="100%" color="#36d7b7" />}

        <DialogFooter>
          <Button
            onClick={handleSubmit}
            disabled={loading || !feedback.trim()}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
