export default interface Stock {
  id: string;
  symbol: string;
  name: string;
  value?: number;
  volume?: number;
  open?: number;
  close?: number;
  gains?: number;
}
