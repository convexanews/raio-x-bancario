import sys, json
sys.stdout.reconfigure(encoding='utf-8')

with open("C:/Users/maico/Downloads/dados.csv", encoding="latin-1") as f:
    linhas = f.readlines()

dados_csv = []
for linha in linhas[2:]:
    linha = linha.strip()
    if not linha: continue
    cols = linha.split(";")
    if len(cols) < 9: continue
    nome = cols[0].strip()
    codigo = cols[1].strip()
    td = cols[4].strip()
    data = cols[8].strip() if len(cols) > 8 else ""
    ativo_str = cols[-1].strip().replace(".", "").replace(",", ".")
    try:
        ativo_real = float(ativo_str) * 1000
    except:
        ativo_real = 0
    dados_csv.append({"nome": nome, "codigo": codigo, "td": td, "data": data, "ativo": ativo_real})

# Indice por nome e por código
csv_nome = {d["nome"].upper(): d for d in dados_csv}
csv_cod  = {d["codigo"]: d for d in dados_csv}

print(f"CSV: {len(dados_csv)} instituicoes | Periodo: {dados_csv[0]['data']}")

with open("C:/Users/maico/Desktop/raio-x-bancario/data/raiox.json", encoding="utf-8") as f:
    raiox = json.load(f)

def busca(nome_bcb):
    nb = nome_bcb.upper().replace(" - PRUDENCIAL","").strip()
    if nb in csv_nome: return csv_nome[nb]
    for k, v in csv_nome.items():
        kc = k.replace(" - PRUDENCIAL","").replace(" S.A.","").strip()
        nc = nb.replace(" S.A.","").strip()
        if nc in kc or kc in nc: return v
    return None

print("\n=== COMPARACAO ATIVO TOTAL (top 30 por tamanho) ===")
print(f"{'Banco':<32} {'Nosso':>14} {'CSV':>14} {'Dif':>7}  Status")
print("-"*80)

ok=0; dif=0; nf=0
for b in sorted(raiox["bancos"], key=lambda x: -x.get("ativo_total",0))[:30]:
    nosso = b.get("ativo_total", 0)
    entry = busca(b["nome_bcb"])
    if not entry:
        print(f"  {b['nome']:<30} {nosso/1e9:>11.1f}bi {'---':>14}  [nao encontrado no CSV]")
        nf+=1; continue
    csv_v = entry["ativo"]
    if nosso > 0 and csv_v > 0:
        d = abs(nosso-csv_v)/csv_v*100
        status = "OK" if d < 5 else ("OK* consolidado" if d < 200 else "VERIFICAR")
        if d < 5: ok+=1
        else: dif+=1
    else:
        d = 0; status = "sem dado"
    print(f"  {b['nome']:<30} {nosso/1e9:>11.1f}bi {csv_v/1e9:>11.1f}bi {d:>5.1f}%  {status}")

print(f"\nResumo: {ok} OK | {dif} diferença | {nf} não encontrado")

print("\n=== BANCOS NO CSV > R$5bi QUE FALTAM NO SITE ===")
nossos = {b["nome_bcb"].upper().replace(" - PRUDENCIAL","") for b in raiox["bancos"]}
faltam = []
for d in dados_csv:
    nc = d["nome"].upper().replace(" S.A.","").replace(" - PRUDENCIAL","").strip()
    if d["ativo"] > 5e9 and not any(nc in n or n in nc for n in nossos):
        faltam.append(d)
faltam.sort(key=lambda x: -x["ativo"])
for d in faltam[:20]:
    print(f"  {d['nome'][:55]:<55} R${d['ativo']/1e9:.1f}bi  TD={d['td']}")
