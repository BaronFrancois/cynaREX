// Composant spécifique : Cloud Shield
// Affiche la protection multi-cloud (AWS, Azure, GCP), CSPM, sécurité conteneurs, gestion des identités

const PROVIDERS = [
    {
        name: "Amazon Web Services",
        short: "AWS",
        logo: "☁️",
        score: 94,
        resources: 312,
        issues: 7,
        color: "from-orange-950/30 to-amber-950/30",
        border: "border-orange-800/50",
        bar: "from-orange-400 to-amber-400",
        text: "text-orange-400",
    },
    {
        name: "Microsoft Azure",
        short: "Azure",
        logo: "☁️",
        score: 98,
        resources: 178,
        issues: 2,
        color: "from-violet-950/30 to-purple-950/30",
        border: "border-violet-800/50",
        bar: "from-[#7c3aed] to-[#d946ef]",
        text: "text-cyna-500",
    },
    {
        name: "Google Cloud Platform",
        short: "GCP",
        logo: "☁️",
        score: 91,
        resources: 94,
        issues: 11,
        color: "from-green-950/30 to-emerald-950/30",
        border: "border-green-800/50",
        bar: "from-green-500 to-emerald-400",
        text: "text-green-400",
    },
];

const CSPM_CHECKS = [
    { label: "Chiffrement au repos", status: "pass", detail: "Tous les volumes chiffrés (AES-256)" },
    { label: "Buckets S3 publics", status: "warn", detail: "3 buckets nécessitent review" },
    { label: "MFA administrateurs", status: "pass", detail: "100% des comptes admin" },
    { label: "Rotation des secrets", status: "pass", detail: "Rotation automatique activée" },
    { label: "Logging CloudTrail", status: "pass", detail: "Activé dans toutes les régions" },
    { label: "Accès réseau minimal", status: "warn", detail: "2 security groups à resserrer" },
];

const STATUS_STYLES: Record<string, { icon: string; style: string }> = {
    pass: { icon: "✓", style: "text-green-400 bg-green-950/40 border-green-800" },
    warn: { icon: "⚠", style: "text-yellow-400 bg-yellow-950/40 border-yellow-800" },
    fail: { icon: "✗", style: "text-red-400 bg-red-950/40 border-red-800" },
};

const CONTAINER_STATS = [
    { label: "Clusters surveillés", value: "8", icon: "🐳" },
    { label: "Images scannées", value: "342", icon: "📦" },
    { label: "CVE critiques bloquées", value: "0", icon: "🛡️" },
    { label: "Runtime anomalies / 7j", value: "14", icon: "🔍" },
];

