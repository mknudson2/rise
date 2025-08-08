import React, { useState, useRef, useEffect } from "react";
import {
  Save,
  Upload,
  Eye,
  Edit3,
  Image,
  Type,
  Trash2,
  Plus,
  Users,
  MessageSquare,
  HelpCircle,
  Phone,
  Mail,
  MapPin,
  Star,
  X,
  LogOut,
} from "lucide-react";

const API_BASE = import.meta.env.PROD
  ? "https://your-production-api.com/api"
  : "http://localhost:3001/api";

const RiseCMS = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("hero");
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [notification, setNotification] = useState(null);
  const fileInputRef = useRef(null);

  // Load content from API
  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/content`);
      if (!response.ok) throw new Error("Failed to fetch content");
      const data = await response.json();
      setContent(data);
    } catch (error) {
      console.error("Error fetching content:", error);
      showNotification("Failed to load content", "error");
    } finally {
      setLoading(false);
    }
  };

  // Save content to API
  const saveContent = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem("cms-token") || "demo-token";

      const response = await fetch(`${API_BASE}/content`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(content),
      });

      if (!response.ok) throw new Error("Failed to save content");

      showNotification("Content saved successfully!", "success");
    } catch (error) {
      console.error("Error saving content:", error);
      showNotification("Failed to save content", "error");
    } finally {
      setSaving(false);
    }
  };

  // Show notification
  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Handle content updates
  const updateContent = (path, value) => {
    setContent((prev) => {
      const newContent = JSON.parse(JSON.stringify(prev));
      const keys = path.split(".");
      let current = newContent;

      for (let i = 0; i < keys.length - 1; i++) {
        if (Array.isArray(current) && !isNaN(keys[i])) {
          current = current[parseInt(keys[i])];
        } else {
          current = current[keys[i]];
        }
      }

      const lastKey = keys[keys.length - 1];
      if (Array.isArray(current) && !isNaN(lastKey)) {
        current[parseInt(lastKey)] = value;
      } else {
        current[lastKey] = value;
      }

      return newContent;
    });
  };

  // Handle image upload simulation
  const handleImageUpload = (path) => {
    fileInputRef.current?.click();
    fileInputRef.current.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          updateContent(path, e.target.result);
        };
        reader.readAsDataURL(file);
      }
    };
  };

  // Add/remove items from arrays
  const addItem = (path, template) => {
    const pathArray = path.split(".");
    let current = content;

    for (let i = 0; i < pathArray.length; i++) {
      if (i === pathArray.length - 1) {
        if (Array.isArray(current[pathArray[i]])) {
          updateContent(path, [
            ...current[pathArray[i]],
            { ...template, id: Date.now() },
          ]);
        }
      } else {
        current = current[pathArray[i]];
      }
    }
  };

  const removeItem = (path, index) => {
    const pathArray = path.split(".");
    let current = content;

    for (let i = 0; i < pathArray.length; i++) {
      if (i === pathArray.length - 1) {
        if (Array.isArray(current[pathArray[i]])) {
          const newArray = current[pathArray[i]].filter(
            (_, idx) => idx !== index
          );
          updateContent(path, newArray);
        }
      } else {
        current = current[pathArray[i]];
      }
    }
  };

  const tabs = [
    { id: "hero", name: "Hero Section", icon: Star },
    { id: "scrolling", name: "Scrolling Words", icon: Type },
    { id: "pathways", name: "Success Pathways", icon: Users },
    { id: "method", name: "RISE Method", icon: Star },
    { id: "team", name: "Team", icon: Users },
    { id: "testimonials", name: "Testimonials", icon: MessageSquare },
    { id: "faq", name: "FAQ", icon: HelpCircle },
    { id: "contact", name: "Contact", icon: Phone },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading CMS...</p>
        </div>
      </div>
    );
  }

  const renderEditor = () => {
    switch (activeTab) {
      case "hero":
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Edit3 className="mr-2 h-5 w-5" />
                Hero Section
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Main Title
                  </label>
                  <input
                    type="text"
                    value={content.hero?.title || ""}
                    onChange={(e) =>
                      updateContent("hero.title", e.target.value)
                    }
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Subtitle
                  </label>
                  <textarea
                    value={content.hero?.subtitle || ""}
                    onChange={(e) =>
                      updateContent("hero.subtitle", e.target.value)
                    }
                    rows="2"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Description
                  </label>
                  <textarea
                    value={content.hero?.description || ""}
                    onChange={(e) =>
                      updateContent("hero.description", e.target.value)
                    }
                    rows="3"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Background Image URL
                  </label>
                  <input
                    type="url"
                    value={content.hero?.backgroundImage || ""}
                    onChange={(e) =>
                      updateContent("hero.backgroundImage", e.target.value)
                    }
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Rotating Words (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={content.hero?.rotatingWords?.join(", ") || ""}
                    onChange={(e) =>
                      updateContent(
                        "hero.rotatingWords",
                        e.target.value.split(", ")
                      )
                    }
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="Recovery, Innovation, Science, Excellence"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Stats Cards
                  </label>
                  {(content.hero?.stats || []).map((stat, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg p-4 mb-3"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">Stat {index + 1}</h4>
                        <button
                          onClick={() => removeItem("hero.stats", index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Value
                          </label>
                          <input
                            type="text"
                            value={stat.value || ""}
                            onChange={(e) =>
                              updateContent(
                                `hero.stats.${index}.value`,
                                e.target.value
                              )
                            }
                            className="w-full p-2 border border-gray-300 rounded-md"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Label
                          </label>
                          <input
                            type="text"
                            value={stat.label || ""}
                            onChange={(e) =>
                              updateContent(
                                `hero.stats.${index}.label`,
                                e.target.value
                              )
                            }
                            className="w-full p-2 border border-gray-300 rounded-md"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() =>
                      addItem("hero.stats", {
                        value: "New Stat",
                        label: "Description",
                      })
                    }
                    className="flex items-center px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    <Plus className="mr-1 h-4 w-4" />
                    Add Stat
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      case "scrolling":
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Type className="mr-2 h-5 w-5" />
                Scrolling Words Section
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Scrolling Words (one per line)
                  </label>
                  <textarea
                    value={(content.scrollingWords || []).join("\n")}
                    onChange={(e) =>
                      updateContent(
                        "scrollingWords",
                        e.target.value.split("\n").filter((word) => word.trim())
                      )
                    }
                    rows="12"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                    placeholder="Empowering&#10;Invigorating&#10;Freedom&#10;Groundbreaking&#10;Inspiring&#10;Life-Changing"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Enter one word per line. These words will scroll across the
                    screen with "RISE is" highlighting.
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Preview:</h4>
                  <div className="text-sm text-gray-600">
                    <strong>Current words:</strong>{" "}
                    {(content.scrollingWords || []).length} words
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Examples: "RISE is Empowering", "RISE is Life-Changing",
                    etc.
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "pathways":
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Users className="mr-2 h-5 w-5" />
                Success Pathways
              </h3>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Section Title
                  </label>
                  <input
                    type="text"
                    value={content.successPathways?.title || ""}
                    onChange={(e) =>
                      updateContent("successPathways.title", e.target.value)
                    }
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="Success Pathways"
                  />
                </div>

                {/* Survivor Section */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium mb-3 text-gray-800">
                    Survivor Pathway
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Title
                      </label>
                      <input
                        type="text"
                        value={content.successPathways?.survivor?.title || ""}
                        onChange={(e) =>
                          updateContent(
                            "successPathways.survivor.title",
                            e.target.value
                          )
                        }
                        className="w-full p-2 border border-gray-300 rounded-md"
                        placeholder="…as a stroke / SCI survivor"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Image URL
                      </label>
                      <input
                        type="url"
                        value={content.successPathways?.survivor?.image || ""}
                        onChange={(e) =>
                          updateContent(
                            "successPathways.survivor.image",
                            e.target.value
                          )
                        }
                        className="w-full p-2 border border-gray-300 rounded-md"
                        placeholder="/assets/images/survivor.jpg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Description
                      </label>
                      <textarea
                        value={
                          content.successPathways?.survivor?.description || ""
                        }
                        onChange={(e) =>
                          updateContent(
                            "successPathways.survivor.description",
                            e.target.value
                          )
                        }
                        rows="4"
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                </div>

                {/* Trainer Section */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium mb-3 text-gray-800">
                    Trainer Pathway
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Title
                      </label>
                      <input
                        type="text"
                        value={content.successPathways?.trainer?.title || ""}
                        onChange={(e) =>
                          updateContent(
                            "successPathways.trainer.title",
                            e.target.value
                          )
                        }
                        className="w-full p-2 border border-gray-300 rounded-md"
                        placeholder="…as a trainer"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Image URL
                      </label>
                      <input
                        type="url"
                        value={content.successPathways?.trainer?.image || ""}
                        onChange={(e) =>
                          updateContent(
                            "successPathways.trainer.image",
                            e.target.value
                          )
                        }
                        className="w-full p-2 border border-gray-300 rounded-md"
                        placeholder="/assets/images/trainer.webp"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Description
                      </label>
                      <textarea
                        value={
                          content.successPathways?.trainer?.description || ""
                        }
                        onChange={(e) =>
                          updateContent(
                            "successPathways.trainer.description",
                            e.target.value
                          )
                        }
                        rows="4"
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "team":
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Users className="mr-2 h-5 w-5" />
                Team Members
              </h3>

              {(content.team || []).map((member, index) => (
                <div
                  key={member.id || index}
                  className="border border-gray-200 rounded-lg p-4 mb-4"
                >
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium">Team Member {index + 1}</h4>
                    <button
                      onClick={() => removeItem("team", index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Name
                        </label>
                        <input
                          type="text"
                          value={member.name || ""}
                          onChange={(e) =>
                            updateContent(`team.${index}.name`, e.target.value)
                          }
                          className="w-full p-2 border border-gray-300 rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Title
                        </label>
                        <input
                          type="text"
                          value={member.title || ""}
                          onChange={(e) =>
                            updateContent(`team.${index}.title`, e.target.value)
                          }
                          className="w-full p-2 border border-gray-300 rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Subtitle
                        </label>
                        <input
                          type="text"
                          value={member.subtitle || ""}
                          onChange={(e) =>
                            updateContent(
                              `team.${index}.subtitle`,
                              e.target.value
                            )
                          }
                          className="w-full p-2 border border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Image URL
                        </label>
                        <input
                          type="url"
                          value={member.image || ""}
                          onChange={(e) =>
                            updateContent(`team.${index}.image`, e.target.value)
                          }
                          className="w-full p-2 border border-gray-300 rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Image Preview
                        </label>
                        {member.image && (
                          <img
                            src={member.image}
                            alt={member.name}
                            className="w-16 h-16 object-cover rounded-full border"
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3">
                    <label className="block text-sm font-medium mb-1">
                      Bio
                    </label>
                    <textarea
                      value={member.bio || ""}
                      onChange={(e) =>
                        updateContent(`team.${index}.bio`, e.target.value)
                      }
                      rows="4"
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div className="mt-3">
                    <label className="block text-sm font-medium mb-1">
                      Specialties (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={(member.specialties || []).join(", ")}
                      onChange={(e) =>
                        updateContent(
                          `team.${index}.specialties`,
                          e.target.value.split(", ").filter(Boolean)
                        )
                      }
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              ))}

              <button
                onClick={() =>
                  addItem("team", {
                    name: "New Team Member",
                    title: "Position",
                    subtitle: "Subtitle",
                    bio: "Bio description...",
                    image:
                      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
                    specialties: ["Specialty 1", "Specialty 2"],
                    gradientFrom: "from-red-500",
                    gradientTo: "to-yellow-400",
                  })
                }
                className="flex items-center px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                <Plus className="mr-1 h-4 w-4" />
                Add Team Member
              </button>
            </div>
          </div>
        );

      case "testimonials":
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <MessageSquare className="mr-2 h-5 w-5" />
                Testimonials
              </h3>

              {(content.testimonials || []).map((testimonial, index) => (
                <div
                  key={testimonial.id || index}
                  className="border border-gray-200 rounded-lg p-4 mb-3"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium">Testimonial {index + 1}</h4>
                    <button
                      onClick={() => removeItem("testimonials", index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Quote
                      </label>
                      <textarea
                        value={testimonial.quote || ""}
                        onChange={(e) =>
                          updateContent(
                            `testimonials.${index}.quote`,
                            e.target.value
                          )
                        }
                        rows="3"
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Author
                        </label>
                        <input
                          type="text"
                          value={testimonial.author || ""}
                          onChange={(e) =>
                            updateContent(
                              `testimonials.${index}.author`,
                              e.target.value
                            )
                          }
                          className="w-full p-2 border border-gray-300 rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Type
                        </label>
                        <select
                          value={testimonial.type || "participant"}
                          onChange={(e) =>
                            updateContent(
                              `testimonials.${index}.type`,
                              e.target.value
                            )
                          }
                          className="w-full p-2 border border-gray-300 rounded-md"
                        >
                          <option value="participant">Participant</option>
                          <option value="trainer">Trainer</option>
                          <option value="family">Family</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <button
                onClick={() =>
                  addItem("testimonials", {
                    quote: "New testimonial quote...",
                    author: "Author Name",
                    type: "participant",
                  })
                }
                className="flex items-center px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                <Plus className="mr-1 h-4 w-4" />
                Add Testimonial
              </button>
            </div>
          </div>
        );

      case "faq":
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <HelpCircle className="mr-2 h-5 w-5" />
                FAQ Section
              </h3>

              {(content.faq || []).map((faq, index) => (
                <div
                  key={faq.id || index}
                  className="border border-gray-200 rounded-lg p-4 mb-3"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium">FAQ {index + 1}</h4>
                    <button
                      onClick={() => removeItem("faq", index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Question
                      </label>
                      <input
                        type="text"
                        value={faq.question || ""}
                        onChange={(e) =>
                          updateContent(`faq.${index}.question`, e.target.value)
                        }
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Answer
                      </label>
                      <textarea
                        value={faq.answer || ""}
                        onChange={(e) =>
                          updateContent(`faq.${index}.answer`, e.target.value)
                        }
                        rows="4"
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                </div>
              ))}

              <button
                onClick={() =>
                  addItem("faq", {
                    question: "New question?",
                    answer: "Answer to the question...",
                  })
                }
                className="flex items-center px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                <Plus className="mr-1 h-4 w-4" />
                Add FAQ
              </button>
            </div>
          </div>
        );

      case "contact":
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Phone className="mr-2 h-5 w-5" />
                Contact Section
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Section Title
                  </label>
                  <input
                    type="text"
                    value={content.contact?.title || ""}
                    onChange={(e) =>
                      updateContent("contact.title", e.target.value)
                    }
                    className="w-full p-3 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Subtitle
                  </label>
                  <textarea
                    value={content.contact?.subtitle || ""}
                    onChange={(e) =>
                      updateContent("contact.subtitle", e.target.value)
                    }
                    rows="2"
                    className="w-full p-3 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Contact Information
                  </label>
                  {(content.contact?.contactInfo || []).map((info, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 mb-2"
                    >
                      <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded">
                        {info.icon === "phone" && <Phone size={16} />}
                        {info.icon === "email" && <Mail size={16} />}
                        {info.icon === "location" && <MapPin size={16} />}
                      </div>
                      <input
                        type="text"
                        value={info.value || ""}
                        onChange={(e) =>
                          updateContent(
                            `contact.contactInfo.${index}.value`,
                            e.target.value
                          )
                        }
                        className="flex-1 p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Emergency Notice
                  </label>
                  <textarea
                    value={content.contact?.emergencyNotice || ""}
                    onChange={(e) =>
                      updateContent("contact.emergencyNotice", e.target.value)
                    }
                    rows="3"
                    className="w-full p-3 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="p-8 text-center text-gray-500">
            Select a section to edit
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <img
                src="/assets/logo/logo-dark.png"
                alt="RISE Logo"
                className="h-8 w-8"
              />
              <h1 className="text-2xl font-bold text-gray-900">RISE CMS</h1>
              <span className="text-sm text-gray-500">
                Content Management System
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsPreviewMode(!isPreviewMode)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  isPreviewMode
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                <Eye className="inline mr-1 h-4 w-4" />
                {isPreviewMode ? "Exit Preview" : "Preview"}
              </button>

              <button
                onClick={saveContent}
                disabled={saving}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                <Save className="mr-2 h-4 w-4" />
                {saving ? "Saving..." : "Save Changes"}
              </button>

              <button
                onClick={() => (window.location.href = "/")}
                className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Exit CMS
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Notification */}
      {notification && (
        <div
          className={`fixed top-20 right-4 z-50 p-4 rounded-lg shadow-lg ${
            notification.type === "success" ? "bg-green-500" : "bg-red-500"
          } text-white`}
        >
          <div className="flex items-center">
            <span>{notification.message}</span>
            <button
              onClick={() => setNotification(null)}
              className="ml-2 text-white hover:text-gray-200"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-8">
        {!isPreviewMode ? (
          <div className="grid grid-cols-12 gap-6">
            {/* Sidebar */}
            <div className="col-span-3">
              <div className="bg-white rounded-lg shadow-md p-4 sticky top-8">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Content Sections
                </h3>
                <nav className="space-y-2">
                  {tabs.map((tab) => {
                    const IconComponent = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                          activeTab === tab.id
                            ? "bg-blue-600 text-white"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        <IconComponent className="mr-2 h-4 w-4" />
                        {tab.name}
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>

            {/* Editor */}
            <div className="col-span-9">{renderEditor()}</div>
          </div>
        ) : (
          // Preview Mode
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Website Preview</h2>
            <div className="space-y-8">
              {/* Hero Preview */}
              <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-8 rounded-lg">
                <h1 className="text-4xl font-bold mb-4">
                  {content.hero?.title}
                </h1>
                <p className="text-xl mb-4">{content.hero?.subtitle}</p>
                <p className="text-gray-300 mb-6">
                  {content.hero?.description}
                </p>
                <div className="grid grid-cols-3 gap-4">
                  {(content.hero?.stats || []).map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className="text-2xl font-bold text-yellow-400">
                        {stat.value}
                      </div>
                      <div className="text-sm text-gray-300">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Team Preview */}
              <div>
                <h2 className="text-2xl font-bold mb-4">Team</h2>
                <div className="grid grid-cols-3 gap-4">
                  {(content.team || []).map((member, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-16 h-16 rounded-full mx-auto mb-3 object-cover"
                      />
                      <h3 className="font-semibold text-center">
                        {member.name}
                      </h3>
                      <p className="text-sm text-gray-600 text-center">
                        {member.title}
                      </p>
                      <p className="text-xs text-gray-500 text-center">
                        {member.subtitle}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
      />
    </div>
  );
};

export default RiseCMS;
