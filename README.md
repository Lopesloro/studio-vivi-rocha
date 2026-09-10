# Studio Vivi Rocha — site

Site institucional de Vilma "Vivi" Rocha, cabeleireira na Ilha do Governador (Galeão), Rio de Janeiro.

HTML, CSS e JavaScript puros. Sem framework, sem build, sem backend.
O agendamento acontece por link direto de WhatsApp, com texto pré-preenchido diferente
em cada página — assim dá para saber de qual página veio a cliente sem nenhuma
ferramenta de análise.

## Estrutura

```
index.html              home
sobre.html              a Vivi, o método, a formação
servicos.html           hub de serviços
servicos/mechas.html
servicos/cortes.html
servicos/terapia-capilar.html
resultados.html         galeria
contato.html            endereço, telefones, agendamento
404.html
assets/css/style.css    sistema visual completo em tokens
assets/js/main.js       navegação, reveal, barra de ação
```

## Rodar localmente

```bash
python3 -m http.server 8899
```

## Estado

Prévia para aprovação. Está com `noindex` até que:

1. O endereço seja confirmado pela Vivi (a fonte pública é de 2019).
2. O domínio final esteja de pé.

Documentação de decisão: `Cofre/_ai/projects/studio-vivi-rocha/`.
