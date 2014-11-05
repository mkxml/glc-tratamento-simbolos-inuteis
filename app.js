(function() {

  "use strict";

  // ----------------- INTERFACE --------------------- //

  // Importando módulo commander para exibir a CLI
  var programa = require("commander");

  // Importando o módulo de filesystem para lidar com leitura e escrita
  // de arquivos em disco
  var fs = require("fs");

  //Importando módulo StringDecoder para tratar encoding de TXTs
  var StringDecoder = require("string_decoder").StringDecoder;
  var decoder = new StringDecoder("utf8");

  programa
    .version("1.0.0")
    .option("-i, --input <file>", "Arquivo TXT de entrada")
    .option("-o, --output <file>", "Caminho para depósito do TXT de saída")
    .parse(process.argv);

  if(!programa.input){
    console.warn("Você precisa fornecer um TXT de entrada. Para ajuda consulte o help usando -h");
    return;
  }

  try {
    fs.readFile(programa.input, function (erro, dados) {
      if (erro) {
        console.error("Arquivo input não existe ou com acesso bloqueado!");
        return;
      }
      salva(removeSimbolosInuteis(decoder.write(dados)));
    });
  }
  catch(e) {
    console.error("Arquivo input não existe ou com acesso bloqueado!");
  }

  // --------- ALGORITMO ELIMINAÇÃO SIMBOLOS INÚTEIS ----------- //

  // Função que processam a remoção dos símbolos inúteis
  function removeSimbolosInuteis(txt) {
    // Faz o parsing do TXT separando em arranjos
    var parsedTXT = parseTXT(txt);

    // Captura o conjunto original de variáveis
    var v = parsedTXT[0];

    // Captura o conjunto original de terminais
    var t = parsedTXT[1];

    // Captura o símbolo inicial
    var inicial = parsedTXT[2][0];

    // Captura o conjunto de regras original
    var p = parsedTXT.splice(3, parsedTXT.length);

    // ETAPA 1: Garantir que qualquer variável gere palavra de terminais
    var c = 0;
    var v1 = [];
    var p1 = [];

    do {
      c = v1.length;
      v1 = calculaVariavelTerminal(t, v, v1, p);
    } while(c !== v1.length);

    // Gera as novas produções
    p1 = geraNovasProducoes(p, v1.concat(t));

    // ETAPA 2: Garantir que qualquer símbolo é atingível a partir do símbolo inicial
    var cv = 0;
    var ct = 0;
    var p2 = [];
    var t2 = [];
    var v2 = [inicial];

    do {
      cv = v2.length;
      ct = t2.length;
      v2 = calculaFecho(v2, v1, p1);
      t2 = calculaFechoVariavel(v2, t, p1);
    } while(cv !== v2.length && ct !== t2.length);

    // Gera as novas produções
    p2 = geraNovasProducoes(p1, v2.concat(t2));

    // Retorna o conjunto de resultados para a impressão do TXT
    return [t2, v2, inicial, p2];
  }

  function calculaFecho(variaveis, simbolos, producoes) {
    for(var i = 0, l = variaveis.length; i < l; i++) {
      for(var j = 0, l2 = simbolos.length; j < l2; j++) {
        if(existeProducao(producoes, variaveis[i], simbolos[j])) {
          if(variaveis.indexOf(simbolos[j]) < 0)
            variaveis.push(simbolos[j]);
        }
      }
    }
    return variaveis;
  }

  function calculaFechoVariavel(variaveis, simbolos, producoes) {
    var terminais = [];
    for(var i = 0, l = variaveis.length; i < l; i++) {
      for(var j = 0, l2 = simbolos.length; j < l2; j++) {
        if(existeProducao(producoes, variaveis[i], simbolos[j])) {
          if(terminais.indexOf(simbolos[j]) < 0)
            terminais.push(simbolos[j]);
        }
      }
    }
    return terminais;
  }

  function geraNovasProducoes(producoes, simbolos) {
    var de, para, novasProducoes = [];
    for(var i = 0, l = producoes.length; i < l; i++) {
      if(producoes[i][0]) {
        de = producoes[i][0];
        para = producoes[i].slice(2, producoes[i].length);
        if(simbolos.indexOf(de) >= 0 && existeSimbolosNoArranjo(simbolos, para))
          novasProducoes.push(producoes[i]);
      }
    }
    return novasProducoes;
  }

  function calculaVariavelTerminal(terminais, variaveis, v1, producoes) {
    var tv1 = v1[0] ? v1 : terminais;
    for(var i = 0, l = variaveis.length; i < l; i++) {
      for(var j = 0, l2 = tv1.length; j < l2; j++) {
        if(existeProducao(producoes, variaveis[i], tv1[j])) {
          if(v1.indexOf(variaveis[i]) < 0)
            v1.push(variaveis[i]);
        }
      }
    }
    return v1;
  }

  function existeProducao(producoes, s1, s2) {
    var de, para;
    for(var i = 0, l = producoes.length; i < l; i++) {
      if(producoes[i][0]) {
        de = producoes[i][0];
        para = producoes[i].slice(2, producoes[i].length);
        if(de === s1 && para.indexOf(s2) >= 0) return true;
      }
    }
    return false;
  }

  //Função que valida a existência de um símbolo em um arranjo bi-dimensional
  function existeSimbolosNoArranjo(simbolos, arr) {
    for(var i = 0, l = simbolos.length; i < l; i++) {
      for(var j = 0, l2 = arr.length; j < l2; j++) {
        if(simbolos[i] === arr[j]) return true;
      }
    }
    return false;
  }

  // --------- LEITURA E GRAVAÇÃO DO TXT ------------- //

  // Função que interpreta o TXT sem usar funções de parsing do JavaScript
  function parseTXT(txt) {
    var linha = 0;
    var s = "";
    var parsedTXT = [];
    parsedTXT[linha] = [];
    for(var i = 0, l = txt.length; i < l; i++) {
      if(txt.charCodeAt(i) === 13 || txt.charCodeAt(i) === 10) {
        parsedTXT[linha].push(s);
        s = "";
        linha++;
        parsedTXT[linha] = [];
        continue;
      }
      if(txt[i] === " ") {
        parsedTXT[linha].push(s);
        s = "";
        continue;
      }
      s += txt[i];
    }
    return parsedTXT;
  }

  // Função que salva uma string em um txt no caminho passado para o programa
  function salva(dados) {
    return "";
  }

}());
