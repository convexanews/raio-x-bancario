"""
Atualiza raiox.json com dados do IF.data BCB - periodo 202503 (marco/2026)
Extrai: Basileia, Imobilizacao, Captacoes, Patrimonio Referencia, RWA, Ativo Total, Lucro
"""
import urllib.request
import json
import time

headers = {"User-Agent": "Mozilla/5.0", "Accept": "application/json"}
BASE = "https://olinda.bcb.gov.br/olinda/servico/IFDATA/versao/v1/odata"
PERIODO = 202503

def get(url):
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            return json.loads(r.read()).get("value", [])
    except:
        return []

def fetch_banco(cod_inst, relatorio_num, tipo=2):
    url = (f"{BASE}/IfDataValores(AnoMes=@AnoMes,TipoInstituicao=@TipoInstituicao,Relatorio=@Relatorio)"
           f"?@AnoMes={PERIODO}&@TipoInstituicao={tipo}&@Relatorio='{relatorio_num}'"
           f"&%24format=json&%24top=500&%24filter=CodInst%20eq%20'{cod_inst}'")
    rows = get(url)
    # Converte lista de {NomeColuna, Saldo} em dict
    return {r["NomeColuna"]: r["Saldo"] for r in rows if r.get("NomeColuna")}

# Carrega cadastro
with open("C:/Users/maico/Desktop/raio-x-bancario/scripts/cadastro_202503.json", encoding="utf-8") as f:
    cadastro = json.load(f)

# Mapa nome_bcb -> CodInst (conglomerado prudencial = Td='I', tipo prudencial)
# Preferimos o codigo do conglomerado prudencial (sufixo PRUDENCIAL ou Td='I' com CodConglomeradoPrudencial)
def find_cod(nome_bcb):
    # Tenta nome exato primeiro
    if nome_bcb in cadastro:
        return cadastro[nome_bcb]["CodInst"]
    # Tenta com sufixo PRUDENCIAL
    nome_prud = nome_bcb + " - PRUDENCIAL"
    if nome_prud in cadastro:
        return cadastro[nome_prud]["CodInst"]
    # Busca parcial
    nome_upper = nome_bcb.upper()
    for k, v in cadastro.items():
        if nome_upper in k.upper() or k.upper() in nome_upper:
            return v["CodInst"]
    return None

# Carrega bancos atuais
with open("C:/Users/maico/Desktop/raio-x-bancario/data/raiox.json", encoding="utf-8") as f:
    raiox = json.load(f)

bancos = raiox["bancos"]
print(f"Total bancos no site: {len(bancos)}")

# Mapa de contas importantes por relatorio
# Rel 1 (Resumo): Ativo Total, Carteira de Crédito Classif., Resultado, PL
# Rel 3 (Passivo): Depósitos (captações)
# Rel 5 (Capital): Basileia, Imobilizacao, PR, RWA

resultados = []

