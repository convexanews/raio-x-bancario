"""
Extrai dados do IF.data do BCB para todos os bancos do raiox.json
Periodo: 202503 (marco/2026 - mais recente disponivel)
TipoInstituicao=2 = Conglomerado Prudencial (correto para analise de risco)
"""
import urllib.request
import json
import time

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    "Accept": "application/json",
}

BASE = "https://olinda.bcb.gov.br/olinda/servico/IFDATA/versao/v1/odata"
PERIODO = 202503  # marco 2026 - mais recente
TIPO = 2  # Conglomerado Prudencial

def get(url):
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            return json.loads(r.read()), None
    except urllib.error.HTTPError as e:
        return None, f"HTTP {e.code}"
    except Exception as e:
        return None, str(e)

def fetch_relatorio(cod_inst, relatorio_num, top=200):
    url = (f"{BASE}/IfDataValores(AnoMes=@AnoMes,TipoInstituicao=@TipoInstituicao,Relatorio=@Relatorio)"
           f"?@AnoMes={PERIODO}&@TipoInstituicao={TIPO}&@Relatorio='{relatorio_num}'"
           f"&%24format=json&%24top={top}&%24filter=CodInst%20eq%20'{cod_inst}'")
    data, err = get(url)
    if data:
        return data.get("value", [])
    return []

# Primeiro: busca todos os CodInst disponíveis no cadastro para 202503
print("Buscando cadastro de instituicoes...")
url_cad = f"{BASE}/IfDataCadastro(AnoMes=@AnoMes)?@AnoMes={PERIODO}&%24format=json&%24top=1000"
data, err = get(url_cad)
cadastro = {}
if data:
    for inst in data.get("value", []):
        nome = inst.get("NomeInstituicao", "")
        cod = inst.get("CodInst", "")
        td = inst.get("Td", "")  # C=conglomerado, I=individual
        tc = inst.get("Tc", 0)
        situacao = inst.get("Situacao", "")
        cadastro[nome] = {"CodInst": cod, "Td": td, "Tc": tc, "Situacao": situacao}
    print(f"  {len(cadastro)} instituicoes encontradas")
    # Mostra alguns exemplos
    for nome, v in list(cadastro.items())[:5]:
        print(f"  {nome}: {v}")

# Salva cadastro completo para referencia
with open("C:/Users/maico/Desktop/raio-x-bancario/scripts/cadastro_202503.json", "w", encoding="utf-8") as f:
    json.dump(cadastro, f, ensure_ascii=False, indent=2)
print("\nCadastro salvo em cadastro_202503.json")
