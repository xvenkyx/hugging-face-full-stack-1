import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { clearToken } from "@/store/authSlice";
import { useRouter } from "next/router";

export default function Navbar() {
  const token = useSelector((state: RootState) => state.auth.token);
  const dispatch = useDispatch();
  const router = useRouter();

  const isActive = (path: string) => router.pathname === path;

  const handleLogout = () => {
    dispatch(clearToken());
    router.push("/login");
  };

  const linkClass = (path: string) =>
    `${isActive(path) ? "font-semibold" : "hover:cursor"}`;

  return (
    <nav className="bg-gray-800 text-white px-6 py-3 flex justify-between items-center">
      <div>
        <Link href="/datasets" className="text-lg font-semibold">
          🧠 Dataset Explorer
        </Link>
      </div>

      <div className="space-x-4">
        <Link href="/datasets" className={linkClass("/datasets")}>Public Datasets</Link>

        {token ? (
          <>
            <Link href="/datasets/followed" className="">Followed</Link>
            <Link href="/datasets/combine" className="">Combine</Link>
            <Link href="/datasets/impact" className="">Impact</Link>
            <button onClick={handleLogout} className="">Logout</button>
          </>
        ) : (
          <>
            <Link href="/login" className="">Login</Link>
            <Link href="/register" className="">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
