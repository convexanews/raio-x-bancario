import sys, json
sys.stdout.reconfigure(encoding='utf-8')
with open('C:/Users/maico/Desktop/raio-x-bancario/data/raiox.json', encoding='utf-8') as f:
    d = json.load(f)
b = d['bancos'][0]  # primeiro banco
print("Campos disponíveis:", list(b.keys()))
print()
# Mostra indicadores de 3 bancos
for banco in d['bancos'][:5]:
    print(f"{banco['nome']}: captacoes={banco.get('captacoes_total',0)/1e9:.0f}bi  carteira={banco.get('carteira_credito',0)/1e9:.0f}bi  pr={banco.get('pr',0)/1e9:.0f}bi  tvm={banco.get('tvm',0)}")
