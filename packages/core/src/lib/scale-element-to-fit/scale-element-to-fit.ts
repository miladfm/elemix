import { deepmerge } from '../common/common.util';
import { ContainerSelector, ScalingMode, ScalingOptions, ScalingResult, TargetSelector } from './scale-element-to-fit.model';
import { getContainer, getTarget, validateContainer, validateGap, validateTarget } from './scale-element-to-fit.util';

const DEFAULT_OPTIONS: ScalingOptions = {
  gap: {
    vertical: 0,
    horizontal: 0,
  },
  fitType: ScalingMode.Contain,
};

export function scaleElementToFit(
  _target: TargetSelector,
  _container: ContainerSelector,
  _options: Partial<ScalingOptions> = {}
): ScalingResult {
  const option = deepmerge(DEFAULT_OPTIONS, _options);
  const target = getTarget(_target);
  const container = getContainer(_container, option.gap);

  validateContainer(container);
  validateTarget(target);
  validateGap(container, option.gap);

  const widthRadio = container.effectiveWidth / target.effectiveWidth;
  const heightRadio = container.effectiveHeight / target.effectiveHeight;
  const isScalingByWidth = target.aspectRatio >= container.aspectRatio;

  // prettier-ignore
  const scaleFactor = option.fitType === ScalingMode.Contain
    ? (isScalingByWidth ? widthRadio : heightRadio)
    : (isScalingByWidth ? heightRadio : widthRadio);

  const dimensions = {
    width: target.effectiveWidth * scaleFactor,
    height: target.effectiveHeight * scaleFactor,
  };

  const relativePosition = {
    x: (container.width - dimensions.width) / 2,
    y: (container.height - dimensions.height) / 2,
  };

  return { scale: scaleFactor, dimensions, relativePosition };
}
