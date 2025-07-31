// Form configurations for the contact modal
export const formConfigs = {
  consultation: {
    title: "Free Consultation",
    subtitle: "For stroke survivors, SCI survivors, and their families",
    fields: [
      { name: "name", type: "text", label: "Full Name", required: true },
      { name: "email", type: "email", label: "Email Address", required: true },
      { name: "phone", type: "tel", label: "Phone Number", required: true },
      {
        name: "injuryType",
        type: "select",
        label: "Type of Injury/Condition",
        required: true,
        options: [
          "Stroke",
          "Spinal Cord Injury",
          "Other Neurological Condition",
          "Family Member/Caregiver",
        ],
      },
      {
        name: "timeframe",
        type: "select",
        label: "Time Since Injury",
        required: true,
        options: [
          "Less than 6 months",
          "6 months - 1 year",
          "1-2 years",
          "2-5 years",
          "More than 5 years",
          "N/A - Family Member",
        ],
      },
      {
        name: "goals",
        type: "textarea",
        label: "What are your primary recovery goals?",
        required: true,
      },
    ],
  },
  professional: {
    title: "Professional Training Inquiry",
    subtitle: "For healthcare professionals and students",
    fields: [
      { name: "name", type: "text", label: "Full Name", required: true },
      { name: "email", type: "email", label: "Email Address", required: true },
      { name: "phone", type: "tel", label: "Phone Number", required: true },
      {
        name: "organization",
        type: "text",
        label: "Organization/Institution",
        required: true,
      },
      {
        name: "experience",
        type: "select",
        label: "Professional Background",
        required: true,
        options: [
          "Occupational Therapist",
          "Physical Therapist",
          "Student (OT/PT)",
          "Other Healthcare Professional",
          "Fitness Professional",
        ],
      },
      {
        name: "timeframe",
        type: "select",
        label: "When are you looking to attend?",
        required: true,
        options: [
          "Next 3 months",
          "3-6 months",
          "6-12 months",
          "Just exploring options",
        ],
      },
      {
        name: "goals",
        type: "textarea",
        label: "What do you hope to gain from RISE training?",
        required: true,
      },
    ],
  },
  general: {
    title: "General Inquiry",
    subtitle: "Questions, partnerships, or other inquiries",
    fields: [
      { name: "name", type: "text", label: "Full Name", required: true },
      { name: "email", type: "email", label: "Email Address", required: true },
      { name: "phone", type: "tel", label: "Phone Number", required: false },
      {
        name: "type",
        type: "select",
        label: "Inquiry Type",
        required: true,
        options: [
          "General Information",
          "Partnership Opportunity",
          "Media Inquiry",
          "Research Collaboration",
          "Other",
        ],
      },
      {
        name: "message",
        type: "textarea",
        label: "Your Message",
        required: true,
      },
    ],
  },
};

// Initial form data structure
export const initialFormData = {
  name: "",
  email: "",
  phone: "",
  type: "",
  message: "",
  injuryType: "",
  timeframe: "",
  goals: "",
  experience: "",
  organization: "",
};

// Utility functions for testimonials
export const getTypeColor = (type) => {
  switch (type) {
    case "trainer":
      return "from-blue-500 to-purple-500";
    case "participant":
      return "from-red-500 to-yellow-400";
    case "family":
      return "from-green-500 to-blue-500";
    default:
      return "from-red-500 to-yellow-400";
  }
};

export const getTypeIcon = (type) => {
  switch (type) {
    case "trainer":
      return "👨‍⚕️";
    case "participant":
      return "💪";
    case "family":
      return "❤️";
    default:
      return "⭐";
  }
};
