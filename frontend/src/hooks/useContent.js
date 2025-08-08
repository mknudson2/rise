import { useState, useEffect } from "react";

const API_BASE = import.meta.env.PROD
  ? "https://your-production-api.com/api"
  : "http://localhost:3001/api";

export const useContent = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE}/content`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Content loaded from API:", data);
      setContent(data);
    } catch (err) {
      console.error("Error fetching content:", err);
      setError(err.message);

      // Fallback to default content if API fails
      setContent({
        hero: {
          title: "RISE",
          subtitle: "Empowering Recovery • Innovation • Science • Excellence",
          description: "Experience the future of stroke and SCI recovery.",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const updateContent = async (newContent) => {
    try {
      const token = localStorage.getItem("cms-token") || "demo-token";

      const response = await fetch(`${API_BASE}/content`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newContent),
      });

      if (!response.ok) {
        throw new Error("Failed to update content");
      }

      setContent(newContent);
      return true;
    } catch (err) {
      console.error("Error updating content:", err);
      return false;
    }
  };

  return {
    content,
    loading,
    error,
    updateContent,
    refetch: fetchContent,
  };
};
