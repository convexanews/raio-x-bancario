import urllib.request, json

headers = {"User-Agent": "Mozilla/5.0", "Accept": "application/json"}
BASE = "https://olinda.bcb.gov.br/olinda/servico/IFDATA/versao/v1/odata"

# Busca o banco pelo codigo C0084710
url = f"{BASE}/IfDataCadastro(AnoMes=@AnoMes)?@AnoMes=202512&%24format=json&%24top=5000&%24filter=CodInst%20eq%20'C0084710'"
req = urllib.request.Request(url, headers=headers)
with urllib.request.urlopen(req, timeout=20) as r:
    data = json.loads(r.read())
    for inst in data.get("value", []):
        print(inst)
