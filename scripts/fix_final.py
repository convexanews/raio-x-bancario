import sys, json, re
sys.stdout.reconfigure(encoding='utf-8')

with open("C:/Users/maico/Desktop/raio-x-bancario/data/raiox.json", encoding="utf-8") as f:
    raiox = json.load(f)

# Nomes limpos finais
NOMES = {
    "ITAU UNIBANCO": "Itaú Unibanco",
    "BANCO DO BRASIL": "Banco do Brasil",
    "BB - PRUDENCIAL": "Banco do Brasil",
    "CAIXA ECONOMICA FEDERAL": "Caixa Econômica Federal",
    "CAIXA ECONOMICA FEDERAL - PRUDENCIAL": "Caixa Econômica Federal",
    "BRADESCO": "Bradesco",
    "SANTANDER": "Santander Brasil",
    "BNDES - PRUDENCIAL": "BNDES",
    "BANCO NACIONAL DE DESENVOLVIMENTO ECONOMICO E SOCIAL": "BNDES",
    "UBS PACTUAL": "BTG Pactual",
    "BTG PACTUAL": "BTG Pactual",
    "NU PAGAMENTOS": "Nubank",
    "XP INVESTIMENTOS CCTVM S/A": "XP Inc",
    "SAFRA": "Safra",
    "BCO COOPERATIVO SICREDI": "Sicredi",
    "BANCO COOPERATIVO SICREDI S.A.": "Sicredi",
    "BANCOOB - PRUDENCIAL": "Sicoob",
    "BANCO SICOOB": "Sicoob",
    "BANCOOB": "Sicoob",
    "CITIBANK - PRUDENCIAL": "Citibank Brasil",
    "BANRISUL": "Banrisul",
    "C6 BANK": "C6 Bank",
    "VOTORANTIM": "Votorantim",
    "JP MORGAN CHASE - PRUDENCIAL": "JP Morgan",
    "CIELO IP - PRUDENCIAL": "Cielo",
    "C0084710": "Cielo",
    "MERCADO PAGO IP - PRUDENCIAL": "Mercado Pago",
    "BCO DAYCOVAL S.A - PRUDENCIAL": "Daycoval",
    "DAYCOVAL": "Daycoval",
    "INTERMEDIUM": "Inter",
    "BANCO INTER S.A.": "Inter",
    "PAGSEGURO": "PagBank",
    "PAGBANK-PAGSEGURO": "PagBank",
    "BCO DO NORDESTE DO BRASIL S.A.": "Banco do Nordeste",
    "BANCO DO NORDESTE DO BRASIL S.A.": "Banco do Nordeste",
    "ABC-BRASIL - PRUDENCIAL": "ABC Brasil",
    "ABC-BRASIL": "ABC Brasil",
    "BCO DA AMAZONIA S.A.": "Banco da Amazônia",
    "BANCO DA AMAZONIA S.A.": "Banco da Amazônia",
    "BANCO VOLKSWAGEN S.A.": "Volkswagen Financial",
    "BCO RABOBANK INTL BRASIL S.A.": "Rabobank Brasil",
    "BANCO RABOBANK INTERNATIONAL BRASIL S.A.": "Rabobank Brasil",
    "STONE IP - FINANCEIRO": "Stone",
    "STONE IP - PRUDENCIAL": "Stone",
    "AGIBANK": "Agibank",
    "BMG": "BMG",
    "BOFA MERRILL LYNCH - PRUDENCIAL": "Bank of America",
    "MERRILL LYNCH": "Bank of America",
    "BANESTES": "Banestes",
    "PICPAY - FINANCEIRO": "PicPay",
    "PICPAY": "PicPay",
    "MERCANTIL DO BRASIL": "Mercantil do Brasil",
    "BANCO CLASSICO S.A.": "Banco Clássico",
    "BCO CLASSICO S.A. - PRUDENCIAL": "Banco Clássico",
    "BOCOM BBM": "Bocom BBM",
    "BOCOM": "Bocom BBM",
    "BCO PINE S.A. - PRUDENCIAL": "Pine",
    "PINE": "Pine",
    "BANCO ORIGINAL S.A.": "Banco Original",
    "BANCO ORIGINAL": "Banco Original",
    "SOFISA": "Sofisa",
    "SCOTIABANK BRASIL - PRUDENCIAL": "Scotiabank Brasil",
    "SCOTIABANK": "Scotiabank Brasil",
    "GOLDMAN SACHS - PRUDENCIAL": "Goldman Sachs",
    "GOLDMAN SACHS": "Goldman Sachs",
    "MORGAN STANLEY - PRUDENCIAL": "Morgan Stanley",
    "MORGAN STANLEY": "Morgan Stanley",
    "CREDIT AGRICOLE - PRUDENCIAL": "Crédit Agricole",
    "BANCO CREDIT AGRICOLE BRASIL S.A.": "Crédit Agricole",
    "BANCO HSBC - PRUDENCIAL": "HSBC Brasil",
    "BANCO HSBC S.A.": "HSBC Brasil",
    "UBS (BRASIL) - PRUDENCIAL": "UBS Brasil",
    "HONDA - PRUDENCIAL": "Honda Financeira",
    "GM - PRUDENCIAL": "GM Financial",
    "BANCO GM S.A.": "GM Financial",
    "APE POUPEX - PRUDENCIAL": "POUPEX",
    "BCO DES. DE MG S.A. - PRUDENCIAL": "BDMG",
    "BANCO DE DESENVOLVIMENTO DE MINAS GERAIS S.A.-BDMG": "BDMG",
    "RODOBENS": "Rodobens",
    "BS2": "BS2",
    "NEON PAGAMENTOS IP": "Neon",
    "BCO MUFG BRASIL S.A. - PRUDENCIAL": "Banco MUFG",
    "BCO SUMITOMO MITSUI BRASIL S.A.": "Banco Sumitomo Mitsui",
    "SOCIETE GENERALE - PRUDENCIAL": "Société Générale",
    "SOCIETE GENERALE": "Société Générale",
    "CSFB GARANTIA": "Credit Suisse Brasil",
    "BR PARTNERS BANCO DE INVESTIMENTO S.A.": "BR Partners",
    "CCB": "China Construction Bank",
    "CLOUDWALK IP": "CloudWalk",
    "CLOUDWALK INSTITUIÇÃO DE PAGAMENTO E SERVICOS LTDA": "CloudWalk",
    "PORTO SEGURO": "Porto Seguro Financeira",
    "BANCO FIBRA S.A.": "Banco Fibra",
    "DEUTSCHE BANK S.A. - BANCO ALEMAO": "Deutsche Bank Brasil",
    "BANCO CNH INDUSTRIAL CAPITAL S.A.": "CNH Industrial Capital",
    "STELLANTIS": "Stellantis Financial",
    "BANCO VOLVO BRASIL S.A.": "Volvo Financial",
    "SCANIA BANCO S.A.": "Scania Financial",
    "DAIMLERCHRYSLER": "Mercedes-Benz Financial",
    "BANCO MIZUHO DO BRASIL S.A.": "Banco Mizuho",
    "BANCO REGIONAL DE DESENVOLVIMENTO DO EXTREMO SUL": "BRDE",
    "BANCO CSF S.A.": "Banco Carrefour",
    "REDECARD INSTITUIÇÃO DE PAGAMENTO S.A.": "Rede (Itaú)",
    "GETNET ADQUIRÊNCIA E SERVIÇOS PARA MEIOS DE PAGAMENTO S.A. INSTITUIÇÃO DE PAGAMENTO": "Getnet (Santander)",
    "CREFISA S.A. CFI": "Crefisa",
    "CREFISA S.A. CRÉDITO, FINANCIAMENTO E INVESTIMENTOS": "Crefisa",
    # Cooperativas — nomes curtos
    "COOPERATIVA CENTRAL DE CRÉDITO - AILOS": "Ailos",
    "COOPERATIVA DE CREDITO VALE DO ITAJAI - VIACREDI": "Viacredi",
    "COOPERATIVA DE CREDITO CREDICITRUS": "Credicitrus",
    "COOPERFORTE COOPERATIVA DE CREDITO": "Cooperforte",
    "CREDICOAMO CREDITO RURAL COOPERATIVA": "Credicoamo",
    "COOPERATIVA DE CRÉDITO CONEXÃO - SICOOB CONEXÃO": "Sicoob Conexão",
    "SISPRIME DO BRASIL - COOPERATIVA DE CRÉDITO": "Sisprime",
    "COOPERATIVA CENTRAL DE CRÉDITO DE MINAS GERAIS LTDA. - SICOOB CENTRAL CREDIMINAS": "Sicoob Crediminas",
    "COOPERATIVA CENTRAL DE CRÉDITO DE SANTA CATARINA E RIO GRANDE DO SUL - SICOOB CENTRAL SC/RS": "Sicoob SC/RS",
    "COOPERATIVA CENTRAL DE CRÉDITO COM INTERAÇÃO SOLIDÁRIA - CENTRAL CRESOL BASER": "Cresol Baser",
    "COOPERATIVA CENTRAL DE CRÉDITO UNICRED DO BRASIL - UNICRED DO BRASIL": "Unicred Brasil",
    "COOPERATIVA CENTRAL DE CRÉDITO DO ESTADO DE SÃO PAULO - SICOOB SÃO PAULO": "Sicoob SP",
    "CENTRAL DAS COOPERATIVAS DE ECONOMIA E CREDITO DO ESTADO DE MINAS GERAIS LTDA. - SICOOB CENTRAL CECREMGE": "Sicoob Cecremge",
    "COOPERATIVA CENTRAL DE CREDITO DO ESPIRITO SANTO - SICOOB CENTRAL ES": "Sicoob ES",
    "SICOOB COCRED COOPERATIVA DE CRÉDITO": "Sicoob Cocred",
    "SICOOB CREDICOM - COOPERATIVA DE ECONOMIA E CREDITO MUTUO DOS MEDICOS E PROFISSIONAIS DA AREA DE SAUDE DO BRASIL LTDA.": "Sicoob Credicom",
    "COOPERATIVA CENTRAL DE CREDITO DE MINAS GERAIS LTDA. - SICOOB CENTRAL CREDIMINAS": "Sicoob Crediminas",
    "COOPERATIVA DE CRÉDITO, POUPANÇA E INVESTIMENTO DE BRASÍLIA E REGIÃO - BRASÍLIA SICREDI": "Sicredi Brasília",
    "COOPERATIVA DE CRÉDITO, POUPANÇA E INVESTIMENTO DA REGIÃO DA PRODUÇÃO - SICREDI REGIÃO DA PRODUÇÃO": "Sicredi Região Produção",
    "COOPERATIVA DE CRÉDITO, POUPANÇA E INVESTIMENTO CREDIVERDE": "Crediverde",
    "COOPERATIVA CENTRAL DE CRÉDITO, POUPANÇA E INVESTIMENTO DO SUL E SUDESTE": "Sicredi Sul/Sudeste",
    "BANCO PACCAR S.A.": "Paccar Financial",
    "BANCO PACCAR": "Paccar Financial",
    "BANCO DO ESTADO DO PARÁ S.A.": "Banpará",
    "BCO DO EST. DO PA S.A.": "Banpará",
    "BANCO MASTER - PRUDENCIAL": "Banco Master",
}

