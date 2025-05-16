import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import api from "@/services/api";
import { useRouter } from "next/router";

export default function FollowedDatasetsPage() {
  const token = useSelector((state: RootState) => state.auth.token);
  const [datasets, setDatasets] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      setError("Please login to view followed datasets.");
      setLoading(false);
      return;
    }

    const fetchFollowed = async () => {
      try {
        const response = await api.get("/datasets/followed", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDatasets(response.data.followed);
      } catch (err: any) {
        setError("Failed to fetch followed datasets.");
      } finally {
        setLoading(false);
      }
    };

    fetchFollowed();
  }, [token]);

  if (loading) return <p className="p-6">Loading followed datasets...</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Followed Datasets</h1>

      {error && <p className="text-red-600">{error}</p>}

      <ul className="list-disc list-inside space-y-1">
        {datasets.map((name) => (
          <li key={name}>
            <a
              href={`/datasets/${encodeURIComponent(name)}`}
              className="text-blue-600 hover:underline"
            >
              {name}
            </a>
          </li>
        ))}
      </ul>

      {datasets.length === 0 && !error && (
        <p className="text-gray-600">You haven’t followed any datasets yet.</p>
      )}
    </div>
  );
}
