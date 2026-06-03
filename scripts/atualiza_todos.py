"""
Usa bulk TipoInst=1 (que ja inclui todos os conglomerados prudenciais)
Filtra: basileia >= 10%, ativo >= R$1 bilhao, top 100 por ativo
"""
import urllib.request, json, time

headers = {"User-Agent": "Mozilla/5.0", "Accept": "application/json"}
BASE = "https://olinda.bcb.gov.br/olinda/servico/IFDATA/versao/v1/odata"
PERIODO = 202512  # dezembro/2025 - mais recente disponivel no IF.data

def fetch(tipo, rel, top=60000):
    url = (f"{BASE}/IfDataValores(AnoMes=@AnoMes,TipoInstituicao=@TipoInstituicao,Relatorio=@Relatorio)"
           f"?@AnoMes={PERIODO}&@TipoInstituicao={tipo}&@Relatorio='{rel}'"
           f"&%24format=json&%24top={top}")
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=45) as r:
            data = r.read()
            print(f"  recebido {len(data)//1024}kb")
            return json.loads(data).get("value", [])
    except Exception as e:
        print(f"  ERRO: {e}"); return []

def get_cadastro():
    url = f"{BASE}/IfDataCadastro(AnoMes=@AnoMes)?@AnoMes={PERIODO}&%24format=json&%24top=5000"
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, timeout=60) as r:
        return json.loads(r.read()).get("value", [])

def pf(v):
    if v is None: return 0.0
    if isinstance(v, (int, float)): return float(v)
    s = str(v).strip()
    if "," in s and "." in s: s = s.replace(".", "").replace(",", ".")
    elif "," in s: s = s.replace(",", ".")
    try: return float(s)
    except: return 0.0

def to_dict(rows):
    d = {}
    for r in rows:
        cod = r.get("CodInst",""); col = r.get("NomeColuna","")
        if cod and col:
            if cod not in d: d[cod] = {}
            d[cod][col] = pf(r.get("Saldo"))
    return d

def v(d, *keys):
    for k in keys:
        kc = k.lower().strip()
        for dk, val in d.items():
            if kc in dk.lower().replace('\n',' ').strip():
                return val
    return 0.0

# ── Dados ─────────────────────────────────────────────────────────────────────
print("Cadastro..."); cad_raw = get_cadastro()
cad = {x["CodInst"]: x for x in cad_raw}
print(f"  {len(cad)} inst")

print("Resumo..."); rel1 = to_dict(fetch(1,"1",20000))
print(f"  {len(rel1)}")
print("Passivo..."); rel3 = to_dict(fetch(1,"3",50000))
print(f"  {len(rel3)}")
print("Capital..."); rel5 = to_dict(fetch(1,"5",50000))
print(f"  {len(rel5)}")

# ── Ratings do raiox original ─────────────────────────────────────────────────
with open("C:/Users/maico/Desktop/raio-x-bancario/data/raiox.json", encoding="utf-8") as f:
    orig = json.load(f)
rt = {}
for b in orig["bancos"]:
    rt[b["nome_bcb"].upper()] = b

