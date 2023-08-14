import { Evento } from './Evento';

export interface Lote {
  Id: number;
  Nome?: string;
  Preco: DoubleRange;
  DataInicio?: Date;
  DataFim?: Date;
  Quantidade: number;
  EventoID: number;
  Evento?: Evento;
}
