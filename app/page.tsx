"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Printer {
  id: number;
  name: string;
  ip: string;
}

export default function Home() {
  const [printers, setPrinters] = useState<Printer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:3001/api/printers")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Gagal mengambil daftar printer");
        }

        return response.json();
      })
      .then((data) => {
        setPrinters(data);
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold text-gray-900">Printer Monitor</h1>

        <p className="mt-2 text-gray-500">
          Monitor printer Epson melalui jaringan lokal.
        </p>

        {loading && <div className="mt-8">Loading printer...</div>}

        {error && (
          <div className="mt-8 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {printers.map((printer) => (
              <Link
                key={printer.id}
                href={`/printer/${printer.id}`}
                className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      {printer.name}
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">{printer.ip}</p>
                  </div>

                  <div className="h-3 w-3 rounded-full bg-green-500" />
                </div>

                <div className="mt-6 text-sm text-gray-500">
                  View printer details →
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
