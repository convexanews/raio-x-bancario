"""
Ratings atualizados das agências internacionais - jun/2026
Fontes: RI dos bancos, Moody's, Fitch, S&P (via buscas web)
"""
import sys, json
sys.stdout.reconfigure(encoding='utf-8')

# Rating + Perspectiva + Fonte + Data
# Moody's elevou 20+ bancos brasileiros de Ba2 para Ba1 em 2025
# Fitch atualizou vários em 2026
RATINGS = {
    # ── GRANDES BANCOS ────────────────────────────────────────────────────────
    "Itaú Unibanco": {
        "rating_moodys": "Ba1",
        "rating_fitch":  "BB+",
        "rating_sp":     "",
        "rating_perspectiva": "Estável",
        "rating_fonte": "Moody's/Fitch (2025-2026)",
    },
    "Banco do Brasil": {
        "rating_moodys": "Ba1",
        "rating_fitch":  "BB",
        "rating_sp":     "BB",
        "rating_perspectiva": "Estável",
        "rating_fonte": "Moody's/Fitch/S&P (mai/2026 — RI BB)",
    },
    "Caixa Econômica Federal": {
        "rating_moodys": "Ba1",
        "rating_fitch":  "",
        "rating_sp":     "",
        "rating_perspectiva": "Estável",
        "rating_fonte": "Moody's (2025)",
    },
    "Bradesco": {
        "rating_moodys": "Baa3",   # Moody's counterparty; depósitos Ba1
        "rating_fitch":  "BB+",
        "rating_sp":     "BB",
        "rating_perspectiva": "Estável",
        "rating_fonte": "Moody's/Fitch/S&P (RI Bradesco mar/2026)",
    },
    "Santander Brasil": {
        "rating_moodys": "Baa3",   # upgrade de Ba1 para Baa3 (out/2024)
        "rating_fitch":  "BB+",
        "rating_sp":     "BB",
        "rating_perspectiva": "Positiva",
        "rating_fonte": "Moody's (Baa3 out/2024) / S&P 20-F 2025",
    },
    "BTG Pactual": {
        "rating_moodys": "Ba1",
        "rating_fitch":  "BB+",    # upgrade de BB para BB+ (Fitch dez/2025)
        "rating_sp":     "",
        "rating_perspectiva": "Positiva",
        "rating_fonte": "Moody's Ba1 / Fitch BB+ upgrade (dez/2025)",
    },
    "BNDES": {
        "rating_moodys": "Ba1",
        "rating_fitch":  "",
        "rating_sp":     "",
        "rating_perspectiva": "Estável",
        "rating_fonte": "Moody's (2025)",
    },
    # ── BANCOS MÉDIOS ─────────────────────────────────────────────────────────
    "Safra": {
        "rating_moodys": "Ba1",
        "rating_fitch":  "",
        "rating_sp":     "",
        "rating_perspectiva": "Estável",
        "rating_fonte": "Moody's (2025)",
    },
    "Sicredi": {
        "rating_moodys": "Ba1",
        "rating_fitch":  "",
        "rating_sp":     "",
        "rating_perspectiva": "Estável",
        "rating_fonte": "Moody's (2025)",
    },
    "ABC Brasil": {
        "rating_moodys": "Ba1",
        "rating_fitch":  "",
        "rating_sp":     "",
        "rating_perspectiva": "Estável",
        "rating_fonte": "Moody's (2025)",
    },
    "Daycoval": {
        "rating_moodys": "Ba1",
        "rating_fitch":  "",
        "rating_sp":     "",
        "rating_perspectiva": "Estável",
        "rating_fonte": "Moody's (2025)",
    },
    "Votorantim": {
        "rating_moodys": "Ba1",
        "rating_fitch":  "",
        "rating_sp":     "",
        "rating_perspectiva": "Estável",
        "rating_fonte": "Moody's (2025)",
    },
    "Banco do Nordeste": {
        "rating_moodys": "Ba1",
        "rating_fitch":  "",
        "rating_sp":     "",
        "rating_perspectiva": "Estável",
        "rating_fonte": "Moody's (2025)",
    },
    "Banco da Amazônia": {
        "rating_moodys": "Ba1",
        "rating_fitch":  "",
        "rating_sp":     "",
        "rating_perspectiva": "Estável",
        "rating_fonte": "Moody's (2025)",
    },
    "Banrisul": {
        "rating_moodys": "Ba3",
        "rating_fitch":  "BB-",
        "rating_sp":     "BB-",    # corrigido: BB- e nao B (RI Banrisul confirmado)
        "rating_perspectiva": "Estável",
        "rating_fonte": "Moody's/Fitch/S&P (RI Banrisul 2025)",
    },
    "Citibank Brasil": {
        "rating_moodys": "Ba1",
        "rating_fitch":  "",
        "rating_sp":     "",
        "rating_perspectiva": "Estável",
        "rating_fonte": "Moody's (2025)",
    },
    "BMG": {
        "rating_moodys": "B1",
        "rating_fitch":  "B+",
        "rating_sp":     "",
        "rating_perspectiva": "Estável",
        "rating_fonte": "Moody's (mar/2026) / Fitch",
    },
    # ── FINTECHS / DIGITAIS ───────────────────────────────────────────────────
    "Nubank": {
        "rating_moodys": "Ba2",    # Nu Financeira Ba2 global scale (Moody's 2023, reafirmado)
        "rating_fitch":  "",
        "rating_sp":     "",
        "rating_perspectiva": "Estável",
        "rating_fonte": "Moody's Ba2 (Nu Financeira, escala global)",
    },
    "Inter": {
        "rating_moodys": "Ba2",
        "rating_fitch":  "",
        "rating_sp":     "brAA+",
        "rating_perspectiva": "Positiva",
        "rating_fonte": "Moody's/S&P (2025)",
    },
    "XP Inc": {
        "rating_moodys": "Ba1",
        "rating_fitch":  "",
        "rating_sp":     "",
        "rating_perspectiva": "Estável",
        "rating_fonte": "Moody's (2025)",
    },
    "C6 Bank": {
        "rating_moodys": "",
        "rating_fitch":  "A(bra)",
        "rating_sp":     "",
        "rating_perspectiva": "Estável",
        "rating_fonte": "Fitch (escala nacional, out/2024)",
    },
    # ── INTERNACIONAIS NO BRASIL ──────────────────────────────────────────────
    "Bocom BBM": {
        "rating_moodys": "Baa3",
        "rating_fitch":  "",
        "rating_sp":     "",
        "rating_perspectiva": "Estável",
        "rating_fonte": "Moody's (out/2024)",
    },
    "Banco Mizuho": {
        "rating_moodys": "Baa3",
        "rating_fitch":  "",
        "rating_sp":     "",
        "rating_perspectiva": "Estável",
        "rating_fonte": "Moody's (2025)",
    },
    "Rabobank Brasil": {
        "rating_moodys": "",
        "rating_fitch":  "AAA(bra)",
        "rating_sp":     "",
        "rating_perspectiva": "Estável",
        "rating_fonte": "Fitch (escala nacional — suporte matriz Rabobank)",
    },
    "BNP Paribas": {
        "rating_moodys": "Aa3",
        "rating_fitch":  "AA-",
        "rating_sp":     "A+",
        "rating_perspectiva": "Estável",
        "rating_fonte": "Moody's/Fitch/S&P matriz BNP Paribas SA (2025)",
    },
    "JP Morgan": {
        "rating_moodys": "Aa2",
        "rating_fitch":  "AA",
        "rating_sp":     "A+",
        "rating_perspectiva": "Estável",
        "rating_fonte": "Moody's/Fitch/S&P matriz JPMorgan Chase (2025)",
    },
    "Goldman Sachs": {
        "rating_moodys": "A1",
        "rating_fitch":  "A+",
        "rating_sp":     "BBB+",
        "rating_perspectiva": "Estável",
        "rating_fonte": "Moody's/Fitch/S&P matriz Goldman Sachs (2025)",
    },
    "Bank of America": {
        "rating_moodys": "A1",
        "rating_fitch":  "AA-",
        "rating_sp":     "A-",
        "rating_perspectiva": "Estável",
        "rating_fonte": "Moody's/Fitch/S&P matriz BofA (2025)",
    },
    "Morgan Stanley": {
        "rating_moodys": "A1",
        "rating_fitch":  "AA-",
        "rating_sp":     "A+",
        "rating_perspectiva": "Estável",
        "rating_fonte": "Moody's/Fitch/S&P matriz Morgan Stanley (2025)",
    },
    "Crédit Agricole": {
        "rating_moodys": "Aa3",
        "rating_fitch":  "A+",
        "rating_sp":     "A+",
        "rating_perspectiva": "Estável",
        "rating_fonte": "Moody's/Fitch/S&P matriz Crédit Agricole (2025)",
    },
    "Société Générale": {
        "rating_moodys": "A1",
        "rating_fitch":  "A",
        "rating_sp":     "A",
        "rating_perspectiva": "Estável",
        "rating_fonte": "Moody's/Fitch/S&P matriz SocGen (2025)",
    },
    "UBS Brasil": {
        "rating_moodys": "Aa3",
        "rating_fitch":  "A+",
        "rating_sp":     "A",
        "rating_perspectiva": "Estável",
        "rating_fonte": "Moody's/Fitch/S&P matriz UBS Group (2025)",
    },
    "HSBC Brasil": {
        "rating_moodys": "A1",
        "rating_fitch":  "AA-",
        "rating_sp":     "A",
        "rating_perspectiva": "Estável",
        "rating_fonte": "Moody's/Fitch/S&P matriz HSBC Holdings (2025)",
    },
    "Deutsche Bank Brasil": {
        "rating_moodys": "A2",
        "rating_fitch":  "A-",
        "rating_sp":     "BBB+",
        "rating_perspectiva": "Estável",
        "rating_fonte": "Moody's/Fitch/S&P matriz Deutsche Bank (2025)",
    },
    "China Construction Bank": {
        "rating_moodys": "A1",
        "rating_fitch":  "A",
        "rating_sp":     "A",
        "rating_perspectiva": "Estável",
        "rating_fonte": "Moody's/Fitch/S&P matriz CCB (2025)",
    },
    "Banco MUFG": {
        "rating_moodys": "A1",
        "rating_fitch":  "A",
        "rating_sp":     "A-",
        "rating_perspectiva": "Estável",
        "rating_fonte": "Moody's/Fitch/S&P matriz MUFG (2025)",
    },
    "Banco Sumitomo Mitsui": {
        "rating_moodys": "A1",
        "rating_fitch":  "A",
        "rating_sp":     "A-",
        "rating_perspectiva": "Estável",
        "rating_fonte": "Moody's/Fitch/S&P matriz SMBC (2025)",
    },
    "Scotiabank Brasil": {
        "rating_moodys": "A2",
        "rating_fitch":  "AA-",
        "rating_sp":     "A-",
        "rating_perspectiva": "Estável",
        "rating_fonte": "Moody's/Fitch/S&P matriz Scotiabank (2025)",
    },
}