TIPOS = {
    "Banco do Brasil": "Banco Público", "Caixa Econômica Federal": "Banco Público",
    "BNDES": "Banco Público", "Banco do Nordeste": "Banco Público",
    "Banco da Amazônia": "Banco Público", "Banrisul": "Banco Público",
    "Banestes": "Banco Público", "BDMG": "Banco Público", "BRDE": "Banco Público",
    "Banpará": "Banco Público",
    "Nubank": "Banco Digital", "Inter": "Banco Digital", "C6 Bank": "Banco Digital",
    "Agibank": "Banco Digital", "PagBank": "Banco Digital", "PicPay": "Banco Digital",
    "Neon": "Banco Digital", "Banco Original": "Banco Digital",
    "BTG Pactual": "Banco de Investimento", "XP Inc": "Banco de Investimento",
    "Goldman Sachs": "Banco de Investimento", "Morgan Stanley": "Banco de Investimento",
    "JP Morgan": "Banco de Investimento", "Bank of America": "Banco de Investimento",
    "Crédit Agricole": "Banco de Investimento", "UBS Brasil": "Banco de Investimento",
    "Société Générale": "Banco de Investimento", "Credit Suisse Brasil": "Banco de Investimento",
    "BR Partners": "Banco de Investimento", "Deutsche Bank Brasil": "Banco de Investimento",
    "Banco Mizuho": "Banco de Investimento", "China Construction Bank": "Banco de Investimento",
    "Banco Clássico": "Banco de Investimento", "Scotiabank Brasil": "Banco de Investimento",
    "Cielo": "Instituição de Pagamento", "Mercado Pago": "Instituição de Pagamento",
    "Stone": "Instituição de Pagamento", "Getnet (Santander)": "Instituição de Pagamento",
    "Rede (Itaú)": "Instituição de Pagamento", "CloudWalk": "Instituição de Pagamento",
    "Sicoob": "Cooperativa", "Sicredi": "Cooperativa", "Ailos": "Cooperativa",
    "Viacredi": "Cooperativa", "Credicitrus": "Cooperativa", "Sicoob Conexão": "Cooperativa",
    "Cooperforte": "Cooperativa", "Credicoamo": "Cooperativa", "Sisprime": "Cooperativa",
    "Sicoob Crediminas": "Cooperativa", "Sicoob SC/RS": "Cooperativa",
    "Cresol Baser": "Cooperativa", "Unicred Brasil": "Cooperativa",
    "Sicoob SP": "Cooperativa", "Sicoob Cecremge": "Cooperativa",
    "Sicoob ES": "Cooperativa", "Sicoob Cocred": "Cooperativa",
    "Sicoob Credicom": "Cooperativa", "Sicredi Brasília": "Cooperativa",
    "Sicredi Região Produção": "Cooperativa", "Crediverde": "Cooperativa",
    "Sicredi Sul/Sudeste": "Cooperativa",
    "Honda Financeira": "Financeira de Montadora", "GM Financial": "Financeira de Montadora",
    "Volkswagen Financial": "Financeira de Montadora", "CNH Industrial Capital": "Financeira de Montadora",
    "Stellantis Financial": "Financeira de Montadora", "Volvo Financial": "Financeira de Montadora",
    "Scania Financial": "Financeira de Montadora", "Mercedes-Benz Financial": "Financeira de Montadora",
    "Paccar Financial": "Financeira de Montadora",
    "Banco Carrefour": "Banco de Varejo", "Porto Seguro Financeira": "Financeira",
    "Crefisa": "Financeira",
}

