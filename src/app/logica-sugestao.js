class Jogo {
	init(nome,minJogadores,maxJogadores,tempoJogo,categorias) {
		self.nome = nome;
		jogadores = {min: minJogadores, max: maxJogadores};
		self.tempoJogo = tempoJogo;
		self.categorias = categorias;
	}

	description() {
		var textCategorias = "/"
		for (var i = 0; i < categorias.length; i++) {
			textCategorias += categorias[i]+"/";
		}
		return self.nome+" - "+self.jogadores.min+"-"+self.jogadores.max+" jogadores | "+self.tempoJogo+" min | "+textCategorias;
	}
}

function checarTempo(tempoDisponivel, margem, jogo) {
	return tempoDisponivel >= (jogo.tempoJogo - margem) && tempoDisponivel <= (jogo.tempoJogo + margem);
}

function checarJogadores(nJogadores, jogo) {
	return nJogadores >= jogo.jogadores.min || nJogadores <= jogo.jogadores.max;
}

function pesquisar(nJogadores, tempoEscolhido, categorias) {
	var jogosPossiveis, jogosSugeridos;
	jogosPossiveis = [];
	jogosSugeridos = [];

	for (let jogo in allGames) {
		if (checarJogadores(nJogadores, jogo)) {
			jogosSugeridos.append(jogo);
		}
		if (checarJogadores(nJogadores, jogo)) {
			jogosPossiveis.append(jogo);
		}
	}


	for (var i = 0; i < jogosPossiveis.length; i++) {
		let jogo = jogosPossiveis[i];
		if (!checarTempo(tempoEscolhido, 30, jogo)) {
			jogosPossiveis.splice(i, 1);
		}
	}
	for (var i = 0; i < jogosSugeridos.length; i++) {
		let jogo = jogosSugeridos[i];
		if (!checarTempo(tempoEscolhido, 10, jogo)) {
			jogosPossiveis.splice(i, 1);
		}
	}

	var maxEquivalente = 0
	for (var i = 0; i < jogosSugeridos.length; i++) {
		let jogo = jogosSugeridos[i];
		var nEquivalente = 0;
		for (categoria in jogo.categorias) {
			if (categorias.includes(categoria)) {
				nEquivalente++;
			}
		}
		if (nEquivalente <= 0) {
			jogosSugeridos.splice(i,1);
		} else if (nEquivalente > maxEquivalente) {
			jogosSugeridos.unshift(jogosSugeridos.splice(i,1)[0]);
			maxEquivalente = nEquivalente;
		}
	}

	return {sugeridos: jogosSugeridos, possiveis: jogosPossiveis};
}



for (var i = 0; i < results.sugeridos.length; i++) {
	console.log(results.sugeridos[i]);	
}

for (var i = 0; i < results.possiveis.length; i++) {
	console.log(results.possiveis[i]);
}