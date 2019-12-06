import { Aluno } from './aluno';
import { Bolsista } from './bolsista';
import * as moment from 'moment';

export class Presenca {
	aluno: Aluno
	bolsista: string
	diaPresenca: moment.Moment
}