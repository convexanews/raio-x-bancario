import sys, json
sys.stdout.reconfigure(encoding='utf-8')
with open('C:/Users/maico/Desktop/raio-x-bancario/data/raiox.json', encoding='utf-8') as f:
    d = json.load(f)

sem_rating = []
com_rating = []
for b in sorted(d['bancos'], key=lambda x: -x.get('ativo_total',0)):
    tem = b.get('rating_moodys') or b.get('rating_fitch') or b.get('rating_sp')
    at = b.get('ativo_total',0)
    lb = f"R${at/1e12:.2f}tri" if at>=1e12 else f"R${at/1e9:.0f}bi"
    if tem:
        com_rating.append(f"  {b['nome']:<35} M={b.get('rating_moodys',''):<6} F={b.get('rating_fitch',''):<6} SP={b.get('rating_sp',''):<6}  {lb}")
    else:
        sem_rating.append(f"  {b['nome']:<35} {lb}")

print(f"COM rating: {len(com_rating)}")
for x in com_rating: print(x)

print(f"\nSEM rating: {len(sem_rating)}")
for x in sem_rating: print(x)
