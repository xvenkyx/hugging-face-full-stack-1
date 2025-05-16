import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import api from "@/services/api";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

import Pill from "@/components/Pill";
import Card from "@/components/Card";

interface DatasetInfo {
  id: string;
  lastModified: string;
  tags: string[];
  downloads: number;
  likes: number;
  private: boolean;
  cardData?: {
    summary?: string;
    [key: string]: any;
  };
}

export default function DatasetDetailsPage() {
  const router = useRouter();
  const token = useSelector((state: RootState) => state.auth.token);
  const [datasetInfo, setDatasetInfo] = useState<DatasetInfo | null>(null);
  const [error, setError] = useState("");
  const [followed, setFollowed] = useState(false);
  const [followMsg, setFollowMsg] = useState("");

  const datasetName = decodeURIComponent((router.query.name as string) || "");

  useEffect(() => {
    if (!datasetName) return;

    const fetchInfoAndCheckFollowed = async () => {
      try {
        // Fetch dataset metadata
        const infoResponse = await api.get(`/datasets/info/${datasetName}`);
        setDatasetInfo(infoResponse.data);

        // If user is logged in, check if this dataset is followed
        if (token) {
          const followedResponse = await api.get("/datasets/followed", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const followedDatasets: string[] =
            followedResponse.data.followed || [];
          if (followedDatasets.includes(datasetName)) {
            setFollowed(true);
            setFollowMsg("You are already following this dataset.");
          }
        }
      } catch (err) {
        setError("Failed to fetch dataset information.");
      }
    };

    fetchInfoAndCheckFollowed();
  }, [datasetName, token]);

  const handleFollow = async () => {
    try {
      await api.post(
        `/datasets/follow?dataset_name=${encodeURIComponent(datasetName)}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setFollowed(true);
      setFollowMsg("Dataset followed successfully!");
    } catch (err: any) {
      const detail = err.response?.data?.detail || "Failed to follow dataset.";
      setFollowMsg(detail);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">Dataset: {datasetName}</h1>

      {error && <p className="text-red-600">{error}</p>}
      {!error && !datasetInfo && <p>Loading dataset details...</p>}

      {datasetInfo && (
        <div className="space-y-2 mb-6">
          <Card title="Dataset Metadata">
            <p>
              <strong>ID:</strong> {datasetInfo.id}
            </p>
            <p>
              <strong>Last Modified:</strong> {datasetInfo.lastModified}
            </p>
            <div className="mb-2">
              <p className="font-semibold">Tags:</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {datasetInfo.tags?.map((tag) => (
                  <Pill key={tag} label={tag} color="bg-blue-500" />
                ))}
              </div>
            </div>

            <p>
              <strong>Downloads:</strong> {datasetInfo.downloads}
            </p>
            <p>
              <strong>Likes:</strong> {datasetInfo.likes}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <Pill
                label={datasetInfo.private ? "Private" : "Public"}
                color={datasetInfo.private ? "bg-yellow-500" : "bg-green-500"}
              />
            </p>
            <p>
              <strong>Summary:</strong>{" "}
              {datasetInfo.cardData?.summary || "No summary available."}
            </p>
          </Card>
          {datasetInfo?.cardData?.changelog && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-2">Changelog</h2>
              <ul className="list-disc list-inside text-sm space-y-1">
                {Object.entries(datasetInfo.cardData.changelog).map(
                  ([date, note]) => (
                    <li key={date}>
                      <span className="font-medium">{date}:</span>{" "}
                      {note as string}
                    </li>
                  )
                )}
              </ul>
            </div>
          )}
        </div>
      )}

      {token && (
        <div className="space-y-2">
          <button
            onClick={handleFollow}
            disabled={followed}
            className={`px-4 py-2 rounded ${
              followed
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            } text-white`}
          >
            {followed ? "Already Followed" : "Follow This Dataset"}
          </button>

          {followMsg && (
            <p className="text-sm text-green-700 mt-2">{followMsg}</p>
          )}
        </div>
      )}
    </div>
  );
}
