import { useEffect, useState } from "react";
import api from "@/services/api";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import Spinner from "@/components/Spinner";
import Pill from "@/components/Pill";

export default function PublicDatasetsPage() {
  const token = useSelector((state: RootState) => state.auth.token);
  const [datasets, setDatasets] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDatasets = async () => {
      try {
        const response = await api.get("/datasets/public");
        setDatasets(response.data.datasets);
      } catch {
        setError("Failed to fetch datasets.");
      } finally {
        setLoading(false);
      }
    };

    fetchDatasets();
  }, []);

  const getBadge = () => {
    return Math.random() > 0.5 ? (
      <Pill label="Trending" color="bg-red-500" />
    ) : (
      <Pill label="New" color="bg-green-500" />
    );
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Explore Public Datasets</h1>

      {loading && <Spinner />}
      {error && <p className="text-red-600">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {datasets.map((name) => {
          const [owner, dataset] = name.includes("/") ? name.split("/") : ["unknown", name];
          const isVerified = ["huggingface", "openai", "google", "stanfordnlp"].includes(owner);

          return (
            <a
              key={name}
              href={`/datasets/${encodeURIComponent(name)}`}
              className="block bg-white shadow hover:shadow-md hover:scale-[1.02] transition rounded-lg p-4 border border-gray-200"
            >
              <h2 className="text-lg font-semibold text-blue-700 break-words">
                {dataset}
              </h2>

              <div className="flex justify-between items-center text-sm text-gray-500 mt-1">
                <span>By {owner}</span>
                {isVerified && <span className="text-green-600 text-xs">✅ Verified</span>}
              </div>

              <div className="mt-3">{getBadge()}</div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
