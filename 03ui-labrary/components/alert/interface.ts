export type Kind = 'info' | 'positive' | 'negative' | 'warning';
export type KindMap = Record<Kind, string>;
export interface AlertProps {
  kind?: Kind;
}