# ── Aplica ao raiox.json ───────────────────────────────────────────────────────
with open("C:/Users/maico/Desktop/raio-x-bancario/data/raiox.json", encoding="utf-8") as f:
    d = json.load(f)

atualizados = 0
sem_rating  = 0

for b in d["bancos"]:
    rt = RATINGS.get(b["nome"])
    if rt:
        b.update(rt)
        atualizados += 1
    elif not (b.get("rating_moodys") or b.get("rating_fitch") or b.get("rating_sp")):
        sem_rating += 1

with open("C:/Users/maico/Desktop/raio-x-bancario/data/raiox.json", "w", encoding="utf-8") as f:
    json.dump(d, f, ensure_ascii=False, indent=2)

print(f"Ratings atualizados: {atualizados}")
print(f"Ainda sem rating:    {sem_rating}")
print()
print("Bancos com rating agora:")
for b in sorted(d["bancos"], key=lambda x: -x.get("ativo_total",0)):
    tem = b.get("rating_moodys") or b.get("rating_fitch") or b.get("rating_sp")
    if tem:
        m = b.get("rating_moodys","") or "-"
        f2 = b.get("rating_fitch","") or "-"
        sp = b.get("rating_sp","") or "-"
        print(f"  {b['nome']:<35} M={m:<6} F={f2:<6} SP={sp:<6}")