for banco in bancos:
    nome_bcb = banco["nome_bcb"]
    cod = find_cod(nome_bcb)

    if not cod:
        print(f"  [NAO ENCONTRADO] {nome_bcb}")
        resultados.append({**banco, "_status": "nao_encontrado"})
        continue

    print(f"  Buscando {banco['nome']} ({cod})...", end=" ")

    # Rel 5 = Informações de Capital (Basileia, Imobilizacao, PR, RWA)
    cap = fetch_banco(cod, "5")
    time.sleep(0.3)

    # Rel 1 = Resumo (Ativo Total, PL, Lucro, Carteira Credito, Depositos)
    resumo = fetch_banco(cod, "1")
    time.sleep(0.3)

    # Rel 3 = Passivo (Captações detalhadas)
    passivo = fetch_banco(cod, "3")
    time.sleep(0.3)

    # Extrai valores
    def val(d, *keys):
        for k in keys:
            for dk in d:
                if k.lower() in dk.lower():
                    v = d[dk]
                    try: return round(float(v), 2)
                    except: pass
        return 0.0

    basileia = val(cap, "Índice de Basileia", "Basileia")
    imobilizacao = val(cap, "Imobilização", "Imobilizacao")
    pr = val(cap, "Patrimônio de Referência", "Patrimonio de Referencia")
    rwa = val(cap, "RWA", "Ativos Ponderados")
    capital_principal = val(cap, "Capital Principal", "CET1")

    ativo_total = val(resumo, "Ativo Total")
    pl = val(resumo, "Patrimônio Líquido", "PL")
    lucro = val(resumo, "Resultado", "Lucro")
    carteira_credito = val(resumo, "Carteira de Crédito", "Crédito Classif")

    depositos = val(passivo, "Depósitos", "Total de Depósitos")
    captacoes_mercado = val(passivo, "Captações no Mercado Aberto", "Mercado Aberto")

    # Calcula indicadores
    if pr > 0 and depositos > 0:
        funding_capital = round(depositos / pr, 2)
    elif pr > 0 and ativo_total > 0:
        funding_capital = round((ativo_total - pl) / pr, 2) if pl > 0 else 0
    else:
        funding_capital = banco.get("funding_capital", 0)

    if depositos > 0 and rwa > 0:
        cobertura_prudencial = round((rwa / depositos) * 100, 2)
    else:
        cobertura_prudencial = banco.get("cobertura_prudencial", 0)

    # Score atualizado
    score_basileia = 50 if basileia >= 15 else (30 if basileia >= 10.5 else 10)
    score_imob = 50 if imobilizacao <= 10 else (30 if imobilizacao <= 25 else (15 if imobilizacao <= 50 else 5))
    score = score_basileia + score_imob if basileia > 0 else banco["score"]

    situacao = "verde" if score >= 80 else ("amarelo" if score >= 50 else "vermelho")

    novo = {
        **banco,
        "basileia": basileia if basileia > 0 else banco["basileia"],
        "imobilizacao": imobilizacao if imobilizacao > 0 else banco["imobilizacao"],
        "funding_capital": funding_capital if funding_capital > 0 else banco.get("funding_capital", 0),
        "cobertura_prudencial": cobertura_prudencial if cobertura_prudencial > 0 else banco.get("cobertura_prudencial", 0),
        "patrimonio_liquido": pl if pl > 0 else banco.get("patrimonio_liquido", 0),
        "ativo_total": ativo_total if ativo_total > 0 else 0,
        "rwa": rwa if rwa > 0 else 0,
        "pr": pr if pr > 0 else 0,
        "capital_principal": capital_principal if capital_principal > 0 else 0,
        "carteira_credito": carteira_credito if carteira_credito > 0 else 0,
        "depositos_total": depositos if depositos > 0 else 0,
        "score": score if basileia > 0 else banco["score"],
        "situacao": situacao if basileia > 0 else banco["situacao"],
        "fonte_dados": f"IF.data BCB 03/2026 (API Oficial)",
        "_cod_bcb": cod,
    }
    resultados.append(novo)

    status = "OK" if basileia > 0 else "sem dados capital"
    print(f"{status} | Basileia={novo['basileia']} Imob={novo['imobilizacao']} Score={novo['score']}")

# Salva resultado
raiox_novo = {
    **raiox,
    "atualizado_em": "03/2026 (IF.data BCB)",
    "periodo": "202503",
    "nota": "Dados do Conglomerado Prudencial via API do BCB (mar/2026). Indicadores: Basileia, Imobilizacao, Funding/Capital e Cobertura Prudencial.",
    "bancos": resultados
}

saida = "C:/Users/maico/Desktop/raio-x-bancario/scripts/raiox_202503.json"
with open(saida, "w", encoding="utf-8") as f:
    json.dump(raiox_novo, f, ensure_ascii=False, indent=2)

print(f"\nSalvo em {saida}")
print(f"Total: {len(resultados)} bancos")
encontrados = sum(1 for r in resultados if r.get("basileia", 0) > 0)
print(f"Com dados atualizados: {encontrados}")
