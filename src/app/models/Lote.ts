import { Evento } from './Evento';

export interface Lote {
  id: number;
  nome?: string;
  preco: DoubleRange;
  dataInicio?: Date;
  dataFim?: Date;
  quantidade: number;
  eventoID: number;
  evento?: Evento;
}
