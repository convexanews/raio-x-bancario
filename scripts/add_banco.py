import sys, json
sys.stdout.reconfigure(encoding='utf-8')

with open("C:/Users/maico/Desktop/raio-x-bancario/data/raiox.json", encoding="utf-8") as f:
    d = json.load(f)

# Verifica se já existe
nomes = [b["nome"] for b in d["bancos"]]
if "Banco Afinz" in nomes:
    print("Já existe!")
else:
    novo = {
        "nome": "Banco Afinz",
        "nome_bcb": "BANCO AFINZ S.A. - BANCO MÚLTIPLO",
        "tipo": "Banco Múltiplo",
        "basileia": 13.12,
        "imobilizacao": 1.54,
        "capital_nivel1": 9.36,
        "razao_alavancagem": 4.78,
        "funding_capital": 10.07,
        "cobertura_prudencial": 71.32,
        "patrimonio_liquido": 172937895.59,
        "ativo_total": 3038488374.43,
        "rwa": 1626414013.87,
        "pr": 213436552.29,
        "capital_principal": 144933615.63,
        "carteira_credito": 1437125126.57,
        "depositos_total": 0,
        "captacoes_total": 2149236110.0,
        "lucro_liquido": 14870719.62,
        "tvm": 95750280.16,
        "vr_estimado": 2149236110.0,
        "ar_estimado": 95750280.16 + 1437125126.57,
        "score": 80,
        "situacao": "verde",
        "rating_moodys": "",
        "rating_fitch": "",
        "rating_sp": "",
        "rating_perspectiva": "",
        "rating_fonte": "",
        "fonte_dados": "IF.data BCB 12/2025 (API Oficial)",
    }
    d["bancos"].append(novo)
    d["total"] = len(d["bancos"])
    d["bancos"].sort(key=lambda x: (-x["score"], -x.get("ativo_total",0)))

    with open("C:/Users/maico/Desktop/raio-x-bancario/data/raiox.json", "w", encoding="utf-8") as f:
        json.dump(d, f, ensure_ascii=False, indent=2)

    print(f"Banco Afinz adicionado! Total: {d['total']} bancos")
    print(f"  Basileia: {novo['basileia']}%  Imob: {novo['imobilizacao']}%  Score: {novo['score']}")
    print(f"  Ativo: R${novo['ativo_total']/1e9:.2f}bi  Captações: R${novo['captacoes_total']/1e9:.2f}bi")
