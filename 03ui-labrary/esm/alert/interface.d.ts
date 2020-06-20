export declare type Kind = 'info' | 'positive' | 'negative' | 'warning';
export declare type KindMap = Record<Kind, string>;
export interface AlertProps {
    kind?: Kind;
}
