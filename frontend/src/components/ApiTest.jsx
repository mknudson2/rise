import React from "react";
import { useContent } from "../hooks/useContent";

const ApiTest = () => {
  const { content, loading, error } = useContent();

  if (loading)
    return <div className="p-4 text-white">Loading content from API...</div>;
  if (error) return <div className="p-4 text-red-400">Error: {error}</div>;

  return (
    <div className="p-4 bg-gray-800 text-white rounded-lg m-4">
      <h3 className="text-lg font-bold mb-2">🔗 API Connection Test</h3>
      <p className="text-green-400 mb-2">
        ✅ Successfully connected to backend!
      </p>
      <div className="text-sm">
        <p>
          <strong>Title:</strong> {content?.hero?.title}
        </p>
        <p>
          <strong>Subtitle:</strong> {content?.hero?.subtitle}
        </p>
        <p>
          <strong>Message:</strong> {content?.message}
        </p>
      </div>
    </div>
  );
};

export default ApiTest;
