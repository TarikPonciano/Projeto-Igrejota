import * as moment from 'moment';

export class Noticia {
	id: number;
	titulo: string;
	conteudo: string;
	dataCriacao: moment.Moment;
	dataEdicao: moment.Moment;
	imagemDestaque: string;
}