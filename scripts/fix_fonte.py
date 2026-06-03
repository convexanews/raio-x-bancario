import json, sys
sys.stdout.reconfigure(encoding='utf-8')

with open("C:/Users/maico/Desktop/raio-x-bancario/data/raiox.json", encoding="utf-8") as f:
    d = json.load(f)

corrigidos = 0
for b in d["bancos"]:
    fonte = b.get("fonte_dados", "")
    if "03/2026" in fonte or "202503" in fonte:
        b["fonte_dados"] = "IF.data BCB 12/2025 (API Oficial)"
        corrigidos += 1
    elif "LIQUIDADO" in fonte:
        pass  # mantém
    elif not fonte:
        b["fonte_dados"] = "IF.data BCB 12/2025 (API Oficial)"
        corrigidos += 1

print(f"Corrigidos: {corrigidos}")

with open("C:/Users/maico/Desktop/raio-x-bancario/data/raiox.json", "w", encoding="utf-8") as f:
    json.dump(d, f, ensure_ascii=False, indent=2)

# Confirma
for b in d["bancos"][:5]:
    print(f"  {b['nome']}: {b['fonte_dados']}")
