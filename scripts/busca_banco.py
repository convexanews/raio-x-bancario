import urllib.request, json, sys
sys.stdout.reconfigure(encoding='utf-8')

headers = {"User-Agent": "Mozilla/5.0", "Accept": "application/json"}
BASE = "https://olinda.bcb.gov.br/olinda/servico/IFDATA/versao/v1/odata"
COD = "C0083539"
PERIODO = 202512

def fetch_rel(relatorio, tipo=1):
    url = (f"{BASE}/IfDataValores(AnoMes=@AnoMes,TipoInstituicao=@TipoInstituicao,Relatorio=@Relatorio)"
           f"?@AnoMes={PERIODO}&@TipoInstituicao={tipo}&@Relatorio='{relatorio}'"
           f"&%24format=json&%24top=500&%24filter=CodInst%20eq%20'{COD}'")
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=20) as r:
            return json.loads(r.read()).get("value", [])
    except:
        return []

def parse_float(v):
    if v is None: return 0.0
    if isinstance(v, (int, float)): return float(v)
    s = str(v).strip().replace(",", ".")
    try: return float(s)
    except: return 0.0

def to_dict(rows):
    d = {}
    for row in rows:
        col = row.get("NomeColuna","").replace("\n"," ").strip()
        if col:
            d[col] = parse_float(row.get("Saldo"))
    return d

def val(d, *keys):
    for k in keys:
        kc = k.lower().strip()
        for dk, v in d.items():
            if kc in dk.lower():
                return v
    return 0.0

print(f"Buscando dados do Banco Afinz ({COD}) - {PERIODO}")

cap = to_dict(fetch_rel("5"))
res = to_dict(fetch_rel("1"))
pas = to_dict(fetch_rel("3"))

print(f"\nCapital ({len(cap)} colunas):")
for k,v in cap.items():
    if v != 0: print(f"  {k}: {v}")

print(f"\nResumo ({len(res)} colunas):")
for k,v in res.items():
    if v != 0: print(f"  {k}: {v}")

# Indicadores principais
basileia     = round(val(cap, "Índice de Basileia") * 100, 2)
imobilizacao = round(val(cap, "Índice de Imobilização") * 100, 2)
cap_nivel1   = round(val(cap, "Índice de Capital Nível I") * 100, 2)
pr           = val(cap, "Patrimônio de Referência para Comparação")
rwa          = val(cap, "Ativos Ponderados pelo Risco (RWA)")
ativo_total  = val(res, "Ativo Total")
pl           = val(res, "Patrimônio Líquido")
lucro        = val(res, "Lucro Líquido")
carteira     = val(res, "Carteira de Crédito")
captacoes    = val(res, "Captações")

funding  = round(captacoes / pr, 2) if pr > 0 and captacoes > 0 else 0
ar       = val(res, "Títulos e Valores Mobiliários") + carteira
cobertura = round(ar / captacoes * 100, 2) if captacoes > 0 else 0

sb = 50 if basileia >= 15 else (30 if basileia >= 10.5 else 10)
si = 50 if imobilizacao <= 10 else (30 if imobilizacao <= 25 else (15 if imobilizacao <= 50 else 5))
score = sb + si if basileia > 0 else 60

print(f"\n{'='*50}")
print(f"BANCO AFINZ — Indicadores dez/2025")
print(f"  Basileia:      {basileia}%")
print(f"  Imobilização:  {imobilizacao}%")
print(f"  Capital Nível I: {cap_nivel1}%")
print(f"  PR:            R${pr/1e9:.2f}bi")
print(f"  RWA:           R${rwa/1e9:.2f}bi")
print(f"  Ativo Total:   R${ativo_total/1e9:.2f}bi")
print(f"  Captações:     R${captacoes/1e9:.2f}bi")
print(f"  Carteira:      R${carteira/1e9:.2f}bi")
print(f"  Funding/Cap:   {funding}x")
print(f"  Cobertura:     {cobertura}%")
print(f"  Score:         {score}/100")
