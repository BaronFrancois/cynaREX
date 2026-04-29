// Composant spécifique : Cyna EDR Pro
// Affiche une timeline de menaces détectées + métriques IA + couverture endpoints

const THREATS = [
    { time: "14:32", type: "Ransomware", host: "DESKTOP-07F", severity: "critical", action: "Bloqué" },
    { time: "13:51", type: "Injection mémoire", host: "SRV-PROD-02", severity: "high", action: "Mis en quarantaine" },
    { time: "12:18", type: "Mouvement latéral", host: "LAPTOP-ALICE", severity: "high", action: "Bloqué" },
    { time: "10:04", type: "Script PowerShell", host: "DESKTOP-BOB", severity: "medium", action: "Analysé" },
    { time: "09:22", type: "Exfiltration DNS", host: "SRV-BACKUP", severity: "critical", action: "Bloqué" },
    { time: "08:47", type: "Credential Dumping", host: "LAPTOP-MARC", severity: "high", action: "Mis en quarantaine" },
];

const SEVERITY_STYLES: Record<string, string> = {
    critical: "bg-red-950/50 text-red-400 border-red-800",
    high: "bg-orange-950/50 text-orange-400 border-orange-800",
    medium: "bg-yellow-950/50 text-yellow-400 border-yellow-800",
    low: "bg-green-950/50 text-green-400 border-green-800",
};

const STATS = [
    { label: "Terminaux protégés", value: "4 812", icon: "🖥️" },
    { label: "Menaces bloquées / 30j", value: "1 237", icon: "🛡️" },
    { label: "Taux de détection IA", value: "99.4%", icon: "🤖" },
    { label: "Temps de réponse moyen", value: "< 2 ms", icon: "⚡" },
];

export default function EdrProDetail() {
    return (
        <div className="space-y-16">

            {/* Stats */}
            <div>
                <h2 className="cyna-heading text-gray-100 mb-8">Performances en temps réel</h2>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {STATS.map((s) => (
                        <div key={s.label} className="bg-zinc-900 rounded-2xl border border-zinc-700 shadow-sm p-6">
                            <div className="text-3xl mb-3">{s.icon}</div>
                            <div className="text-2xl font-bold text-gray-100 mb-1">{s.value}</div>
                            <div className="text-sm text-gray-400">{s.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Threat Timeline */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="cyna-heading text-gray-100">Timeline des menaces (aujourd'hui)</h2>
                    <span className="flex items-center gap-2 text-sm text-green-600 font-medium bg-green-50 border border-green-200 px-3 py-1 rounded-full">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        Live
                    </span>
                </div>

                <div className="bg-gray-950 rounded-3xl overflow-hidden shadow-2xl">
                    {/* Terminal header */}
                    <div className="flex items-center gap-2 px-5 py-4 bg-gray-900 border-b border-gray-800">
                        <span className="w-3 h-3 rounded-full bg-red-500" />
                        <span className="w-3 h-3 rounded-full bg-yellow-400" />
                        <span className="w-3 h-3 rounded-full bg-green-500" />
                        <span className="ml-4 text-xs text-gray-400 font-mono">cyna-edr-pro · threat-monitor</span>
                    </div>

                    <div className="p-6 space-y-3 font-mono text-sm">
                        {THREATS.map((t, i) => (
                            <div
                                key={i}
                                className="flex items-center gap-4 bg-gray-900/60 rounded-xl px-4 py-3 border border-gray-800 hover:border-gray-700 transition-colors"
                            >
                                <span className="text-gray-500 text-xs w-10 flex-shrink-0">{t.time}</span>
                                <span className={`text-xs px-2 py-0.5 rounded-full border font-semibold flex-shrink-0 ${SEVERITY_STYLES[t.severity]}`}>
                                    {t.severity.toUpperCase()}
                                </span>
                                <span className="text-white flex-1 truncate">{t.type}</span>
                                <span className="text-gray-400 text-xs flex-shrink-0">{t.host}</span>
                                <span className="text-cyna-500 text-xs font-semibold flex-shrink-0">{t.action}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* AI Engine */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-yellow-950/20 to-orange-950/20 rounded-3xl p-8 border border-yellow-900/50">
                    <h3 className="text-xl font-bold text-gray-100 mb-2">Moteur IA comportemental</h3>
                    <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                        Notre modèle analyse en continu les comportements des processus, fichiers et connexions réseau
                        pour détecter toute anomalie, même sans signature connue.
                    </p>
                    <div className="space-y-4">
                        {[
                            { label: "Analyse des processus", pct: 100 },
                            { label: "Détection sans signature", pct: 94 },
                            { label: "Rollback ransomware", pct: 100 },
                            { label: "Réponse automatisée", pct: 87 },
                        ].map((item) => (
                            <div key={item.label}>
                                <div className="flex justify-between text-xs text-gray-300 mb-1 font-medium">
                                    <span>{item.label}</span>
                                    <span>{item.pct}%</span>
                                </div>
                                <div className="h-2 bg-yellow-950/40 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full"
                                        style={{ width: `${item.pct}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 text-white">
                    <h3 className="text-xl font-bold mb-2">Rollback ransomware</h3>
                    <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                        En cas d'attaque ransomware, l’EDR isole instantanément l'endpoint et restaure
                        les fichiers chiffrés grâce à nos snapshots continus.
                    </p>
                    <div className="space-y-3">
                        {[
                            { step: "01", label: "Détection du chiffrement anormal", status: "done" },
                            { step: "02", label: "Isolation réseau immédiate", status: "done" },
                            { step: "03", label: "Interruption du processus malveillant", status: "done" },
                            { step: "04", label: "Restauration depuis snapshot propre", status: "done" },
                        ].map((item) => (
                            <div key={item.step} className="flex items-center gap-3">
                                <span className="text-xs font-mono text-gray-500">{item.step}</span>
                                <span className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center text-white text-xs flex-shrink-0">✓</span>
                                <span className="text-sm text-gray-200">{item.label}</span>
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 bg-green-500/10 border border-green-500/30 rounded-xl px-4 py-3 text-green-400 text-sm font-medium">
                        ✓ Temps de récupération moyen : &lt; 90 secondes
                    </div>
                </div>
            </div>
        </div>
    );
}
