import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

// Page admin interne, lecture seule.
// Accès réservé : l'email connecté doit correspondre à process.env.ADMIN_EMAIL.
// Si ADMIN_EMAIL n'est pas défini → personne n'a accès (défaut sûr).

type Affiliate = {
  id: string;
  name: string;
  slug: string;
  email: string | null;
  commission_rate: number;
  status: string;
};

type Conversion = {
  id: string;
  affiliate_ref: string | null;
  email: string | null;
  amount_total: number | null;
  commission_amount: number | null;
  commission_status: string;
  created_at: string;
};

function euros(cents: number | null): string {
  if (cents == null) return "—";
  return (cents / 100).toLocaleString("fr-FR", { style: "currency", currency: "EUR" });
}

export default async function AdminAffiliatesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  if (!user || !adminEmail || user.email?.toLowerCase() !== adminEmail) {
    redirect("/");
  }

  const admin = createAdminClient();
  const [{ data: affiliates }, { data: conversions }] = await Promise.all([
    admin
      .from("affiliates")
      .select("id, name, slug, email, commission_rate, status")
      .order("created_at", { ascending: false }),
    admin
      .from("affiliate_conversions")
      .select(
        "id, affiliate_ref, email, amount_total, commission_amount, commission_status, created_at",
      )
      .order("created_at", { ascending: false })
      .limit(200),
  ]);

  const convs = (conversions ?? []) as Conversion[];
  const totalUnpaid = convs
    .filter((c) => c.commission_status === "unpaid")
    .reduce((sum, c) => sum + (c.commission_amount ?? 0), 0);

  return (
    <div className="container" style={{ padding: "48px 0 90px" }}>
      <span className="section-eyebrow">Admin</span>
      <h1 style={{ margin: "10px 0 6px" }}>Affiliation</h1>
      <p style={{ color: "var(--muted)" }}>
        Lecture seule. Les commissions se règlent manuellement (passez le statut à{" "}
        <code>paid</code> dans Supabase).{" "}
        Commissions à payer : <strong>{euros(totalUnpaid)}</strong>.
      </p>

      <h2 style={{ marginTop: 32, fontSize: 20 }}>Affiliés ({affiliates?.length ?? 0})</h2>
      <div style={{ overflowX: "auto" }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Slug (ref)</th>
              <th>Email</th>
              <th>Taux</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            {(affiliates as Affiliate[] | null)?.map((a) => (
              <tr key={a.id}>
                <td>{a.name}</td>
                <td><code>{a.slug}</code></td>
                <td>{a.email ?? "—"}</td>
                <td>{a.commission_rate}%</td>
                <td>{a.status}</td>
              </tr>
            ))}
            {(!affiliates || affiliates.length === 0) && (
              <tr><td colSpan={5}>Aucun affilié. Crée-en un dans Supabase.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <h2 style={{ marginTop: 32, fontSize: 20 }}>Conversions ({convs.length})</h2>
      <div style={{ overflowX: "auto" }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Ref</th>
              <th>Client</th>
              <th>Montant</th>
              <th>Commission</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            {convs.map((c) => (
              <tr key={c.id}>
                <td>{new Date(c.created_at).toLocaleDateString("fr-FR")}</td>
                <td><code>{c.affiliate_ref ?? "—"}</code></td>
                <td>{c.email ?? "—"}</td>
                <td>{euros(c.amount_total)}</td>
                <td>{euros(c.commission_amount)}</td>
                <td>
                  <span className={c.commission_status === "paid" ? "badge-paid" : "badge-unpaid"}>
                    {c.commission_status}
                  </span>
                </td>
              </tr>
            ))}
            {convs.length === 0 && (
              <tr><td colSpan={6}>Aucune conversion affiliée pour l'instant.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <style>{`
        .admin-table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 14px; }
        .admin-table th, .admin-table td { border: 1px solid var(--line); padding: 8px 12px; text-align: left; }
        .admin-table th { background: var(--bg-2); font-weight: 700; }
        .admin-table code { font-size: 13px; }
        .badge-paid { color: var(--success); font-weight: 700; }
        .badge-unpaid { color: var(--warning); font-weight: 700; }
      `}</style>
    </div>
  );
}
