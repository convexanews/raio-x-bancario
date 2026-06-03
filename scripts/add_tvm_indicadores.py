"""
Extrai TVM do CSV e recalcula indicadores com fórmulas corretas do Rafael:
- VR estimado  = captacoes_total
- AR estimado  = TVM + carteira_credito
- Cobertura    = AR / VR
- Funding      = captacoes / PR
"""
import sys, json
sys.stdout.reconfigure(encoding='utf-8')

# ── Extrai TVM do CSV ──────────────────────────────────────────────────────────
# O CSV é o relatório Ativo: col c = Títulos e Valores Mobiliários
# Linha format: Instituição;Código;TCB;SR;TD;TC;Cidade;UF;Data;Disp(a);AIF(b);TVM(c);...;AtivoTotal(k)
with open("C:/Users/maico/Downloads/dados.csv", encoding="latin-1") as f:
    linhas = f.readlines()

tvm_por_nome = {}
tvm_por_cod  = {}
for linha in linhas[2:]:
    cols = linha.strip().split(";")
    if len(cols) < 12: continue
    nome = cols[0].strip().upper()
    cod  = cols[1].strip()
    tvm_str = cols[11].strip().replace(".", "").replace(",", ".")  # coluna c = índice 11
    try:
        tvm = float(tvm_str) * 1000  # converte de R$ mil para R$
    except:
        tvm = 0.0
    tvm_por_nome[nome] = tvm
    tvm_por_cod[cod]   = tvm

print(f"TVM extraído de {len(tvm_por_nome)} instituições do CSV")

# ── Carrega raiox.json ─────────────────────────────────────────────────────────
with open("C:/Users/maico/Desktop/raio-x-bancario/data/raiox.json", encoding="utf-8") as f:
    d = json.load(f)

def busca_tvm(nome_bcb):
    nb = nome_bcb.upper().replace(" - PRUDENCIAL","").strip()
    if nb in tvm_por_nome: return tvm_por_nome[nb]
    for k, v in tvm_por_nome.items():
        kc = k.replace(" S.A.","").replace(" - PRUDENCIAL","").replace(" INSTITUIÇÃO DE PAGAMENTO","").strip()
        nc = nb.replace(" S.A.","").strip()
        if nc == kc or (len(nc) > 6 and nc in kc): return v
    return 0.0

atualizados = 0
for b in d["bancos"]:
    tvm = busca_tvm(b["nome_bcb"])
    b["tvm"] = tvm

    capt = b.get("captacoes_total", 0) or b.get("depositos_total", 0)
    carteira = b.get("carteira_credito", 0)
    pr  = b.get("pr", 0)

    # Fórmulas do Rafael:
    # VR estimado = captações totais
    vr = capt

    # AR estimado = TVM + carteira de crédito
    ar = tvm + carteira

    # Cobertura Prudencial = AR / VR
    cobertura = round(ar / vr * 100, 2) if vr > 0 else 0.0

    # Funding = captações / PR
    funding = round(capt / pr, 2) if pr > 0 else 0.0

    b["vr_estimado"] = round(vr, 0)
    b["ar_estimado"] = round(ar, 0)
    b["cobertura_prudencial"] = cobertura
    b["funding_capital"] = funding

    if tvm > 0: atualizados += 1

print(f"TVM encontrado para {atualizados} bancos")
print()
print("Amostra dos indicadores:")
top = sorted(d["bancos"], key=lambda x: -x.get("ativo_total", 0))
for b in top[:10]:
    at = b.get("ativo_total",0)
    print(f"  {b['nome']:<30} TVM={b.get('tvm',0)/1e9:6.0f}bi  AR={b.get('ar_estimado',0)/1e9:6.0f}bi  VR={b.get('vr_estimado',0)/1e9:6.0f}bi  Cobertura={b.get('cobertura_prudencial',0):6.1f}%  Funding={b.get('funding_capital',0):5.1f}x")

with open("C:/Users/maico/Desktop/raio-x-bancario/data/raiox.json", "w", encoding="utf-8") as f:
    json.dump(d, f, ensure_ascii=False, indent=2)
print("\nSalvo!")
