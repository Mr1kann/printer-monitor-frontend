"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

interface PrinterData {
  printer: {
    id: number;
    name: string;
    ip: string;
  };

  status: {
    status: string;

    ink: {
      BK?: {
        level: number;
      };

      C?: {
        level: number;
      };

      M?: {
        level: number;
      };

      Y?: {
        level: number;
      };
    };

    wasteInk?: {
      level: number;
    };

    paper: {
      size: string | null;
      type: string | null;
    };

    info: {
      firmware: string | null;
      macAddress: string | null;
    };
  };

  usage: {
    printing: {
      firstPrintingDate: string | null;
      age: {
        days: number;
        years: number;
        months: number;
        remainingDays: number;
        label: string;
      } | null;
      totalPages: number | null;
      bwPages: number | null;
      colorPages: number | null;
      twoSidedPages: number | null;
      oneSidedPages: number | null;
    };
  };
}

export default function PrinterDetail() {
  const params = useParams();

  const id = params.id;

  const [data, setData] = useState<PrinterData | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPrinterData = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/api/printers/${id}`,
        );

        if (!response.ok) {
          throw new Error("Gagal mengambil data printer");
        }

        const result = await response.json();

        setData(result);
        setError("");
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("Gagal mengambil data printer");
        }
      } finally {
        setLoading(false);
      }
    };

    // Fetch pertama kali
    fetchPrinterData();

    // Polling setiap 10 detik
    const interval = setInterval(() => {
      fetchPrinterData();
    }, 10000);

    // Bersihkan interval ketika halaman ditinggalkan
    return () => {
      clearInterval(interval);
    };
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 p-8">Loading printer...</main>
    );
  }

  if (error || !data) {
    return (
      <main className="min-h-screen bg-gray-50 p-8">
        <p className="text-red-600">{error || "Data tidak tersedia"}</p>
      </main>
    );
  }

  const { printer, status, usage } = data;

  const ink = status.ink;

  const printing = usage.printing;

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-6xl">
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-900">
          ← Back to printers
        </Link>

        <div className="mt-6">
          <h1 className="text-3xl font-bold text-gray-900">{printer.name}</h1>

          <p className="mt-1 text-gray-500">{printer.ip}</p>
        </div>

        {/* STATUS */}

        <section className="mt-8 rounded-xl border bg-white p-6">
          <h2 className="text-lg font-semibold">Printer Status</h2>

          <div className="mt-4 flex items-center gap-3">
            <div className="h-3 w-3 rounded-full bg-green-500" />

            <span>{status.status}</span>
          </div>
        </section>

        {/* USAGE */}

        <section className="mt-6">
          <h2 className="text-xl font-semibold">Printing Usage</h2>

          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <TextStatCard
              title="Printer Age"
              value={printing.age?.label || null}
            />

            <TextStatCard
              title="First Printing"
              value={printing.firstPrintingDate}
            />

            <StatCard title="Total Pages" value={printing.totalPages} />

            <StatCard title="B&W Pages" value={printing.bwPages} />

            <StatCard title="Color Pages" value={printing.colorPages} />

            <StatCard title="1-Sided" value={printing.oneSidedPages} />

            <StatCard title="2-Sided" value={printing.twoSidedPages} />
          </div>
        </section>

        {/* INK */}

        <section className="mt-8">
          <h2 className="text-xl font-semibold">Ink Level</h2>

          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <InkCard name="Black" level={ink.BK?.level} />

            <InkCard name="Cyan" level={ink.C?.level} />

            <InkCard name="Magenta" level={ink.M?.level} />

            <InkCard name="Yellow" level={ink.Y?.level} />
          </div>
        </section>

        {/* INFO */}

        <section className="mt-8 rounded-xl border bg-white p-6">
          <h2 className="text-lg font-semibold">Printer Information</h2>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <InfoRow label="Paper Size" value={status.paper.size} />

            <InfoRow label="Paper Type" value={status.paper.type} />

            <InfoRow label="Firmware" value={status.info.firmware} />

            <InfoRow label="MAC Address" value={status.info.macAddress} />
          </div>
        </section>
      </div>
    </main>
  );
}

function StatCard({ title, value }: { title: string; value: number | null }) {
  return (
    <div className="rounded-xl border bg-white p-5">
      <p className="text-sm text-gray-500">{title}</p>

      <p className="mt-2 text-2xl font-bold">{value ?? "-"}</p>
    </div>
  );
}

function TextStatCard({
  title,
  value,
}: {
  title: string;
  value: string | null;
}) {
  return (
    <div className="rounded-xl border bg-white p-5">
      <p className="text-sm text-gray-500">{title}</p>

      <p className="mt-2 text-xl font-bold">{value || "-"}</p>
    </div>
  );
}

function InkCard({ name, level }: { name: string; level?: number }) {
  return (
    <div className="rounded-xl border bg-white p-5">
      <div className="flex justify-between">
        <span className="font-medium">{name}</span>

        <span>{level ?? "-"}%</span>
      </div>

      <div className="mt-4 h-3 overflow-hidden rounded-full bg-gray-200">
        <div
          className="h-full rounded-full bg-gray-700"
          style={{
            width: `${level ?? 0}%`,
          }}
        />
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string | null }) {
  return (
    <div>
      <p className="text-sm text-gray-500">{label}</p>

      <p className="mt-1 font-medium">{value || "-"}</p>
    </div>
  );
}
