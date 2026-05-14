"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/", label: "Dashboard", icon: "⬡" },
  { href: "/ordres", label: "Ordres", icon: "◈" },
  { href: "/produits", label: "Produits", icon: "◻" },
  { href: "/machines", label: "Machines", icon: "◎" },
  { href: "/employes", label: "Employés", icon: "◉" },
];

export default function Sidebar() {
  const path = usePathname();
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 flex flex-col"
      style={{ background: "#0d0d0d", borderRight: "1px solid #1f1f1f" }}>
      {/* Logo */}
      <div className="px-6 py-6 border-b" style={{ borderColor: "#1f1f1f" }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center text-lg"
            style={{ background: "#f97316", color: "white", borderRadius: "4px", fontWeight: 700 }}>
            M
          </div>
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase" style={{ color: "#f97316" }}>Manu</p>
            <p className="text-xs" style={{ color: "#404040" }}>Gestion Fabrication</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        <p className="px-3 mb-3 text-xs tracking-widest uppercase" style={{ color: "#333" }}>Navigation</p>
        {nav.map(({ href, label, icon }) => {
          const active = path === href;
          return (
            <Link key={href} href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded text-sm transition-all"
              style={{
                background: active ? "rgba(249,115,22,.1)" : "transparent",
                color: active ? "#f97316" : "#525252",
                borderLeft: active ? "2px solid #f97316" : "2px solid transparent",
                textDecoration: "none",
              }}>
              <span style={{ fontSize: 16 }}>{icon}</span>
              <span style={{ fontFamily: "inherit", letterSpacing: "0.02em" }}>{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t" style={{ borderColor: "#1f1f1f" }}>
        <p className="text-xs" style={{ color: "#2a2a2a" }}>v1.0.0 — Spring Boot 4</p>
      </div>
    </aside>
  );
}
