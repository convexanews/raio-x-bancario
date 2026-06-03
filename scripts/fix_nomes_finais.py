import sys, json
sys.stdout.reconfigure(encoding='utf-8')

with open("C:/Users/maico/Desktop/raio-x-bancario/data/raiox.json", encoding="utf-8") as f:
    d = json.load(f)

CORRECOES = {
    "Bnp Paribas": "BNP Paribas",
    "Bocom": "Bocom BBM",
    "Bd Regional Do Extremo Sul": "BRDE",
    "Banco Cnh Industrial Capital S.A": "CNH Industrial Capital",
    "Bco Csf S.A.": "Banco Carrefour",
    "Bco Do Est. Do Pa S.A.": "Banpará",
    "Deutsche": "Deutsche Bank Brasil",
    "Bank Of China (Brasil)": "Bank of China Brasil",
    "Bco Rabobank Intl Brasil S.A.": "Rabobank Brasil",
    "Banco Sumitomo Mitsui Brasil S.A.": "Banco Sumitomo Mitsui",
    "Banco Mufg": "Banco MUFG",
    "Stone Ip": "Stone",
    "Cloudwalk Ip": "CloudWalk",
    "Mercado Pago Ip": "Mercado Pago",
    "Bcb Banco De Crédito S.A.": "BCB Banco de Crédito",
    "Banco Original S.A.": "Banco Original",
    "Csfb Garantia": "Credit Suisse Brasil",
    "Banco Fibra S.A.": "Banco Fibra",
    "Mizuho": "Banco Mizuho",
}

for b in d["bancos"]:
    if b["nome"] in CORRECOES:
        b["nome"] = CORRECOES[b["nome"]]

d["bancos"].sort(key=lambda x: (-x["score"], -x.get("ativo_total", 0)))

with open("C:/Users/maico/Desktop/raio-x-bancario/data/raiox.json", "w", encoding="utf-8") as f:
    json.dump(d, f, ensure_ascii=False, indent=2)

print(f"Total: {d['total']} bancos | Periodo: {d['periodo']}")
print("\nTop 20:")
for b in d["bancos"][:20]:
    at = b.get("ativo_total",0)
    lb = f"R${at/1e12:.2f}tri" if at>=1e12 else f"R${at/1e9:.0f}bi"
    print(f"  {b['nome']:<35} {b['tipo']:<25} B={b['basileia']:5.1f}%  score={b['score']}  {lb}")
print("\nGrandes bancos:")
for b in sorted(d["bancos"], key=lambda x: -x.get("ativo_total",0))[:8]:
    at = b.get("ativo_total",0)
    lb = f"R${at/1e12:.2f}tri" if at>=1e12 else f"R${at/1e9:.0f}bi"
    print(f"  {b['nome']:<35} B={b['basileia']:5.1f}%  imob={b['imobilizacao']:5.1f}%  score={b['score']}  {lb}")
