import { Categoria } from './categoria'

export class Jogo {
	id: number;
	nome: string;
	minJogadores: number;
	maxJogadores: number;
	tempoJogo: number;
	categorias: Categoria[];
	imagemJogo: string;
	descricao: string;
	linkManual: string;
	linkDesenvolvedor: string;
	emDestaque: Boolean;
}