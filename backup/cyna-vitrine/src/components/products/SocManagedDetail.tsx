// Composant spécifique : SOC Managé
// Affiche le tableau de bord 24/7 : équipe d'analystes, temps de réponse, alertes en cours

const ANALYSTS = [
    { name: "Karim B.", role: "Analyste L3", region: "Paris", status: "online", avatar: "KB" },
    { name: "Sofia M.", role: "Threat Hunter", region: "Lyon", status: "online", avatar: "SM" },
    { name: "Julien R.", role: "Analyste L2", region: "Bordeaux", status: "online", avatar: "JR" },
    { name: "Amira T.", role: "Ingénieure SOC", region: "Montpellier", status: "away", avatar: "AT" },
    { name: "Luca V.", role: "Analyste L1", region: "Nice", status: "online", avatar: "LV" },
    { name: "Chloé D.", role: "Réponse Incidents", region: "Nantes", status: "online", avatar: "CD" },
];

const ALERTS = [
    { id: "ALR-901", desc: "Connexion anormale depuis IP étrangère", priority: "P1", time: "il y a 3 min", analyst: "Karim B." },
    { id: "ALR-900", desc: "Tentative brute-force SSH – SRV-DB-01", priority: "P2", time: "il y a 11 min", analyst: "Sofia M." },
    { id: "ALR-898", desc: "Volume d'export inhabituel – bucket S3", priority: "P2", time: "il y a 28 min", analyst: "Julien R." },
    { id: "ALR-895", desc: "Signature malware connue détectée", priority: "P1", time: "il y a 45 min", analyst: "Chloé D." },
];

const PRIORITY_STYLES: Record<string, string> = {
    P1: "bg-red-950/50 text-red-400 border-red-800",
    P2: "bg-orange-950/50 text-orange-400 border-orange-800",
    P3: "bg-yellow-950/50 text-yellow-400 border-yellow-800",
};

const SLA = [
    { label: "Temps de détection", value: "< 5 min", target: "Objectif SLA" },
    { label: "Temps de qualification", value: "< 15 min", target: "Objectif SLA" },
    { label: "Temps de réponse P1", value: "< 30 min", target: "Objectif SLA" },
    { label: "Disponibilité équipe", value: "99.9%", target: "Garanti contractuellement" },
];

export default function SocManagedDetail() {
    return (
        <div className="space-y-16">

            {/* Live status */}
            <div className="bg-gray-950 rounded-3xl overflow-hidden shadow-2xl">
                <div className="flex items-center justify-between px-6 py-4 bg-gray-900 border-b border-gray-800">
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-red-500" />
                        <span className="w-3 h-3 rounded-full bg-yellow-400" />
                        <span className="w-3 h-3 rounded-full bg-green-500" />
                        <span className="ml-4 text-xs text-gray-400 font-mono">cyna-soc · console-opérationnelle</span>
                    </div>
                    <span className="flex items-center gap-2 text-xs text-green-400 font-mono">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        CENTRE OPÉRATIONNEL ACTIF
                    </span>
                </div>

                <div className="p-6 grid grid-cols-2 lg:grid-cols-4 gap-4 border-b border-gray-800">
                    {[
                        { label: "Alertes ouvertes", value: "12", color: "text-orange-400" },
                        { label: "Analystes en ligne", value: "5 / 6", color: "text-green-400" },
                        { label: "Incidents P1 actifs", value: "2", color: "text-red-400" },
                        { label: "Événements / heure", value: "142K", color: "text-cyna-500" },
                    ].map((stat) => (
                        <div key={stat.label} className="text-center">
                            <div className={`text-3xl font-bold font-mono ${stat.color}`}>{stat.value}</div>
                            <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* Alerts */}
                <div className="p-6 space-y-3">
                    {ALERTS.map((a) => (
                        <div key={a.id} className="flex items-center gap-4 bg-gray-900/60 rounded-xl px-4 py-3 border border-gray-800">
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${PRIORITY_STYLES[a.priority]}`}>
                                {a.priority}
                            </span>
                            <span className="text-white text-sm flex-1 truncate font-mono">{a.desc}</span>
                            <span className="text-gray-500 text-xs flex-shrink-0">{a.time}</span>
                            <span className="text-cyna-500 text-xs flex-shrink-0">{a.analyst}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Team */}
            <div>
                <h2 className="cyna-heading text-gray-100 mb-3">Votre équipe d'analystes dédiée</h2>
                <p className="text-gray-400 mb-8">Des experts certifiés vous couvrent 24h/24, 365 jours par an — sans exception.</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                    {ANALYSTS.map((analyst) => (
                        <div key={analyst.name} className="bg-zinc-900 rounded-2xl border border-zinc-700 shadow-sm p-5 text-center hover:shadow-md transition-shadow">
                            <div className="relative inline-block mb-3">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyna-600 to-violet-700 flex items-center justify-center text-white font-bold text-sm mx-auto">
                                    {analyst.avatar}
                                </div>
                                <span className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-zinc-900 ${analyst.status === "online" ? "bg-green-500" : "bg-yellow-400"}`} />
                            </div>
                            <div className="text-sm font-semibold text-gray-200">{analyst.name}</div>
                            <div className="text-xs text-gray-400 mt-0.5">{analyst.role}</div>
                            <div className="text-xs text-gray-500 mt-0.5">{analyst.region}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* SLA */}
            <div>
                <h2 className="cyna-heading text-gray-100 mb-6">Engagements de niveau de service (SLA)</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {SLA.map((s) => (
                        <div key={s.label} className="bg-gradient-to-br from-violet-950/30 to-purple-950/30 rounded-2xl border border-violet-900/50 p-6">
                            <div className="text-3xl font-bold text-cyna-500 mb-2">{s.value}</div>
                            <div className="text-sm font-semibold text-gray-200 mb-1">{s.label}</div>
                            <div className="text-xs text-cyna-600">{s.target}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Reporting */}
            <div className="bg-gradient-to-br from-gray-900 to-violet-950 rounded-3xl p-8 lg:p-12 text-white">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                    <div>
                        <h3 className="cyna-heading text-gray-100 mb-3">Rapports mensuels inclus</h3>
                        <p className="text-gray-400 mb-6 leading-relaxed">
                            Chaque mois, recevez un rapport détaillé : résumé des incidents, tendances des menaces,
                            recommandations et métriques de performance de votre SOC.
                        </p>
                        <ul className="space-y-2">
                            {["Synthèse exécutive PDF", "Détail de chaque incident", "Cartographie des menaces", "Recommandations prioritaires"].map((item) => (
                                <li key={item} className="flex items-center gap-2 text-sm text-gray-300">
                                    <span className="text-cyna-500">→</span> {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { label: "Incidents traités / mois", value: "47", icon: "🚨" },
                            { label: "Taux de faux positifs", value: "0.3%", icon: "🎯" },
                            { label: "Satisfaction clients", value: "4.9/5", icon: "⭐" },
                            { label: "Uptime SOC", value: "100%", icon: "🟢" },
                        ].map((m) => (
                            <div key={m.label} className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center">
                                <div className="text-2xl mb-2">{m.icon}</div>
                                <div className="text-2xl font-bold">{m.value}</div>
                                <div className="text-xs text-gray-400 mt-1">{m.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
