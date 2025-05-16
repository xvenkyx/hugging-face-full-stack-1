import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import api from "@/services/api";
import { useRouter } from "next/router";

export default function CombineDatasetsPage() {
  const token = useSelector((state: RootState) => state.auth.token);
  const [followedDatasets, setFollowedDatasets] = useState<string[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [comboName, setComboName] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      setError("You must be logged in to combine datasets.");
      return;
    }

    const fetchFollowed = async () => {
      try {
        const res = await api.get("/datasets/followed", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFollowedDatasets(res.data.followed || []);
      } catch {
        setError("Failed to load followed datasets.");
      }
    };

    fetchFollowed();
  }, [token]);

  const handleCheckbox = (name: string) => {
    setSelected((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!comboName || selected.length < 2) {
      setError("Please enter a combo name and select at least 2 datasets.");
      return;
    }

    try {
      await api.post(
        "/datasets/combine",
        { name: comboName, datasets: selected },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(`Combo "${comboName}" created successfully!`);
      setSelected([]);
      setComboName("");
    } catch (err: any) {
      setError(
        err.response?.data?.detail || "Failed to create combination. Try again."
      );
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Combine Datasets</h1>

      {error && <p className="text-red-600 mb-2">{error}</p>}
      {message && <p className="text-green-600 mb-2">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block text-sm font-medium mb-1">Combo Name</label>
        <input
          type="text"
          className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter combination name"
          value={comboName}
          onChange={(e) => setComboName(e.target.value)}
        />

        <div className="space-y-2">
          {followedDatasets.map((name) => (
            <label key={name} className="block">
              <input
                type="checkbox"
                value={name}
                checked={selected.includes(name)}
                onChange={() => handleCheckbox(name)}
                className="mr-2"
              />
              {name}
            </label>
          ))}
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create Combination
        </button>
      </form>
    </div>
  );
}
