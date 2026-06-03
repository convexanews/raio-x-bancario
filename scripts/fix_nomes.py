import json

with open("C:/Users/maico/Desktop/raio-x-bancario/data/raiox.json", encoding="utf-8") as f:
    d = json.load(f)

NOMES = {
    "BB - PRUDENCIAL": "Banco do Brasil",
    "BANCO DO BRASIL": "Banco do Brasil",
    "CAIXA ECONOMICA FEDERAL - PRUDENCIAL": "Caixa Econômica Federal",
    "CAIXA ECONOMICA FEDERAL": "Caixa Econômica Federal",
    "ITAU UNIBANCO": "Itaú Unibanco",
    "BRADESCO": "Bradesco",
    "SANTANDER": "Santander Brasil",
    "BTG PACTUAL": "BTG Pactual",
    "SAFRA": "Safra",
    "NU PAGAMENTOS": "Nubank",
    "BCO COOPERATIVO SICREDI": "Sicredi",
    "BANCOOB - PRUDENCIAL": "Sicoob",
    "BANCO SICOOB": "Sicoob",
    "BNDES - PRUDENCIAL": "BNDES",
    "XP INVESTIMENTOS CCTVM S/A": "XP Inc",
    "CITIBANK - PRUDENCIAL": "Citibank Brasil",
    "JP MORGAN CHASE - PRUDENCIAL": "JP Morgan",
    "BANCO MASTER - PRUDENCIAL": "Banco Master",
    "BCO DAYCOVAL S.A - PRUDENCIAL": "Daycoval",
    "VOTORANTIM": "Votorantim",
    "BANRISUL": "Banrisul",
    "C6 BANK": "C6 Bank",
    "BANCO INTER S.A.": "Inter",
    "AGIBANK": "Agibank",
    "ABC-BRASIL - PRUDENCIAL": "ABC Brasil",
    "SOFISA": "Sofisa",
    "BCO PINE S.A. - PRUDENCIAL": "Pine",
    "BMG": "BMG",
    "BS2": "BS2",
    "PAGSEGURO": "PagBank",
    "PICPAY": "PicPay",
    "SCOTIABANK BRASIL - PRUDENCIAL": "Scotiabank Brasil",
    "BNP PARIBAS BRASIL": "BNP Paribas",
    "BANCO ORIGINAL": "Banco Original",
    "BCO MUFG BRASIL S.A. - PRUDENCIAL": "Banco MUFG",
    "GOLDMAN SACHS - PRUDENCIAL": "Goldman Sachs",
    "BOFA MERRILL LYNCH - PRUDENCIAL": "Bank of America",
    "MORGAN STANLEY - PRUDENCIAL": "Morgan Stanley",
    "CREDIT AGRICOLE - PRUDENCIAL": "Crédit Agricole",
    "BANCO HSBC - PRUDENCIAL": "HSBC Brasil",
    "UBS (BRASIL) - PRUDENCIAL": "UBS Brasil",
    "HONDA - PRUDENCIAL": "Honda Financeira",
    "GM - PRUDENCIAL": "GM Financial",
    "APE POUPEX - PRUDENCIAL": "POUPEX",
    "BCO CLASSICO S.A. - PRUDENCIAL": "Banco Clássico",
    "BCO DES. DE MG S.A. - PRUDENCIAL": "BDMG",
    "MERCANTIL DO BRASIL": "Mercantil do Brasil",
    "BCO DO NORDESTE DO BRASIL S.A.": "Banco do Nordeste",
    "BCO DA AMAZONIA S.A.": "Banco da Amazônia",
    "BANESTES": "Banestes",
    "RODOBENS": "Rodobens",
    "BOCOM BBM": "Bocom BBM",
    "NEON PAGAMENTOS IP": "Neon",
    "BCO SUMITOMO MITSUI BRASIL S.A.": "Banco Sumitomo Mitsui",
    "SOCIETE GENERALE - PRUDENCIAL": "Société Générale",
    "SOCIETE GENERALE": "Société Générale",
    "C0086581": "Banco Rabobank",
    "RABOBANK BRASIL": "Banco Rabobank",
    "BCO RABOBANK INTL BRASIL S.A.": "Banco Rabobank",
    "COOPERATIVA CENTRAL DE CREDITO - AILOS": "Ailos",
    "COOPERATIVA DE CREDITO VALE DO ITAJAI - VIACREDI": "Viacredi",
    "COOPERATIVA DE CREDITO CREDICITRUS": "Credicitrus",
    "COOPERATIVA DE CREDITO CONEXAO - SICOOB CONEXAO": "Sicoob Conexão",
    "COOPERFORTE COOPERATIVA DE CREDITO": "Cooperforte",
    "COOPERATIVA CENTRAL DE CREDITO, POUPANCA E INVESTIMENTO DO SUL E SUDESTE": "Ccredsol",
    "CREDICOAMO CREDITO RURAL COOPERATIVA": "Credicoamo",
    "CIELO IP - PRUDENCIAL": "Cielo",
    "MERCADO PAGO IP - PRUDENCIAL": "Mercado Pago",
    "MERCADO PAGO": "Mercado Pago",
    "BCB BANCO DE CREDITO S.A.": "BCB Banco de Crédito",
    "BANCO ABC BRASIL S.A.": "ABC Brasil",
    "BCO BMG S.A.": "BMG",
    "BCO C6 S.A.": "C6 Bank",
    "BCO INTER S.A.": "Inter",
    "BCO ORIGINAL S.A.": "Banco Original",
    "BCO BS2 S.A.": "BS2",
}

