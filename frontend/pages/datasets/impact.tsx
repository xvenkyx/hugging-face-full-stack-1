import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import api from "@/services/api";

export default function ImpactAssessmentPage() {
  const token = useSelector((state: RootState) => state.auth.token);
  const [combos, setCombos] = useState<string[]>([]);
  const [selected, setSelected] = useState("");
  const [method, setMethod] = useState("naive");
  const [impactLevel, setImpactLevel] = useState("");
  const [extraMetric, setExtraMetric] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;
    const fetchCombos = async () => {
      try {
        const res = await api.get("/datasets/combos", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCombos(res.data.combos || []);
      } catch {
        setError("Failed to load combinations.");
      }
    };
    fetchCombos();
  }, [token]);

  const getImpactColor = (level: string) => {
    switch (level) {
      case "low":
        return "bg-green-500";
      case "medium":
        return "bg-yellow-400";
      case "high":
        return "bg-red-500";
      default:
        return "bg-gray-300";
    }
  };

  const handleAssess = async () => {
    if (!selected) {
      setError("Please select a combination.");
      return;
    }

    setLoading(true);
    setImpactLevel("");
    setExtraMetric("");
    setError("");

    try {
      const endpoint =
        method === "naive"
          ? `/datasets/impact/naive?datasets=${selected}`
          : `/datasets/impact/advanced?combo_name=${selected}`;

      const res = await api.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setImpactLevel(res.data.impact_level || "unknown");

      if (method === "naive" && res.data.estimated_total_downloads) {
        setExtraMetric(`Downloads: ${res.data.estimated_total_downloads}`);
      } else if (method === "advanced" && res.data.num_clusters) {
        setExtraMetric(`Distinct clusters: ${res.data.num_clusters}`);
      }

    } catch {
      setError("Failed to assess impact.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Impact Assessment</h1>

      <div className="mb-4 space-y-2">
        <select
          className="w-full border px-3 py-2 rounded"
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
        >
          <option value="">Select Combination</option>
          {combos.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>

        <select
          className="w-full border px-3 py-2 rounded"
          value={method}
          onChange={(e) => setMethod(e.target.value)}
        >
          <option value="naive">Naive</option>
          <option value="advanced">Advanced</option>
        </select>

        <button
          onClick={handleAssess}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Assess Impact
        </button>

        {loading && <p className="text-sm text-gray-600">⏳ Assessing impact...</p>}
        {error && <p className="text-red-600">{error}</p>}
      </div>

      {impactLevel && (
        <div className="mt-6 p-4 bg-white border rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Impact Result</h2>
          <div className="flex items-center space-x-4">
            <div
              className={`w-32 text-center text-white py-1 rounded ${getImpactColor(
                impactLevel
              )}`}
            >
              {impactLevel.toUpperCase()}
            </div>
            {extraMetric && <span className="text-gray-700">{extraMetric}</span>}
          </div>
        </div>
      )}
    </div>
  );
}
