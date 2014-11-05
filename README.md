Remoção dos símbolos inúteis em uma GLC
=======================================

Este é um pequeno projeto escrito em JavaScript em cima de Node.JS que
implementa um algoritmo de remoção de símbolos inúteis em uma gramática livre
do contexto (GLC).

O programa foi desenvolvido para a disciplina de
**Linguagens formais e Autômatos** da [Universidade Feevale](http://feevale.br).

## Como utilizar

**Para utilizar o programa é simples, basta seguir os passos:**

- Faça um `git clone` do projeto;
- Se você ainda não tem Node.JS instalado no seu
  computador [instale-o](http://nodejs.com/download);
- Junto com o Node.JS foi instalado um software chamado NPM, precisamos dele;
- Abra seu Terminal (prompt de comando) e vá até o diretório do clone feito;
- Execute `npm install` e as dependências para o programa serão instaladas;
- Agora basta rodar o programa com `node app.js -i input.txt`;

**O programa suporta alguns parâmetros úteis para customizar seu funcionamento:**

 - `-i` para indicar qual o arquivo TXT de input você quer utilizar;
 - `-o` para indicar o arquivo a ser criado para a saída do programa em TXT por
    padrão o software vai criar um arquivo chamado `output.txt` no diretório
    local;
 - `-f` para indicar o formato de quebra de linha, são suportados o `LF` do Unix
    e o `CRLF` do Windows;
 - `-h` exibe o help;


## Regras

Para ser compatível com o programa o programa deve respeitar algumas
regras, são elas:

- A primeira linha do input deve declarar as **variáveis** utilizadas na GLC;
- A segunda linha do input deve declarar os **terminais** utilizados na GLC;
- A terceira linha do input deve indicar a **varíavel inicial** da GLC;
- Da quarta linha em diante devem estar dispostas as **regras de produção** da GLC;

O programa, funcionando corretamente, deve salvar um outro TXT seguindo as mesmas
regras mostradas anteriormente.

### Exemplo de input

```
expr fator termo id nil
x y + * ( ) PI
expr
expr -> termo
expr -> expr + termo
termo -> fator
termo -> termo * fator
fator -> id
fator -> PI
fator -> ( expr )
id -> x
id -> y
nil ->
```

### Output
```
expr fator termo id
x y + * ( ) PI
expr
expr -> termo
expr -> expr + termo
termo -> fator
termo -> termo * fator
fator -> id
fator -> PI
fator -> ( expr )
id -> x
id -> y
```

## Tecnologias e estruturas usadas

O software é baseado em [Node.JS](http://nodejs.com) e usa a
[NPM](http://npmjs.com) para controle de dependências e versionamento.

É 100% escrito em JavaScript dentro das regras do projeto de não utilizar
funções de parsing da linguagem. Para conseguir fazer o parsing do input
fornecido utilizamos arrajnos (*arrays*) em cascata com loops validando cada
símbolo, separando-os pelo espaço em branco e quebra de linha.

Além disso utilizamos [Git](http://git-scm.com) para controle de versões do
código e hospedamos o projeto aqui no GitHub.

## Como funciona

O programa funciona em quatro etapas.

1) Primeiramente ele faz o parsing do TXT, separando cada linha em um vetor e depois
procura por espaços em branco separando palavras e coloca cada palavra em um célula
do vetor da linha.

O parser também separa os significados dos símbolos utilizando as regras definidas
acima. Criando variáveis para os grupos: **terminais**, **variáveis**, **símbolo inicial** e
**regras de produção**.

2) Depois o programa executa a primeira parte do algoritmo que garante que todas
as varáveis geram, direta ou indiretamente, terminais. Para fazer isso ele segue
o seguinte procedimento:

  - 1) Considera `v1` todas as variáveis que geram terminais **diretamente**;
  - 2) Junta ao `v1` todas as variáveis que geram alguma variável do conjunto `v1`;
  - 3) Repete 2 até que a cardinalidade de `v1` não mude;

3) Aí o programa executa um segundo algoritmo, para garantir que todas as variáveis
`v1` são atingidas apartir do **símbolo inicial**. Para fazer isso ele faz o seguinte:

  - 1) Considera `v2` todas as variáveis que são atingidas pelo **símbolo incial**;
  - 2) Junta ao `t2` todas os terminais atingidos pelas variáveis do `v2`;
  - 3) Junta ao `v2` todas as variáveis atingidas por `v2`;
  - 4) Repete 2 e 3 até que as cardinalidades de `t2` e `v2` não mudem;

4) O último passo é a impressão do TXT de volta para o usuário, seguindo o mesmo
layout de entrada imposto.

## Autores

- [Matheus Kautzmann](http://github.com/mkautzmann)
- [Rômulo Alves](http://github.com/romuloalves)

## Licença

[MIT LICENSE](LICENSE)
