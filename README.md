# Portfólio — Ricardo Medeiros

🔗 **Site:** https://ricardomedeiros1.github.io/meuportfolio/

Site estático (HTML, CSS e JavaScript puros, sem build nem dependências) com:

- apresentação, skills, trajetória e formação;
- projetos demonstrativos **com dados 100% fictícios**;
- uma ferramenta funcional: calculadora de link budget óptico.

## Rodando localmente

```bash
python3 -m http.server 8000
# abra http://localhost:8000
```

Também funciona abrindo o `index.html` direto no navegador.

## Publicação (GitHub Pages)

O site é estático e não precisa de build. Para publicar:

1. No GitHub, abra **Settings → Pages**.
2. Em **Build and deployment → Source**, escolha **Deploy from a branch**.
3. Selecione a branch **`main`** e a pasta **`/ (root)`**, e clique em **Save**.

A cada merge na `main`, o site é atualizado automaticamente em alguns minutos, em
`https://ricardomedeiros1.github.io/meuportfolio/`. O arquivo `.nojekyll` desativa o
processamento Jekyll do GitHub, que não é necessário aqui.

## Estrutura

| Arquivo | Função |
| --- | --- |
| `index.html` | Página única com todas as seções |
| `style.css` | Estilos (tema escuro, responsivo) |
| `script.js` | Menu mobile, animações e calculadora |
| `images/` | Foto, logo (`logo.svg`, usado também como favicon) e ícone para iOS |
| `sobre.html`, `escolaridade.html`, `historico.html` | Redirecionam para as seções equivalentes do `index.html` |

## Privacidade

- Nenhum projeto aqui usa dado real de empresa ou cliente: nomes, equipamentos, IPs e
  valores são inventados.
- Evite publicar neste repositório: e-mail, telefone, endereço, data de nascimento,
  nomes de clientes, prints de sistemas internos, IPs, códigos de credenciais de
  certificados ou credenciais reais.
- O conteúdo de experiência, formação e certificados segue o que já é público no LinkedIn.
  O sinal "buscando emprego" do LinkedIn é visível só para recrutadores e, por isso,
  não aparece no site.
- O site não usa cookies nem rastreadores. A única chamada externa é a fonte Poppins
  (Google Fonts); para eliminá-la, hospede a fonte localmente.
