import { useState, useEffect } from "react";

export const useTestimonials = (testimonials, intervalTime = 8000) => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    if (!testimonials || testimonials.length === 0) return;

    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, intervalTime);

    return () => clearInterval(timer);
  }, [testimonials.length, intervalTime]);

  return {
    currentTestimonial,
    setCurrentTestimonial,
  };
};
