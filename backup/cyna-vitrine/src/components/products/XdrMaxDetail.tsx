// Composant spécifique : Cyna XDR Max
// Affiche le diagramme de corrélation cross-stack + incidents unifiés + sources de données

const DATA_SOURCES = [
    { label: "Terminaux", icon: "🖥️", count: "4 812", color: "bg-purple-950/50 border-purple-800 text-purple-300" },
    { label: "Réseau", icon: "🌐", count: "38 flux", color: "bg-violet-950/50 border-violet-800 text-violet-300" },
    { label: "Cloud AWS", icon: "☁️", count: "12 services", color: "bg-fuchsia-950/50 border-fuchsia-800 text-fuchsia-300" },
    { label: "Cloud Azure", icon: "☁️", count: "8 services", color: "bg-purple-950/50 border-purple-800 text-purple-300" },
    { label: "Emails", icon: "✉️", count: "2 180 / j", color: "bg-violet-950/50 border-violet-800 text-violet-300" },
    { label: "Applications", icon: "📦", count: "24 apps", color: "bg-pink-950/50 border-pink-800 text-pink-300" },
];

const INCIDENTS = [
    {
        id: "INC-4821",
        title: "Campagne phishing → exécution payload → mouvement latéral",
        sources: ["Email", "Endpoint", "Réseau"],
        severity: "critique",
        status: "En cours d'investigation",
        timeline: ["08:12 Email malveillant reçu", "08:14 Pièce jointe exécutée", "08:19 Connexion C2 détectée", "08:22 Mouvement latéral détecté"],
    },
    {
        id: "INC-4799",
        title: "Tentative d'escalade de privilèges sur Azure AD",
        sources: ["Cloud Azure", "Applications"],
        severity: "élevée",
        status: "Résolu",
        timeline: ["Hier 22:41 Token JWT anormal", "Hier 22:43 Tentative d'escalade", "Hier 22:44 Compte suspendu"],
    },
];

const SEVERITY_COLORS: Record<string, string> = {
    critique: "bg-red-950/50 text-red-400 border-red-800",
    élevée: "bg-orange-950/50 text-orange-400 border-orange-800",
    moyenne: "bg-yellow-950/50 text-yellow-400 border-yellow-800",
};

const STATUS_COLORS: Record<string, string> = {
    "En cours d'investigation": "text-orange-400 bg-orange-950/40",
    "Résolu": "text-green-400 bg-green-950/40",
};

export default function XdrMaxDetail() {
    return (
        <div className="space-y-16">

            {/* Correlation diagram */}
            <div>
                <h2 className="cyna-heading text-gray-100 mb-3">Corrélation cross-stack unifiée</h2>
                <p className="text-gray-400 mb-8">
                    XDR Max ingère et corrèle les événements de toutes vos couches de sécurité en un seul moteur d'analyse.
                </p>

                <div className="relative flex flex-col items-center gap-6">
                    {/* Sources */}
                    <div className="grid grid-cols-3 lg:grid-cols-6 gap-3 w-full">
                        {DATA_SOURCES.map((src) => (
                            <div
                                key={src.label}
                                className={`rounded-2xl border p-4 text-center ${src.color}`}
                            >
                                <div className="text-2xl mb-1">{src.icon}</div>
                                <div className="text-xs font-bold">{src.label}</div>
                                <div className="text-xs opacity-70 mt-0.5">{src.count}</div>
                            </div>
                        ))}
                    </div>

                    {/* Arrow */}
                    <div className="flex flex-col items-center gap-1 text-gray-600">
                        <div className="w-px h-6 bg-zinc-700" />
                        <div className="text-xs text-gray-400 font-medium px-3 py-1 bg-zinc-800 rounded-full border border-zinc-700">
                            Ingestion & Normalisation
                        </div>
                        <div className="w-px h-6 bg-zinc-700" />
                    </div>

                    {/* XDR Core */}
                    <div className="bg-gradient-to-br from-[#7c3aed] to-[#4c1d95] text-white rounded-3xl px-10 py-8 text-center shadow-2xl w-full max-w-md">
                        <div className="text-4xl mb-3">🔮</div>
                        <div className="text-xl font-bold mb-1">Moteur XDR Cyna</div>
                        <div className="text-purple-200 text-sm">Corrélation · IA · Chasse aux menaces</div>
                        <div className="mt-4 grid grid-cols-3 gap-3 text-xs">
                            <div className="bg-white/10 rounded-xl p-2">
                                <div className="font-bold text-lg">2.4M</div>
                                <div className="text-purple-200">Events/s</div>
                            </div>
                            <div className="bg-white/10 rounded-xl p-2">
                                <div className="font-bold text-lg">340</div>
                                <div className="text-purple-200">Règles actives</div>
                            </div>
                            <div className="bg-white/10 rounded-xl p-2">
                                <div className="font-bold text-lg">4ms</div>
                                <div className="text-purple-200">Latence</div>
                            </div>
                        </div>
                    </div>

                    {/* Arrow down */}
                    <div className="flex flex-col items-center gap-1">
                        <div className="w-px h-6 bg-zinc-700" />
                        <div className="text-xs text-gray-400 font-medium px-3 py-1 bg-zinc-800 rounded-full border border-zinc-700">
                            Incidents unifiés
                        </div>
                        <div className="w-px h-6 bg-zinc-700" />
                    </div>

                    {/* Outputs */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
                        {[
                            { label: "Incidents priorisés", icon: "🚨", desc: "Alertes contextualisées" },
                            { label: "Analyse des causes", icon: "🔍", desc: "Arbre de causalité complet" },
                            { label: "Réponse automatique", icon: "⚙️", desc: "Playbooks SOAR intégrés" },
                        ].map((out) => (
                            <div key={out.label} className="bg-zinc-900 border border-zinc-700 rounded-2xl p-5 text-center">
                                <div className="text-2xl mb-2">{out.icon}</div>
                                <div className="font-semibold text-gray-200 text-sm">{out.label}</div>
                                <div className="text-xs text-gray-500 mt-1">{out.desc}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Incident Examples */}
            <div>
                <h2 className="cyna-heading text-gray-100 mb-6">Incidents corrélés en exemple</h2>
                <div className="space-y-5">
                    {INCIDENTS.map((inc) => (
                        <div key={inc.id} className="bg-zinc-900 rounded-2xl border border-zinc-700 shadow-sm overflow-hidden">
                            <div className="flex items-start gap-4 p-6">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                                        <span className="text-xs font-mono text-gray-500">{inc.id}</span>
                                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${SEVERITY_COLORS[inc.severity]}`}>
                                            {inc.severity}
                                        </span>
                                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_COLORS[inc.status]}`}>
                                            {inc.status}
                                        </span>
                                    </div>
                                    <p className="text-gray-200 font-semibold text-sm mb-3">{inc.title}</p>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {inc.sources.map((s) => (
                                            <span key={s} className="text-xs bg-purple-950/50 text-purple-300 border border-purple-800 rounded-full px-2 py-0.5">
                                                {s}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="space-y-1">
                                        {inc.timeline.map((step, i) => (
                                            <div key={i} className="flex items-center gap-2 text-xs text-gray-500">
                                                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 flex-shrink-0" />
                                                {step}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
