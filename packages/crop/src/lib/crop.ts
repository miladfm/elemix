import { DomSelector } from '@elemix/core';
import { CropOptions } from './crop.model';

const DEFAULT_OPTIONS: CropOptions = {};

export class Crop {
  options: CropOptions;

  constructor(element: DomSelector, imgSrc: string, options: Partial<CropOptions> = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
  }
}