def score_calc(b, i):
    sb = 50 if b >= 15 else (30 if b >= 10.5 else 10)
    si = 50 if i <= 10 else (30 if i <= 25 else (15 if i <= 50 else 5))
    return sb + si

corrigidos = 0
for b in raiox["bancos"]:
    nb = b["nome_bcb"].upper()
    novo = NOMES.get(nb)
    if not novo:
        # Remove sufixo Prudencial de qualquer forma
        novo = re.sub(r'\s*[-–]\s*prudencial\s*$', '', b.get("nome", b["nome_bcb"]), flags=re.IGNORECASE).strip()
        # Encurta nomes de cooperativas muito longos
        if len(novo) > 40 and ("cooperativ" in novo.lower() or "sicoob" in novo.lower() or "sicredi" in novo.lower()):
            # Pega palavras-chave
            if "sicoob" in novo.lower():
                m = re.search(r'sicoob\s+\S+', novo, re.IGNORECASE)
                novo = m.group(0).title() if m else "Sicoob " + novo[:20]
            elif "sicredi" in novo.lower():
                m = re.search(r'sicredi\s+\S+', novo, re.IGNORECASE)
                novo = m.group(0).title() if m else "Sicredi " + novo[:20]
            elif "unicred" in novo.lower():
                novo = "Unicred Brasil"
            elif "cresol" in novo.lower():
                novo = "Cresol " + novo.split("cresol")[-1][:15].strip().title()
            else:
                novo = novo[:38].rsplit(' ', 1)[0] + "..."
    b["nome"] = novo
    if novo in TIPOS:
        b["tipo"] = TIPOS[novo]
    # Recalcula score
    bl = b.get("basileia", 0)
    im = b.get("imobilizacao", 0)
    if bl > 0:
        s = score_calc(bl, im)
        b["score"] = s
        b["situacao"] = "verde" if s >= 80 else ("amarelo" if s >= 50 else "vermelho")
    # Master liquidado
    if "master" in novo.lower():
        b["score"] = 0
        b["situacao"] = "vermelho"
        b["fonte_dados"] = "LIQUIDADO - BCB decretou liquidacao extrajudicial em Nov/2025"
        b["rating_perspectiva"] = "Liquidado"
    b.pop("_cod_bcb", None)
    corrigidos += 1

# Re-ordena: score desc, ativo desc
raiox["bancos"].sort(key=lambda x: (-x["score"], -x.get("ativo_total", 0)))

with open("C:/Users/maico/Desktop/raio-x-bancario/data/raiox.json", "w", encoding="utf-8") as f:
    json.dump(raiox, f, ensure_ascii=False, indent=2)

print(f"Corrigidos: {corrigidos} | Total: {raiox['total']}")
print("\nTop 30 (score + ativo):")
for b in raiox["bancos"][:30]:
    at = b.get("ativo_total", 0)
    lb = f"R${at/1e12:.2f}tri" if at >= 1e12 else f"R${at/1e9:.0f}bi"
    print(f"  {b['nome']:<35} {b['tipo']:<28} B={b['basileia']:5.1f}%  score={b['score']}  {lb}")