export default function CloudShieldDetail() {
    return (
        <div className="space-y-16">

            {/* Multi-cloud providers */}
            <div>
                <h2 className="cyna-heading text-gray-100 mb-3">Protection multi-cloud unifiée</h2>
                <p className="text-gray-500 mb-8">
                    Score de conformité et visibilité en temps réel sur l'ensemble de vos clouds.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {PROVIDERS.map((p) => (
                        <div key={p.short} className={`rounded-3xl border ${p.border} bg-gradient-to-br ${p.color} p-7`}>
                            <div className="flex items-center gap-3 mb-5">
                                <span className="text-3xl">{p.logo}</span>
                                <div>
                                    <div className={`font-bold ${p.text}`}>{p.short}</div>
                                    <div className="text-xs text-gray-400">{p.name}</div>
                                </div>
                            </div>

                            {/* Score */}
                            <div className="mb-4">
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-gray-300 font-medium">Score conformité</span>
                                    <span className={`font-bold ${p.text}`}>{p.score}%</span>
                                </div>
                                <div className="h-2.5 bg-black/30 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full bg-gradient-to-r ${p.bar} rounded-full`}
                                        style={{ width: `${p.score}%` }}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div className="bg-black/20 rounded-xl p-3 text-center">
                                    <div className="font-bold text-gray-100">{p.resources}</div>
                                    <div className="text-xs text-gray-400">Ressources</div>
                                </div>
                                <div className={`rounded-xl p-3 text-center ${p.issues > 5 ? "bg-orange-950/40" : "bg-green-950/40"}`}>
                                    <div className={`font-bold ${p.issues > 5 ? "text-orange-400" : "text-green-400"}`}>{p.issues}</div>
                                    <div className="text-xs text-gray-500">Anomalies</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* CSPM Checks */}
            <div>
                <h2 className="cyna-heading text-gray-100 mb-3">CSPM — Contrôles de posture</h2>
                <p className="text-gray-500 mb-6">Vérifications continues des bonnes pratiques de sécurité cloud.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {CSPM_CHECKS.map((check) => {
                        const s = STATUS_STYLES[check.status];
                        return (
                            <div key={check.label} className="bg-zinc-900 rounded-2xl border border-zinc-700 shadow-sm p-5 flex items-start gap-4">
                                <span className={`w-7 h-7 rounded-full border flex items-center justify-center text-xs font-bold flex-shrink-0 ${s.style}`}>
                                    {s.icon}
                                </span>
                                <div>
                                    <div className="font-semibold text-gray-100 text-sm">{check.label}</div>
                                    <div className="text-xs text-gray-400 mt-0.5">{check.detail}</div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Container security */}
            <div className="bg-gradient-to-br from-violet-950 to-[#1e0b3a] rounded-3xl p-8 lg:p-12 text-white">
                <h2 className="cyna-heading text-gray-100 mb-2">Sécurité conteneurs & Kubernetes</h2>
                <p className="text-violet-300 mb-8 text-sm">
                    Scan des images, protection runtime et network policies pour vos clusters.
                </p>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                    {CONTAINER_STATS.map((s) => (
                        <div key={s.label} className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center">
                            <div className="text-3xl mb-2">{s.icon}</div>
                            <div className="text-2xl font-bold">{s.value}</div>
                            <div className="text-xs text-violet-300 mt-1">{s.label}</div>
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {[
                        { label: "Scan d'images CI/CD", desc: "Intégration native GitHub Actions, GitLab CI, Jenkins" },
                        { label: "Protection runtime", desc: "Détection d'anomalies comportementales dans les pods" },
                        { label: "Network Policies", desc: "Isolation et segmentation automatique des workloads" },
                    ].map((item) => (
                        <div key={item.label} className="bg-white/5 border border-white/10 rounded-2xl p-5">
                            <div className="font-semibold text-white mb-1 text-sm">{item.label}</div>
                            <div className="text-xs text-violet-300">{item.desc}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Identity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-zinc-900 rounded-3xl border border-zinc-700 shadow-sm p-8">
                    <h3 className="text-xl font-bold text-gray-100 mb-5">Gestion des identités cloud</h3>
                    <div className="space-y-4">
                        {[
                            { label: "Comptes à privilèges excessifs", value: "4", alert: true },
                            { label: "Rôles non utilisés (>90j)", value: "12", alert: true },
                            { label: "Service Accounts actifs", value: "87", alert: false },
                            { label: "Politiques IAM auditées", value: "100%", alert: false },
                        ].map((row) => (
                            <div key={row.label} className="flex items-center justify-between py-3 border-b border-zinc-800 last:border-0">
                                <span className="text-sm text-gray-400">{row.label}</span>
                                <span className={`text-sm font-bold px-3 py-0.5 rounded-full ${row.alert ? "text-orange-400 bg-orange-950/40" : "text-green-400 bg-green-950/40"}`}>
                                    {row.value}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="bg-gradient-to-br from-violet-950/30 to-purple-950/30 rounded-3xl border border-violet-900/50 p-8">
                    <h3 className="text-xl font-bold text-gray-100 mb-5">Intégrations supportées</h3>
                    <div className="grid grid-cols-2 gap-3">
                        {["AWS IAM", "Azure AD", "GCP IAM", "Okta", "HashiCorp Vault", "Terraform", "Kubernetes RBAC", "GitHub Actions"].map((tool) => (
                            <div key={tool} className="bg-zinc-900 rounded-xl border border-violet-900/50 px-4 py-2.5 text-sm font-medium text-gray-300 text-center">
                                {tool}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