TIPOS = {
    "Banco do Brasil": "Banco Público",
    "Caixa Econômica Federal": "Banco Público",
    "BNDES": "Banco Público",
    "Banco do Nordeste": "Banco Público",
    "Banco da Amazônia": "Banco Público",
    "Banrisul": "Banco Público",
    "Banestes": "Banco Público",
    "BDMG": "Banco Público",
    "Nubank": "Banco Digital",
    "Inter": "Banco Digital",
    "C6 Bank": "Banco Digital",
    "Agibank": "Banco Digital",
    "PagBank": "Banco Digital",
    "PicPay": "Banco Digital",
    "Neon": "Banco Digital",
    "Banco Original": "Banco Digital",
    "BTG Pactual": "Banco de Investimento",
    "XP Inc": "Banco de Investimento",
    "Goldman Sachs": "Banco de Investimento",
    "Morgan Stanley": "Banco de Investimento",
    "JP Morgan": "Banco de Investimento",
    "Bank of America": "Banco de Investimento",
    "Crédit Agricole": "Banco de Investimento",
    "UBS Brasil": "Banco de Investimento",
    "Société Générale": "Banco de Investimento",
    "Sicoob": "Cooperativa",
    "Sicredi": "Cooperativa",
    "Ailos": "Cooperativa",
    "Viacredi": "Cooperativa",
    "Credicitrus": "Cooperativa",
    "Sicoob Conexão": "Cooperativa",
    "Cooperforte": "Cooperativa",
    "Credicoamo": "Cooperativa",
    "Honda Financeira": "Banco de Montadora",
    "GM Financial": "Banco de Montadora",
}

LIQUIDADOS = {"Banco Master"}

for b in d["bancos"]:
    nome_key = b["nome_bcb"].upper()
    novo = NOMES.get(nome_key)
    if not novo:
        novo = b["nome"].replace(" - Prudencial","").replace(" - PRUDENCIAL","").strip()
        if novo.startswith("C0") or novo == novo.upper():
            novo = b["nome_bcb"].replace(" - PRUDENCIAL","").replace(" - Prudencial","").title()
    b["nome"] = novo

    if novo in TIPOS:
        b["tipo"] = TIPOS[novo]

    if novo in LIQUIDADOS:
        b["fonte_dados"] = "LIQUIDADO - BCB decretou liquidacao extrajudicial em Nov/2025"
        b["score"] = 0
        b["situacao"] = "vermelho"
        b["rating_perspectiva"] = "Liquidado"

    b.pop("_cod_bcb", None)

d["bancos"].sort(key=lambda x: (-x["score"], -x["basileia"]))

with open("C:/Users/maico/Desktop/raio-x-bancario/data/raiox.json", "w", encoding="utf-8") as f:
    json.dump(d, f, ensure_ascii=False, indent=2)

print(f"Total: {d['total']} bancos | Periodo: {d['periodo']}")
print("\nTop 25:")
for b in d["bancos"][:25]:
    print(f"  {b['nome']:35} B={b['basileia']:5.1f}%  {b['tipo']}")

print("\nTop 10 maiores por ativo:")
top = sorted(d["bancos"], key=lambda x: -x.get("ativo_total",0))
for b in top[:10]:
    at = b.get("ativo_total", 0)
    print(f"  {b['nome']:35} Ativo={at:,.0f}  B={b['basileia']:.1f}%")
