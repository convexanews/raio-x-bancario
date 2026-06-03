"""
Compara dados do site com IF.data oficial do BCB
Pega os 10 maiores bancos e mostra lado a lado
"""
import json

with open("C:/Users/maico/Desktop/raio-x-bancario/data/raiox.json", encoding="utf-8") as f:
    d = json.load(f)

bancos = sorted(d["bancos"], key=lambda x: -x.get("ativo_total", 0))

print("=" * 90)
print(f"{'Banco':<30} {'Basileia':>10} {'Imobiliz':>10} {'Ativo Total':>20} {'Período'}")
print("=" * 90)
for b in bancos[:20]:
    at = b.get("ativo_total", 0)
    if at >= 1e12:
        at_str = f"R$ {at/1e12:.2f} tri"
    elif at >= 1e9:
        at_str = f"R$ {at/1e9:.1f} bi"
    else:
        at_str = f"R$ {at/1e6:.0f} mi"
    print(f"  {b['nome']:<28} {b['basileia']:>8.2f}%  {b['imobilizacao']:>8.2f}%  {at_str:>18}  {d['periodo']}")

print()
print("Para conferir manualmente no IF.data oficial:")
print("  https://www3.bcb.gov.br/ifdata/")
print("  Selecione: Data-base = 03/2026 | Tipo = Conglomerado Prudencial | Relatório = Informações de Capital")
