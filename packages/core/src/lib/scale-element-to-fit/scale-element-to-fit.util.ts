import { DimensionalGap } from '../common/common.model';
import { isImage } from '../common/common.util';
import { Dom } from '../dom/dom';
import { ContainerSelector, ScalingElement, TargetSelector } from './scale-element-to-fit.model';

/**
 * No unit tests; implicitly tested via public functions that use this private helper.
 */

export function getTarget(_target: TargetSelector): ScalingElement {
  const target = new Dom(_target);
  const effectiveWidth = target.naturalWidth ?? target.width;
  const effectiveHeight = target.naturalHeight ?? target.height;
  return {
    isImage: isImage(target.nativeElement),
    width: effectiveWidth,
    height: effectiveHeight,
    effectiveWidth,
    effectiveHeight,
    aspectRatio: effectiveWidth / effectiveHeight,
  };
}

export function getContainer(_container: ContainerSelector, gap: DimensionalGap): ScalingElement {
  const container = new Dom(_container);
  const totalHorizontalGap = gap.horizontal * 2;
  const totalVerticalGap = gap.vertical * 2;

  const effectiveWidth = container.width - totalHorizontalGap;
  const effectiveHeight = container.height - totalVerticalGap;
  return {
    isImage: isImage(container.nativeElement),
    width: container.width,
    height: container.height,
    effectiveWidth,
    effectiveHeight,
    aspectRatio: effectiveWidth / effectiveHeight,
  };
}

export function validateContainer(container: ScalingElement) {
  if (container.isImage) {
    throw new Error(`container element can not be an HTMLImageElement.`);
  }

  if (container.width === 0 || container.height === 0) {
    throw new Error('The width or height of the container HTMLElement should be greater than zero.');
  }
}

export function validateTarget(target: ScalingElement) {
  if (target.effectiveWidth === 0 || target.effectiveHeight === 0) {
    throw new Error(
      target.isImage
        ? 'The naturalWidth or naturalHeight of the target HTMLImageElement should be greater than zero.'
        : 'The width or height of the target HTMLElement should be greater than zero.'
    );
  }
}

export function validateGap(container: ScalingElement, gap: DimensionalGap) {
  if (gap.horizontal < 0 || gap.vertical < 0) {
    throw new Error('The provided gap value should not be negative');
  }

  if (container.effectiveWidth <= 0) {
    throw new Error('The provided horizontal gap value is too large for the container dimensions');
  }

  if (container.effectiveHeight <= 0) {
    throw new Error('The provided vertical gap value is too large for the container dimensions');
  }
}