# ── Monta lista ───────────────────────────────────────────────────────────────
print("Montando...")
lista = []
for cod, cap in rel5.items():
    info = cad.get(cod, {})
    nome_bcb = info.get("NomeInstituicao", cod)
    if info.get("Situacao","A") not in ("A","P",""): continue

    basileia     = round(v(cap,"Índice de Basileia") * 100, 2)
    imobilizacao = round(v(cap,"Índice de Imobilização") * 100, 2)
    cap_nivel1   = round(v(cap,"Índice de Capital Nível I") * 100, 2)
    alavancagem  = round(v(cap,"Razão de Alavancagem") * 100, 2)
    pr   = v(cap,"Patrimônio de Referência para Comparação","Patrimônio de Referência")
    rwa  = v(cap,"Ativos Ponderados pelo Risco (RWA)","RWA Total")
    cap1 = v(cap,"Capital Principal para Comparação","Capital Principal")

    if basileia < 10: continue  # abaixo do minimo regulatorio real

    res = rel1.get(cod, {})
    ativo   = v(res,"Ativo Total")
    pl      = v(res,"Patrimônio Líquido")
    lucro   = v(res,"Lucro Líquido","Resultado")
    carteira= v(res,"Carteira de Crédito")
    captres = v(res,"Captações")

    if ativo > 0 and ativo < 1000000: continue  # < R$1 bilhao

    pas  = rel3.get(cod, {})
    capt = v(pas,"Captações") or captres
    dep  = v(pas,"Depósitos à Vista") + v(pas,"Depósitos a Prazo") + v(pas,"Depósitos de Poupança") + v(pas,"Depósitos Interfinanceiros")
    base = capt if capt > 0 else dep

    funding   = round(base / pr, 2)      if pr > 0 and base > 0 else 0.0
    cobertura = round(rwa / base * 100, 2) if base > 0 and rwa > 0 else 0.0

    sb = 50 if basileia >= 15 else (30 if basileia >= 10.5 else 10)
    si = 50 if imobilizacao <= 10 else (30 if imobilizacao <= 25 else (15 if imobilizacao <= 50 else 5))
    score = sb + si
    sit   = "verde" if score >= 80 else ("amarelo" if score >= 50 else "vermelho")

    # Nome amigavel e ratings do banco
    nome_key = nome_bcb.upper()
    orig_b = rt.get(nome_key, {})
    # Tenta match parcial se nao encontrou exato
    if not orig_b:
        for k, bk in rt.items():
            nb = nome_bcb.upper().replace(" - PRUDENCIAL","").strip()
            if nb in k or k in nb:
                orig_b = bk; break

    nome_amig = orig_b.get("nome") if orig_b else None
    if not nome_amig:
        nome_amig = nome_bcb.replace(" - PRUDENCIAL","").title()

    # Tipo
    nl = nome_bcb.lower()
    if orig_b.get("tipo"): tipo = orig_b["tipo"]
    elif any(x in nl for x in ["cooper","sicoob","sicredi","unicred","cresol","ailos"]): tipo = "Cooperativa"
    elif any(x in nl for x in ["nu pag","nubank","inter","c6","next","neon","pagbank","picpay","pagseguro","original","agibank"]): tipo = "Banco Digital"
    elif any(x in nl for x in ["investimento","btg","xp invest","modal","genial","goldman","morgan","jp morgan","merrill","ubs","credit agric","mufg","hsbc"]): tipo = "Banco de Investimento"
    elif any(x in nl for x in ["caixa econom","banco do brasil","bndes","nordeste do brasil","amazonia","banrisul","banestes","brb ","banese","desenvolv","fomento"]): tipo = "Banco Público"
    elif any(x in nl for x in ["honda","toyota","gm ","bmw","vw ","cnh","caterpillar","john deere","volvo"]): tipo = "Banco de Montadora"
    else: tipo = orig_b.get("tipo","Banco Múltiplo")

    lista.append({
        "nome": nome_amig, "nome_bcb": nome_bcb, "tipo": tipo,
        "basileia": basileia, "imobilizacao": imobilizacao,
        "capital_nivel1": cap_nivel1, "razao_alavancagem": alavancagem,
        "funding_capital": funding, "cobertura_prudencial": cobertura,
        "patrimonio_liquido": pl, "ativo_total": ativo,
        "rwa": rwa, "pr": pr, "capital_principal": cap1,
        "carteira_credito": carteira, "depositos_total": dep,
        "captacoes_total": capt, "lucro_liquido": lucro,
        "score": score, "situacao": sit,
        "rating_moodys": orig_b.get("rating_moodys",""),
        "rating_fitch":  orig_b.get("rating_fitch",""),
        "rating_sp":     orig_b.get("rating_sp",""),
        "rating_perspectiva": orig_b.get("rating_perspectiva",""),
        "rating_fonte":  orig_b.get("rating_fonte",""),
        "fonte_dados": "IF.data BCB 03/2026 (API Oficial)",
        "_cod_bcb": cod,
    })

# Top 100 por ativo total
lista.sort(key=lambda x: -x["ativo_total"])
lista = lista[:100]
lista.sort(key=lambda x: (-x["score"], -x["basileia"]))

print(f"Total: {len(lista)}")
for lb, mn, mx in [("Score>=80",80,101),("60-79",60,80),("<60",0,60)]:
    print(f"  {lb}: {sum(1 for b in lista if mn<=b['score']<mx)}")

print("\nTop 20 por ativo (maiores bancos):")
top_at = sorted(lista, key=lambda x: -x["ativo_total"])
for b in top_at[:20]:
    at = b["ativo_total"]
    lb = f"R${at/1e6:.1f}tri" if at>=1e6 else f"R${at/1e3:.0f}bi"
    print(f"  {b['nome'][:35]:35} B={b['basileia']:5.1f}%  {lb}")

with open("C:/Users/maico/Desktop/raio-x-bancario/data/raiox.json","w",encoding="utf-8") as f:
    json.dump({"atualizado_em":"12/2025 (IF.data BCB)","fonte":"Banco Central do Brasil - IF.data",
               "periodo":"202512","nota":"Top 100 instituicoes por ativo. Dados BCB dez/2025 (mais recente disponivel).",
               "total":len(lista),"bancos":lista}, f, ensure_ascii=False, indent=2)
print("\nSalvo!")
